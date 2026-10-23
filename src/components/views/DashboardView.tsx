"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  CalendarDays,
  Layers,
  FileCheck2,
  FileSignature,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  Video,
  Download,
  Users,
  HardDrive,
  TabletSmartphone,
  ShieldAlert,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    setActiveTab,
    meetings,
    boardPacks,
    circularResolutions,
    signatureRequests,
    actionItems,
    documents,
    auditLogs,
    devices,
  } = useApp();

  const nextMeeting = meetings.find((m) => m.status === "scheduled" || m.status === "in_progress") || meetings[0];
  const pendingVotes = circularResolutions.filter((c) => c.status === "awaiting_votes" && !c.votes[currentUser.id]);
  const pendingSigs = signatureRequests.filter((s) => s.status === "pending");
  const myActions = actionItems.filter((a) => a.assignedMemberId === currentUser.id || currentRole === "admin");
  const openActions = myActions.filter((a) => a.status !== "completed");
  const unreadPacks = boardPacks.filter((p) => p.status === "published" && !p.readStatus[currentUser.id]);

  // 1. BOARD MEMBER DASHBOARD
  if (currentRole === "member") {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Republic of Zambia • NRFA Board Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="text-emerald-150 text-xs sm:text-sm max-w-2xl opacity-90 leading-relaxed">
                {currentUser.title} • {currentUser.department}. You have{" "}
                <span className="text-amber-300 font-semibold">{pendingVotes.length} pending circulars</span> and{" "}
                <span className="text-amber-300 font-semibold">{pendingSigs.length} signature requests</span> awaiting attention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("meeting-room")}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Video className="w-4 h-4" />
                Join Live Room
              </button>
              <button
                onClick={() => setActiveTab("board-packs")}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur border border-white/20 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                Review Board Packs
              </button>
            </div>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div
            onClick={() => setActiveTab("meetings")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Meetings</span>
              <CalendarDays className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {meetings.filter((m) => m.status === "scheduled" || m.status === "in_progress").length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-emerald-600 font-medium transition-colors">
              <span>View schedule</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab("board-packs")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Reviews</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{unreadPacks.length || 3}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-amber-600 font-medium transition-colors">
              <span>Read dockets</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab("circulars")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Votes</span>
              <FileCheck2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{pendingVotes.length || 2}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-blue-600 font-medium transition-colors">
              <span>Cast ballots</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab("signatures")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Sigs</span>
              <FileSignature className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{pendingSigs.length || 2}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-rose-600 font-medium transition-colors">
              <span>Sign documents</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab("actions")}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-600/40 transition-all cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Open Actions</span>
              <CheckSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{openActions.length || 5}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-purple-600 font-medium transition-colors">
              <span>Track milestones</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Main Content Grid: Next Meeting Spotlight & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Scheduled Meeting Card */}
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Next Scheduled Sitting
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {nextMeeting.format}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {nextMeeting.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {nextMeeting.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Time</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {nextMeeting.date} ({nextMeeting.startTime} - {nextMeeting.endTime})
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {nextMeeting.location}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Meeting Chair</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Mr. Joe Mutwale
                </span>
              </div>
            </div>

            {/* Agenda Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Agenda Highlights ({nextMeeting.agenda.length} items)
              </span>
              <div className="space-y-1.5">
                {nextMeeting.agenda.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.order}</span>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab("board-packs", { packId: nextMeeting.boardPackId })}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                Open Board Pack
              </button>
              <button
                onClick={() => setActiveTab("meeting-room")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                Join Virtual Boardroom
              </button>
            </div>
          </div>

          {/* Right Column: Pending Votes & Signatures */}
          <div className="space-y-6">
            {/* Urgent Circular Resolutions */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Circular Ballots
                </span>
                <button
                  onClick={() => setActiveTab("circulars")}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {circularResolutions.slice(0, 2).map((cr) => {
                  const hasVoted = cr.votes[currentUser.id];
                  return (
                    <div
                      key={cr.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{cr.refNumber}</span>
                        <span>Due {cr.deadline}</span>
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                        {cr.title}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        {hasVoted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Voted: {hasVoted.choice.toUpperCase()}
                          </span>
                        ) : (
                          <button
                            onClick={() => setActiveTab("circulars")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-all"
                          >
                            Cast Ballot
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {Object.keys(cr.votes).length} of {cr.assignedMemberIds.length} voted
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Signatures Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-rose-600" />
                  Pending Signatures
                </span>
                <button
                  onClick={() => setActiveTab("signatures")}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {signatureRequests.slice(0, 2).map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {sig.documentTitle}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Req: {sig.requestedBy} • Deadline: {sig.deadline}
                      </div>
                    </div>
                    {sig.status === "pending" ? (
                      <button
                        onClick={() => setActiveTab("signatures")}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] shrink-0 transition-all"
                      >
                        Sign
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold shrink-0">Signed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. BOARD SECRETARY DASHBOARD
  if (currentRole === "secretary") {
    return (
      <div className="space-y-6">
        {/* Secretary Welcome & Executive Actions */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
                Secretariat Workspace • National Road Fund Agency
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Corporate Secretariat Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.title}). Manage upcoming sittings, compile board packs, dispatch circular resolutions, and track minutes approvals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab("meetings")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Sitting
              </button>
              <button
                onClick={() => setActiveTab("board-packs")}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                Build Board Pack
              </button>
              <button
                onClick={() => setActiveTab("circulars")}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Issue Circular
              </button>
            </div>
          </div>
        </div>

        {/* Secretary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Sittings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">4 Active</div>
            <div className="text-[11px] text-emerald-600 mt-1">Next: 28 Oct (84th Board)</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Board Pack Read Status</span>
            <div className="text-2xl font-black text-amber-600 mt-1">7 / 10 Read</div>
            <div className="text-[11px] text-slate-400 mt-1">70% director engagement</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Circular Resolutions</span>
            <div className="text-2xl font-black text-blue-600 mt-1">3 Underway</div>
            <div className="text-[11px] text-slate-400 mt-1">CR-014 quorum reached (75%)</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Minutes Finalization</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">1 Pending Sign-off</div>
            <div className="text-[11px] text-slate-400 mt-1">83rd Ordinary Minutes</div>
          </div>
        </div>

        {/* Board Pack Readiness Tracker & Meeting Agenda Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Upcoming Meetings & Pack Delivery Status
              </h2>
              <button
                onClick={() => setActiveTab("meetings")}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                View Meetings
              </button>
            </div>

            <div className="space-y-3">
              {meetings.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {m.date} • {m.startTime} • {m.location}
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400">
                      Board Pack: <strong className="text-slate-700 dark:text-slate-300">Published (v2.1)</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab("board-packs", { packId: m.boardPackId })}
                      className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Manage Pack →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Action Items & Post-Meeting Governance
              </h2>
              <button
                onClick={() => setActiveTab("actions")}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                Kanban View
              </button>
            </div>

            <div className="space-y-2.5">
              {actionItems.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{act.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Due: {act.dueDate} • Priority: <span className="uppercase font-semibold">{act.priority}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      act.status === "completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : act.status === "overdue"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {act.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. SYSTEM ADMINISTRATOR DASHBOARD
  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-emerald-300 text-xs font-semibold border border-slate-700">
              ICT Infrastructure & Security Management Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              NRFA System Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Logged in as <strong>{currentUser.name}</strong> ({currentUser.title}). Full agency tenant governance, user provisioning, device remote wipe, dynamic DRM watermarks, and cryptographic audit monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab("users")}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Users className="w-3.5 h-3.5" />
              Manage Users (28/30)
            </button>
            <button
              onClick={() => setActiveTab("audit-logs")}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* Admin KPI Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">License Capacity</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">28 / 30 Users</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full w-[93%]" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">93.3% allocated (2 seats remaining)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Secure Storage</span>
            <HardDrive className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">42.8 / 100 GB</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full w-[43%]" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">AES-256 Encrypted Sovereign Vault</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Devices</span>
            <TabletSmartphone className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">6 Enrolled</div>
          <div className="text-[11px] text-emerald-600 mt-2 font-medium">1 Remote-Wiped device recorded</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Automated Backup</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Healthy</div>
          <div className="text-[10px] text-slate-400 mt-2">Last snapshot: Today 04:00 (Offsite DR)</div>
        </div>
      </div>

      {/* Admin Audit Trail Stream & Registered Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Audit Events */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Live Governance & Security Audit Trail
            </h2>
            <button
              onClick={() => setActiveTab("audit-logs")}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              Full Log ({auditLogs.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{log.userName}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{log.action}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {log.module}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{log.details}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Devices Roster */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Enrolled Director Tablet & Laptop Fleet
            </h2>
            <button
              onClick={() => setActiveTab("devices-sync")}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              Device Controls
            </button>
          </div>

          <div className="space-y-2.5">
            {devices.slice(0, 4).map((dev) => (
              <div
                key={dev.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">{dev.deviceName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    User: {dev.assignedUserName} • {dev.os} • Sync: {dev.lastSync}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    dev.status === "active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {dev.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
