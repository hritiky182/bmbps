"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BoardDocument } from "@/types";
import {
  FolderLock,
  Search,
  UploadCloud,
  FileText,
  ShieldCheck,
  Eye,
  Download,
  Filter,
  Layers,
  X,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

export const DocumentLibraryView: React.FC = () => {
  const { documents, addDocument, currentUser, currentRole, setActiveTab } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<BoardDocument | null>(documents[0]);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<BoardDocument["category"]>("Financial Reports");
  const [newConfidentiality, setNewConfidentiality] = useState<BoardDocument["confidentiality"]>("BOARD ONLY");
  const [newVersion, setNewVersion] = useState("1.0");

  const categories: BoardDocument["category"][] = [
    "Financial Reports",
    "Strategic Documents",
    "Board Minutes",
    "Committee Reports",
    "Policies",
    "Governance",
    "Legal & Compliance",
    "Circular Resolutions",
  ];

  const filteredDocs = documents.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      title: newTitle,
      category: newCategory,
      confidentiality: newConfidentiality,
      version: newVersion,
      pageCount: 18,
      fileSize: "3.2 MB",
      content: `REPUBLIC OF ZAMBIA\nNATIONAL ROAD FUND AGENCY (NRFA)\n\nDOCUMENT REVISION: ${newTitle}\nUploaded by: ${currentUser.name}\n\n1.0 Executive Background:\nThis document serves as an official technical docket submitted for the records of the National Road Fund Agency Board of Directors in compliance with statutory reporting covenants.`,
    });
    setIsUploadModalOpen(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Document Repository & Governance Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Encrypted sovereign cloud archives, board papers, and policy records under Act No. 13 of 2002.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Docket
          </button>
        </div>
      </div>

      {/* Category Filter Chips & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across 35+ documents by name, category, or classification..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Repositories ({documents.length})
          </button>
          {categories.map((cat) => {
            const count = documents.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Grid and Document Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-700 ring-2 ring-emerald-700/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400 text-[11px]">
                      {doc.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {doc.confidentiality}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div>Version {doc.version} • {doc.pageCount} pages ({doc.fileSize})</div>
                    <div>Uploaded by: {doc.uploadedBy}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoc(doc);
                      setIsWatermarkModalOpen(true);
                    }}
                    className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Watermark DRM
                  </button>
                  <span className="text-[10px] text-slate-400">{doc.lastModified}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Document Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedDoc ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  Document Inspector
                </span>
                <span className="text-xs font-mono text-slate-400">v{selectedDoc.version}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedDoc.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Category: {selectedDoc.category} • {selectedDoc.fileSize}
                </p>
              </div>

              {/* Watermark Security Notice */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Dynamic DRM Watermark Active
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-snug">
                  Viewing stamps <strong>{currentUser.name}</strong>, IP <strong>102.140.218.42</strong>, and cryptographic hash across every rendered page.
                </p>
              </div>

              {/* Excerpt Preview Box */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Authenticated Content Excerpt
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-serif text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                  {selectedDoc.content}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsWatermarkModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview Watermarked Docket
                </button>
                <button
                  onClick={() => setActiveTab("board-packs")}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Open in Board Pack Reader
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 text-xs">
              Select a document to inspect governance properties.
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Watermark Preview Modal */}
      {isWatermarkModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  NRFA Sovereign DRM Preview
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setIsWatermarkModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rendered Watermarked Page Simulator */}
            <div className="p-8 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 relative confidential-watermark min-h-[360px] overflow-hidden select-none">
              {/* Dynamic Watermark Text in diagonal */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-25deg] opacity-20">
                <div className="text-center font-black tracking-widest text-slate-900 dark:text-white text-lg uppercase leading-loose">
                  RESTRICTED • {currentUser.name.toUpperCase()} • 102.140.218.42 • 2026-10-23
                </div>
              </div>

              <div className="relative z-10 space-y-4 text-xs font-serif leading-relaxed text-slate-800 dark:text-slate-200">
                <div className="border-b border-emerald-800 pb-2 text-[11px] font-sans font-bold text-emerald-900 dark:text-emerald-400 uppercase">
                  NATIONAL ROAD FUND AGENCY (NRFA) • BOARD PAPER ARCHIVE
                </div>
                <div className="whitespace-pre-line">{selectedDoc.content}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 font-mono text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                DRM Profile: Enforced Watermark + Screenshot Prevention
              </span>
              <button
                onClick={() => setIsWatermarkModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
              >
                Done Viewing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Document Ingestion
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Upload Docket to Library
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Road Tolling Revenue Forecast 2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Confidentiality
                  </label>
                  <select
                    value={newConfidentiality}
                    onChange={(e) => setNewConfidentiality(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="BOARD ONLY">BOARD ONLY</option>
                    <option value="STRICTLY CONFIDENTIAL">STRICTLY CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="INTERNAL">INTERNAL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1">
                <UploadCloud className="w-6 h-6 mx-auto text-emerald-600" />
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Drag and drop PDF or Office docket here
                </div>
                <div className="text-[10px] text-slate-400">Supports PDF, Word, Excel up to 50MB</div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md transition-all"
                >
                  Upload & Register Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
