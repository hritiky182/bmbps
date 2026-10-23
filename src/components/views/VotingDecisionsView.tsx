"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Vote,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Plus,
  BarChart3,
  Search,
  Check,
  ShieldCheck,
  Filter,
} from "lucide-react";

export const VotingDecisionsView: React.FC = () => {
  const {
    liveResolutions,
    circularResolutions,
    castLiveVote,
    createLiveResolution,
    currentUser,
    currentRole,
    meetings,
    addToast,
  } = useApp();

  const [selectedResId, setSelectedResId] = useState<string>(liveResolutions[0]?.id || "res-01");
  const [filterType, setFilterType] = useState<"all" | "live" | "circular">("all");
  const [isNewResolutionOpen, setIsNewResolutionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const currentRes = liveResolutions.find((r) => r.id === selectedResId) || liveResolutions[0];
  const myVote = currentRes?.votes[currentUser.id];

  const totalVotes = Object.keys(currentRes?.votes || {}).length;
  const totalEligible = 14;
  const approveCount = Object.values(currentRes?.votes || {}).filter((v) => v === "approve").length;
  const rejectCount = Object.values(currentRes?.votes || {}).filter((v) => v === "reject").length;
  const abstainCount = Object.values(currentRes?.votes || {}).filter((v) => v === "abstain").length;

  const approvePct = totalVotes > 0 ? Math.round((approveCount / totalVotes) * 100) : 0;
  const rejectPct = totalVotes > 0 ? Math.round((rejectCount / totalVotes) * 100) : 0;
  const abstainPct = totalVotes > 0 ? Math.round((abstainCount / totalVotes) * 100) : 0;

  const handleCreateResolution = (e: React.FormEvent) => {
    e.preventDefault();
    createLiveResolution({
      title: newTitle,
      description: newDesc,
    });
    setIsNewResolutionOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Voting & Board Decisions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time electronic balloting, statutory quorum validation, and official resolution tallies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {(currentRole === "secretary" || currentRole === "admin") && (
            <button
              onClick={() => setIsNewResolutionOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Introduce Resolution
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Resolutions</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {liveResolutions.length + circularResolutions.length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">2 Live in Boardroom</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quorum Rate</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">100% Valid</div>
          <div className="text-[11px] text-slate-400 mt-1">14 of 14 voting seats confirmed</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Passing Rate</span>
          <div className="text-2xl font-black text-blue-600 mt-1">94.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">FY2026 Sovereign Average</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Ballots</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {myVote ? "Recorded" : "Pending 1"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Statutory signature verified</div>
        </div>
      </div>

      {/* Main Grid: Resolutions List & Live Interactive Vote Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Resolutions List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Open Board Motions
          </span>

          {liveResolutions.map((res) => {
            const isSelected = selectedResId === res.id;
            const resVotes = Object.keys(res.votes).length;
            const resApprove = Object.values(res.votes).filter((v) => v === "approve").length;
            const resApprovePct = resVotes > 0 ? Math.round((resApprove / resVotes) * 100) : 0;

            return (
              <div
                key={res.id}
                onClick={() => setSelectedResId(res.id)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs space-y-2 ${
                  isSelected
                    ? "border-emerald-700 ring-2 ring-emerald-700/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {res.refCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {res.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                  {res.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{resVotes} / 14 Ballots Cast</span>
                  <span className="font-semibold text-emerald-600">{resApprovePct}% Approve</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Live Voting & Results Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentRes && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  {currentRes.refCode}
                </span>
                <span className="text-xs font-bold uppercase text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Ballot Floor
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {currentRes.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {currentRes.description}
                </p>
              </div>

              {/* Live Cast Ballot Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Your Official Decision:
                  </span>
                  {myVote && (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                      Registered as: {myVote.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => castLiveVote(currentRes.id, "approve")}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      myVote === "approve"
                        ? "bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => castLiveVote(currentRes.id, "reject")}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      myVote === "reject"
                        ? "bg-rose-800 text-white border-rose-800 shadow-md ring-2 ring-rose-600/30"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50"
                    }`}
                  >
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => castLiveVote(currentRes.id, "abstain")}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      myVote === "abstain"
                        ? "bg-amber-800 text-white border-amber-800 shadow-md ring-2 ring-amber-600/30"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50"
                    }`}
                  >
                    <MinusCircle className="w-5 h-5 text-amber-600" />
                    <span>Abstain</span>
                  </button>
                </div>
              </div>

              {/* Visual Breakdown Charts & Bars */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ballot Tabulation & Percentages
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Approve ({approveCount} directors)
                      </span>
                      <span className="font-mono font-bold">{approvePct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full transition-all" style={{ width: `${approvePct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-rose-700 dark:text-rose-400">
                        Reject ({rejectCount} directors)
                      </span>
                      <span className="font-mono font-bold">{rejectPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-rose-600 h-full transition-all" style={{ width: `${rejectPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        Abstain ({abstainCount} directors)
                      </span>
                      <span className="font-mono font-bold">{abstainPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full transition-all" style={{ width: `${abstainPct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs text-slate-500">
                  <span>Quorum: <strong>{totalVotes} of {totalEligible}</strong> voting seats confirmed</span>
                  <span className="font-semibold text-emerald-600">Decision Threshold: Met (75%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Introduce Resolution Modal */}
      {isNewResolutionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Introduce Boardroom Motion for Electronic Vote
            </h3>

            <form onSubmit={handleCreateResolution} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Resolution Subject
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sanction of Toll Plaza Solar Backup Tender Award"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Motion Description & Legal Grounding
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Draft resolution text for board adoption..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewResolutionOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md transition-all"
                >
                  Open Live Floor Vote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
