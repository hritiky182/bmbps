"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BoardPack, BoardDocument, Annotation } from "@/types";
import {
  Layers,
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bookmark,
  MessageSquare,
  Highlighter,
  StickyNote,
  Share2,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Eye,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  FileCheck,
  Lock,
  WifiOff,
} from "lucide-react";

export const BoardPacksView: React.FC = () => {
  const {
    boardPacks,
    meetings,
    documents,
    annotations,
    addAnnotation,
    deleteAnnotation,
    publishBoardPack,
    markPackAsRead,
    currentUser,
    currentRole,
    activePackId,
    setActivePackId,
    isOffline,
  } = useApp();

  // Mode: "viewer" or "builder"
  const [viewMode, setViewMode] = useState<"viewer" | "builder">("viewer");
  const [selectedPackId, setSelectedPackId] = useState<string>(activePackId || "pack-01");
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-01");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeSideTab, setActiveSideTab] = useState<"annotations" | "bookmarks" | "metadata">("annotations");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [docSearchQuery, setDocSearchQuery] = useState<string>("");

  // New annotation state
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteIsPrivate, setNewNoteIsPrivate] = useState(true);
  const [newNoteType, setNewNoteType] = useState<"sticky_note" | "highlight" | "comment">("sticky_note");

  const currentPack = boardPacks.find((p) => p.id === selectedPackId) || boardPacks[0];
  const currentMeeting = meetings.find((m) => m.id === currentPack?.meetingId);
  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const docAnnotations = annotations.filter((a) => a.documentId === currentDoc?.id);
  const isReviewed = currentPack?.readStatus[currentUser.id];

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addAnnotation({
      documentId: currentDoc.id,
      pageNumber: currentPage,
      text: newNoteText.trim(),
      type: newNoteType,
      isPrivate: newNoteIsPrivate,
      color: newNoteType === "sticky_note" ? "#fef08a" : newNoteType === "highlight" ? "#a7f3d0" : "#bfdbfe",
    });

    setNewNoteText("");
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Pack Selector & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPackId}
                onChange={(e) => {
                  setSelectedPackId(e.target.value);
                  setActivePackId(e.target.value);
                }}
                className="font-bold text-sm bg-transparent border-0 text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                {boardPacks.map((p) => (
                  <option key={p.id} value={p.id} className="dark:bg-slate-900">
                    {p.title} ({p.version})
                  </option>
                ))}
              </select>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {currentPack.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Linked: {currentMeeting?.title || "84th Ordinary Board"} • {currentPack.totalPages} total pages
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Review completion indicator */}
          <button
            onClick={() => markPackAsRead(currentPack.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isReviewed
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isReviewed ? "text-emerald-600" : "text-slate-400"}`} />
            <span>{isReviewed ? "Marked as Reviewed" : "Mark as Reviewed"}</span>
          </button>

          {/* Mode Switcher: Viewer vs Builder */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode("viewer")}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === "viewer"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Document Viewer
            </button>
            {(currentRole === "secretary" || currentRole === "admin") && (
              <button
                onClick={() => setViewMode("builder")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "builder"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                Pack Builder
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE BOARD PACK VIEWER */}
      {viewMode === "viewer" && (
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${
            isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-4" : ""
          }`}
        >
          {/* Left Panel: Agenda Tree & Document Thumbnails (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col max-h-[800px] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Agenda & Docket Papers
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                {currentPack.documentIds.length} Papers
              </span>
            </div>

            {/* Documents List in Pack */}
            <div className="flex-1 overflow-y-auto space-y-1.5 py-3 pr-1 text-xs">
              {currentPack.documentIds.map((docId, index) => {
                const doc = documents.find((d) => d.id === docId);
                if (!doc) return null;
                const isSelected = selectedDocId === doc.id;
                const noteCount = annotations.filter((a) => a.documentId === doc.id).length;

                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600/60 shadow-xs"
                        : "border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                        Item {index + 1}.0 • {doc.category}
                      </span>
                      {noteCount > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                          <StickyNote className="w-3 h-3" /> {noteCount}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {doc.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>{doc.pageCount} pages • {doc.fileSize}</span>
                      <span className="uppercase text-slate-500 font-mono">{doc.confidentiality}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Offline Cache Status indicator */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Available Offline
              </span>
              <button
                onClick={() => alert("Simulated download of complete encrypted board docket (216 pages).")}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-xs"
              >
                <Download className="w-3 h-3" />
                Export
              </button>
            </div>
          </div>

          {/* Center Panel: Large Document Viewer (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col max-h-[800px] overflow-hidden">
            {/* Document Viewer Toolbar */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Page {currentPage} of {currentDoc?.pageCount || 38}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(currentDoc?.pageCount || 38, currentPage + 1))}
                  disabled={currentPage >= (currentDoc?.pageCount || 38)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(Math.max(75, zoomLevel - 25))}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-500">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(175, zoomLevel + 25))}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Canvas with Dynamic DRM Watermarking */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 relative confidential-watermark flex justify-center">
              {/* Dynamic Watermark Banner across Document */}
              <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-10 rotate-[-25deg]">
                <div className="text-center font-black tracking-widest text-slate-900 dark:text-white text-xl sm:text-2xl uppercase">
                  CONFIDENTIAL • {currentUser.name.toUpperCase()} • NRFA BOARD
                </div>
              </div>

              {/* Rendered Document Sheet */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl shadow-xl p-8 sm:p-12 text-slate-800 dark:text-slate-100 min-h-[600px] transition-transform duration-200 relative"
              >
                {/* Official Letterhead Header */}
                <div className="border-b-2 border-emerald-800 pb-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
                        REPUBLIC OF ZAMBIA
                      </div>
                      <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        NATIONAL ROAD FUND AGENCY (NRFA)
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                      {currentDoc?.confidentiality}
                    </span>
                  </div>
                </div>

                {/* Document Title */}
                <h1 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                  {currentDoc?.title}
                </h1>
                <div className="text-xs text-slate-500 mb-6 flex items-center gap-3">
                  <span>Version {currentDoc?.version}</span>
                  <span>•</span>
                  <span>Author: {currentDoc?.uploadedBy}</span>
                  <span>•</span>
                  <span>Date: {currentDoc?.lastModified}</span>
                </div>

                {/* Document Text Excerpt */}
                <div className="text-xs leading-relaxed font-serif whitespace-pre-line text-slate-700 dark:text-slate-300 space-y-4">
                  {currentDoc?.content}
                </div>

                {/* Sign-off Seal / Stamp */}
                <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Page {currentPage} of {currentDoc?.pageCount}</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-800 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NRFA Sovereign Document Registry • Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Annotations, Notes & Comments (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col max-h-[800px] overflow-hidden">
            {/* Sub-tabs: Annotations / Bookmarks / Metadata */}
            <div className="flex items-center border-b border-slate-100 dark:border-slate-800 pb-2.5 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveSideTab("annotations")}
                className={`pb-1 border-b-2 transition-all ${
                  activeSideTab === "annotations"
                    ? "border-emerald-600 text-emerald-800 dark:text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Notes ({docAnnotations.length})
              </button>
              <button
                onClick={() => setActiveSideTab("metadata")}
                className={`pb-1 border-b-2 transition-all ${
                  activeSideTab === "metadata"
                    ? "border-emerald-600 text-emerald-800 dark:text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Properties
              </button>
            </div>

            {activeSideTab === "annotations" ? (
              <div className="flex-1 flex flex-col justify-between overflow-hidden pt-3">
                {/* Notes List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {docAnnotations.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 space-y-2">
                      <StickyNote className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                      <p>No annotations on this paper yet.</p>
                      <p className="text-[11px]">Add a private note or shared comment below.</p>
                    </div>
                  ) : (
                    docAnnotations.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {ann.authorName}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                              ann.isPrivate
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {ann.isPrivate ? "Private" : "Shared"}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                          {ann.text}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Page {ann.pageNumber} • {ann.createdAt}</span>
                          {ann.authorId === currentUser.id && (
                            <button
                              onClick={() => deleteAnnotation(ann.id)}
                              className="text-rose-500 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Annotation Form */}
                <form onSubmit={handleAddAnnotation} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Add to Page {currentPage}:
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 text-[10px]">
                      <input
                        type="checkbox"
                        checked={newNoteIsPrivate}
                        onChange={(e) => setNewNoteIsPrivate(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-700"
                      />
                      <span>Private Note</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type commentary or observation..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Pin Annotation
                  </button>
                </form>
              </div>
            ) : (
              /* Document Metadata Tab */
              <div className="pt-3 space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Paper Title</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentDoc.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Document Classification</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentDoc.confidentiality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Version & Revision</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">v{currentDoc.version} (Published)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Sovereign Watermark</span>
                    <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                      SHA256: 4f8b9e1a3c7d6e
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: BOARD PACK BUILDER (For Secretary & Admin) */}
      {viewMode === "builder" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Board Pack Builder: {currentPack.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize agenda items, attach supporting dockets, and publish to board directors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => publishBoardPack(currentPack.id)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
              >
                <FileCheck className="w-4 h-4" />
                Publish & Distribute Pack
              </button>
            </div>
          </div>

          {/* Agenda Structure & Attachment Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Agenda Sections & Attached Documents
              </h3>
              <button
                onClick={() => alert("New agenda section added to builder.")}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Agenda Section
              </button>
            </div>

            <div className="space-y-3">
              {currentPack.documentIds.map((docId, index) => {
                const doc = documents.find((d) => d.id === docId);
                return (
                  <div
                    key={docId}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {doc?.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {doc?.category} • {doc?.pageCount} pages • Version {doc?.version}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-slate-500"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-slate-500"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
