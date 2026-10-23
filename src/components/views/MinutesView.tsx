"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MeetingMinutes } from "@/types";
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Share2,
  Plus,
  ShieldCheck,
  Building2,
  X,
  FileCheck,
} from "lucide-react";

export const MinutesView: React.FC = () => {
  const { minutesList, meetings, approveMinutes, currentUser, currentRole, addToast } = useApp();
  const [selectedMin, setSelectedMin] = useState<MeetingMinutes | null>(minutesList[0]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Meeting Minutes & Governance Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official statutory records of board deliberations, resolutions adopted, and chair attestations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-600" />
            Print / Export Official Docket
          </button>
        </div>
      </div>

      {/* Main Grid: Minutes List & Rendered Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Minutes Archive (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recorded Meeting Minutes
          </span>

          {minutesList.map((m) => {
            const isSelected = selectedMin?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMin(m)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs space-y-2 ${
                  isSelected
                    ? "border-emerald-700 ring-2 ring-emerald-700/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">{m.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      m.status === "approved"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {m.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                  {m.title}
                </h3>

                <div className="text-[10px] text-slate-500">
                  Prepared by: {m.preparedBy}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Official Formatted Minutes Sheet (8 cols) */}
        <div className="lg:col-span-8">
          {selectedMin ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-6">
              {/* Header Letterhead */}
              <div className="border-b-2 border-emerald-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-extrabold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
                    REPUBLIC OF ZAMBIA
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    NATIONAL ROAD FUND AGENCY (NRFA)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Plot 330/1 Corner of Government & Fairley Roads, Ridgeway, Lusaka
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                      selectedMin.status === "approved"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {selectedMin.status.toUpperCase()}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Date: {selectedMin.date}</div>
                </div>
              </div>

              {/* Title & Executive Summary */}
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedMin.title}
                </h2>
                <div className="mt-2 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic border border-slate-100 dark:border-slate-800">
                  "{selectedMin.executiveSummary}"
                </div>
              </div>

              {/* Attendees Roster */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Members in Attendance
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedMin.attendees.map((att) => (
                    <div
                      key={att.userId}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{att.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{att.role}</div>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          att.status === "present"
                            ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950"
                            : "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950"
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliberations & Resolutions by Agenda Item */}
              <div className="space-y-4 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Summary of Deliberations & Formal Decisions
                </span>

                {selectedMin.sections.map((sec) => (
                  <div
                    key={sec.agendaId}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 bg-slate-50/40 dark:bg-slate-800/20"
                  >
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                      {sec.agendaTitle}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-serif">
                      {sec.discussion}
                    </p>

                    {sec.resolutionsMade.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 space-y-1">
                        <span className="font-bold uppercase text-[10px] block">Resolutions Adopted:</span>
                        {sec.resolutionsMade.map((res, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <span className="font-bold">•</span>
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chairperson Attestation / Sign-off */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chairperson Attestation
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedMin.approvedBy || "Mr. Joe Mutwale (Board Chairperson)"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Status: {selectedMin.status === "approved" ? "Confirmed & Signed" : "Awaiting Signature"}
                  </div>
                </div>

                {selectedMin.status !== "approved" && (currentRole === "member" || currentRole === "admin") && (
                  <button
                    onClick={() => approveMinutes(selectedMin.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Formally Approve Minutes
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 text-xs">
              Select minutes to view record.
            </div>
          )}
        </div>
      </div>

      {/* Print Export Preview Modal */}
      {isExportModalOpen && selectedMin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Official Export
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Ready for Print / PDF Export
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              The official minutes for <strong>{selectedMin.title}</strong> have been formatted with sovereign headers and digital signatures.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div>• File Name: <code>NRFA_Minutes_83rd_Ordinary_Board.pdf</code></div>
              <div>• Resolution Count: 2 Adopted Motions</div>
              <div>• Certified by: Board Secretariat & Corporate Legal Counsel</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-500 font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsExportModalOpen(false);
                  addToast("PDF Export Generated", "Downloaded authenticated minutes docket.", "success");
                }}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Signed PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
