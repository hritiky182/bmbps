"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CircularResolution } from "@/types";
import {
  FileCheck2,
  Plus,
  Vote,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  FileText,
  Users,
  Search,
  Filter,
  X,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export const CircularResolutionsView: React.FC = () => {
  const {
    circularResolutions,
    createCircular,
    castCircularVote,
    currentUser,
    currentRole,
    committees,
    documents,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCircular, setSelectedCircular] = useState<CircularResolution | null>(circularResolutions[0]);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Voting form state
  const [voteChoice, setVoteChoice] = useState<"approve" | "reject" | "abstain">("approve");
  const [voteComment, setVoteComment] = useState("");

  // Create Circular state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCommitteeId, setNewCommitteeId] = useState("comm-1");
  const [newDeadline, setNewDeadline] = useState("2026-11-05");
  const [newThreshold, setNewThreshold] = useState(75);

  const filteredCirculars = circularResolutions.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.refNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCircular) return;
    castCircularVote(selectedCircular.id, voteChoice, voteComment);
    setIsVoteModalOpen(false);
    setVoteComment("");
  };

  const handleCreateCircular = (e: React.FormEvent) => {
    e.preventDefault();
    createCircular({
      title: newTitle,
      description: newDescription,
      committeeId: newCommitteeId,
      deadline: newDeadline,
      approvalThresholdPct: Number(newThreshold),
    });
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Circular Resolutions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Written resolutions and electronic director ballots without physical sitting requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {(currentRole === "secretary" || currentRole === "admin") && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Issue Circular Resolution
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circulars by reference or subject..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Circular Statuses</option>
            <option value="awaiting_votes">Awaiting Votes</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Content: Left List & Right Active Detail/Vote Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Resolutions List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredCirculars.map((cr) => {
            const isSelected = selectedCircular?.id === cr.id;
            const myVote = cr.votes[currentUser.id];
            const totalAssigned = cr.assignedMemberIds.length;
            const totalVotes = Object.keys(cr.votes).length;
            const approveCount = Object.values(cr.votes).filter((v) => v.choice === "approve").length;
            const approvalPct = totalVotes > 0 ? Math.round((approveCount / totalAssigned) * 100) : 0;

            return (
              <div
                key={cr.id}
                onClick={() => setSelectedCircular(cr)}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs space-y-3 ${
                  isSelected
                    ? "border-emerald-700 ring-2 ring-emerald-700/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-[11px]">
                      {cr.refNumber}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Deadline: {cr.deadline}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      cr.status === "approved"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : cr.status === "awaiting_votes"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {cr.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {cr.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {cr.description}
                </p>

                {/* Voting Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Voting Progress: <strong>{totalVotes} of {totalAssigned} directors</strong>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {approvalPct}% Approval (Threshold {cr.approvalThresholdPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full transition-all"
                      style={{ width: `${Math.min(100, approvalPct)}%` }}
                    />
                  </div>
                </div>

                {/* My Vote Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  {myVote ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      You voted: {myVote.choice.toUpperCase()} ({myVote.timestamp})
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Awaiting Your Ballot
                    </span>
                  )}

                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Circular Resolution Dossier & Vote Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedCircular ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  {selectedCircular.refNumber}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Required: {selectedCircular.approvalThresholdPct}% Approval
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedCircular.title}
                </h2>
                <div className="text-[11px] text-slate-400 mt-1">
                  Issued on {selectedCircular.createdDate} • Voting closes on {selectedCircular.deadline}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                  Resolution Context & Board Request
                </span>
                {selectedCircular.description}
              </div>

              {/* Supporting Document links */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Supporting Dockets & Papers
                </span>
                <div className="space-y-1.5">
                  {selectedCircular.supportingDocIds.map((docId) => {
                    const doc = documents.find((d) => d.id === docId);
                    return (
                      <button
                        key={docId}
                        onClick={() => setActiveTab("board-packs")}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {doc?.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
                          Inspect
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recorded Votes Ledger */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recorded Director Ballots ({Object.keys(selectedCircular.votes).length})
                  </span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(selectedCircular.votes).map(([uid, v]) => (
                    <div
                      key={uid}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">
                          {uid === currentUser.id ? `${currentUser.name} (You)` : `Director (${uid.substring(4, 9)})`}
                        </span>
                        <span
                          className={`uppercase font-bold text-[10px] ${
                            v.choice === "approve"
                              ? "text-emerald-600"
                              : v.choice === "reject"
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {v.choice}
                        </span>
                      </div>
                      {v.comments && (
                        <p className="text-[10px] text-slate-500 italic">"{v.comments}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vote CTA Button */}
              <div className="pt-2">
                {selectedCircular.votes[currentUser.id] ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Your vote is officially registered as <strong>{selectedCircular.votes[currentUser.id].choice.toUpperCase()}</strong>.
                      </span>
                    </div>
                    <button
                      onClick={() => setIsVoteModalOpen(true)}
                      className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                    >
                      Change Ballot Decision (Demo Mode)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsVoteModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
                  >
                    <Vote className="w-4 h-4" />
                    Cast Electronic Ballot Now
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 text-xs">
              Select a circular resolution to view deliberations.
            </div>
          )}
        </div>
      </div>

      {/* Cast Ballot Modal */}
      {isVoteModalOpen && selectedCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                  {selectedCircular.refNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                  Cast Official Director Ballot
                </h3>
              </div>
              <button
                onClick={() => setIsVoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Your decision will be recorded in the NRFA sovereign governance audit trail.
            </p>

            <form onSubmit={handleCastVote} className="space-y-4 text-xs">
              {/* Radio options */}
              <div className="grid grid-cols-3 gap-2.5">
                <label
                  onClick={() => setVoteChoice("approve")}
                  className={`p-3 rounded-xl border text-center cursor-pointer font-bold transition-all ${
                    voteChoice === "approve"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-600/30"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span>APPROVE</span>
                </label>

                <label
                  onClick={() => setVoteChoice("reject")}
                  className={`p-3 rounded-xl border text-center cursor-pointer font-bold transition-all ${
                    voteChoice === "reject"
                      ? "border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 ring-2 ring-rose-600/30"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <XCircle className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                  <span>REJECT</span>
                </label>

                <label
                  onClick={() => setVoteChoice("abstain")}
                  className={`p-3 rounded-xl border text-center cursor-pointer font-bold transition-all ${
                    voteChoice === "abstain"
                      ? "border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-600/30"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <MinusCircle className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span>ABSTAIN</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Director Commentary / Statutory Caveat (Optional)
                </label>
                <textarea
                  rows={3}
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder="e.g. Subject to weekly physical inspection report by RDA..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md transition-all"
                >
                  Confirm & Submit Ballot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Circular Modal (Secretary / Admin) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Secretariat Dispatch
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Draft New Circular Resolution
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCircular} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Subject / Resolution Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Approval of Lusaka Weighbridge Concession Tariff"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Committee
                  </label>
                  <select
                    value={newCommitteeId}
                    onChange={(e) => setNewCommitteeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {committees.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Voting Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Detailed Deliberation Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide statutory grounding and executive recommendation..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Approval Threshold (% of eligible directors)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md transition-all"
                >
                  Publish & Dispatch to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
