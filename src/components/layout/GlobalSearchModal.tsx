"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Search, CalendarDays, Layers, FileCheck2, FolderLock, ArrowRight, X } from "lucide-react";

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, meetings, boardPacks, circularResolutions, documents, setActiveTab } = useApp();
  const [query, setQuery] = useState("");

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredMeetings = q
    ? meetings.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
    : meetings.slice(0, 3);

  const filteredPacks = q
    ? boardPacks.filter((p) => p.title.toLowerCase().includes(q))
    : boardPacks.slice(0, 2);

  const filteredDocs = q
    ? documents.filter((d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
    : documents.slice(0, 3);

  const filteredCirculars = q
    ? circularResolutions.filter((c) => c.title.toLowerCase().includes(q) || c.refNumber.toLowerCase().includes(q))
    : circularResolutions.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings, board dockets, circulars, reports..."
            className="w-full bg-transparent border-0 text-sm focus:outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Meetings */}
          {filteredMeetings.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Board Sittings & Meetings
              </div>
              <div className="space-y-1 mt-1">
                {filteredMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveTab("meetings", { meetingId: m.id });
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{m.title}</div>
                        <div className="text-[11px] text-slate-500">{m.date} • {m.location}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Board Packs */}
          {filteredPacks.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Board Packs & Agendas
              </div>
              <div className="space-y-1 mt-1">
                {filteredPacks.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab("board-packs", { packId: p.id });
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-500">Version {p.version} • {p.totalPages} pages</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Circulars */}
          {filteredCirculars.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Circular Resolutions
              </div>
              <div className="space-y-1 mt-1">
                {filteredCirculars.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab("circulars");
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {c.refNumber}: {c.title}
                        </div>
                        <div className="text-[11px] text-slate-500">Deadline: {c.deadline} • Status: {c.status}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Document Repository
              </div>
              <div className="space-y-1 mt-1">
                {filteredDocs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveTab("documents", { docId: d.id });
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                        <FolderLock className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{d.title}</div>
                        <div className="text-[11px] text-slate-500">{d.category} • {d.confidentiality}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press Enter to open first result</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
