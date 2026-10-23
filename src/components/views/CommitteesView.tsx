"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Committee } from "@/types";
import {
  Network,
  Users,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ChevronRight,
  X,
} from "lucide-react";

export const CommitteesView: React.FC = () => {
  const { committees, users } = useApp();
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(committees[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Committees & Governance Organs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Statutory sub-committees established under the National Road Fund Act No. 13 of 2002.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5 Committee Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {committees.map((comm) => {
            const chair = users.find((u) => u.id === comm.chairId);
            const secretary = users.find((u) => u.id === comm.secretaryId);
            const isSelected = selectedCommittee?.id === comm.id;

            return (
              <div
                key={comm.id}
                onClick={() => setSelectedCommittee(comm)}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs space-y-3 ${
                  isSelected
                    ? "border-emerald-700 ring-2 ring-emerald-700/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                    {comm.code}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {comm.meetingCadence}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                  {comm.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {comm.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    Chair: <strong>{chair?.name || "Appointed Chair"}</strong>
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                    {comm.memberIds.length} Assigned Members →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Committee Member Roster & Charter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedCommittee ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  {selectedCommittee.code} Roster
                </span>
                <span className="text-xs text-slate-400">
                  {selectedCommittee.memberIds.length} Voting Members
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedCommittee.name}
                </h2>
                <div className="text-[11px] text-slate-400 mt-1">
                  Cadence: {selectedCommittee.meetingCadence}
                </div>
              </div>

              {/* Members Roster List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Confirmed Committee Members
                </span>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
                  {selectedCommittee.memberIds.map((uid) => {
                    const u = users.find((usr) => usr.id === uid);
                    const isChair = selectedCommittee.chairId === uid;
                    const isSec = selectedCommittee.secretaryId === uid;

                    return (
                      <div
                        key={uid}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={u?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                            alt={u?.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                              {u?.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{u?.title}</div>
                          </div>
                        </div>

                        {isChair ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                            Chair
                          </span>
                        ) : isSec ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                            Secretary
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 shrink-0">Member</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 text-xs">
              Select a committee to view member roster.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
