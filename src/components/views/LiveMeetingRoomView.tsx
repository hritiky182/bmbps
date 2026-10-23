"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  Share2,
  Radio,
  ChevronRight,
  Vote,
  MessageSquare,
  FileSpreadsheet,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Play,
  RotateCcw,
  Sparkles,
  PhoneOff,
} from "lucide-react";

export const LiveMeetingRoomView: React.FC = () => {
  const {
    meetings,
    users,
    currentUser,
    currentRole,
    liveResolutions,
    castLiveVote,
    openLiveVote,
    createLiveResolution,
    documents,
    activeMeetingId,
    addToast,
  } = useApp();

  const meeting = meetings.find((m) => m.id === activeMeetingId) || meetings[0];
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState(3); // Agenda item 4.0
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isLaserPointerActive, setIsLaserPointerActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>({ x: 340, y: 220 });
  const [isPageSynced, setIsPageSynced] = useState(true);
  const [presentationPage, setPresentationPage] = useState(3);
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "notes" | "voting">("voting");

  // Live Chat messages
  const [messages, setMessages] = useState([
    { id: "m1", user: "Mr. Joe Mutwale (Board Chair)", time: "10:14", text: "Welcome directors. We are now considering Agenda Item 4.0 - CEO Quarterly Overview." },
    { id: "m2", user: "Eng. Charles M. Banda (CEO)", time: "10:16", text: "Thank you Chairman. Pavement Condition Index has improved to 71% nationwide." },
    { id: "m3", user: "Mrs. Mutale Chileshe (Sec.)", time: "10:18", text: "Quorum is confirmed at 14 voting directors present." },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Live Notes
  const [liveNotes, setLiveNotes] = useState(
    "1. CEO reported 9.03% revenue expansion across national tolling gates.\n2. Kazungula Bridge tolling automated lane throughput increased by 4x.\n3. Question raised regarding rural feeder road disbursements vs primary paved trunk roads."
  );

  // Active Live Resolution
  const activeRes = liveResolutions.find((r) => r.status === "voting" || r.status === "open") || liveResolutions[0];
  const myLiveVote = activeRes?.votes[currentUser.id];

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLaserPointerActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLaserPos({ x, y });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: "msg-" + Date.now(),
      user: `${currentUser.name} (${currentRole === "member" ? "Director" : currentRole === "secretary" ? "Secretary" : "Admin"})`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: chatInput.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const totalVotesCast = Object.keys(activeRes?.votes || {}).length;
  const approveCount = Object.values(activeRes?.votes || {}).filter((v) => v === "approve").length;
  const rejectCount = Object.values(activeRes?.votes || {}).filter((v) => v === "reject").length;
  const abstainCount = Object.values(activeRes?.votes || {}).filter((v) => v === "abstain").length;

  return (
    <div className="space-y-4">
      {/* Top Bar: Sitting Banner & Synchronized Agenda */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                {meeting.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-600 text-white animate-pulse">
                IN PROGRESS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/60 text-blue-200 border border-blue-700/50">
                MS Teams Encrypted Room
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">Active Agenda:</span>
              <span className="text-white font-medium truncate max-w-md">
                {meeting.agenda[currentAgendaIndex]?.order} {meeting.agenda[currentAgendaIndex]?.title}
              </span>
            </div>
          </div>
        </div>

        {/* Meeting Status & Agenda Advancement (Secretary/Admin) */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-emerald-400 border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Elapsed: 01:24:18</span>
          </div>

          {(currentRole === "secretary" || currentRole === "admin") && (
            <button
              onClick={() => {
                const nextIdx = (currentAgendaIndex + 1) % meeting.agenda.length;
                setCurrentAgendaIndex(nextIdx);
                addToast("Agenda Advanced", `Now presiding on item: ${meeting.agenda[nextIdx].order}`, "info");
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <span>Next Item</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Boardroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Agenda Timeline & Participant Video Tiles (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Confirmed Attending Avatars Tile */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Boardroom Attendants</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">14 Present</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* My Avatar Tile */}
              <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video flex flex-col justify-end p-2 border border-emerald-500/40">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white truncate drop-shadow-md">You</span>
                  <div className="flex items-center gap-1">
                    {isMicOn ? (
                      <Mic className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Chairman Avatar Tile */}
              <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video flex flex-col justify-end p-2 border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
                  alt="Board Chair"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white truncate drop-shadow-md">J. Mutwale (Chair)</span>
                  <Mic className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              {/* CEO Avatar Tile */}
              <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video flex flex-col justify-end p-2 border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
                  alt="CEO"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white truncate drop-shadow-md">C. Banda (CEO)</span>
                  <Mic className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              {/* Secretary Avatar Tile */}
              <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video flex flex-col justify-end p-2 border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Secretary"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white truncate drop-shadow-md">M. Chileshe (Sec)</span>
                  <MicOff className="w-3 h-3 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Agenda Navigation Tree */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Meeting Order of Business
            </span>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1 text-xs">
              {meeting.agenda.map((item, idx) => {
                const isCurrent = idx === currentAgendaIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentAgendaIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2 ${
                      isCurrent
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 font-bold text-emerald-900 dark:text-emerald-300"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-emerald-700 dark:text-emerald-400 shrink-0 font-bold">{item.order}</span>
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Live Synchronized Document Presentation (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {/* Synchronized Toolbar */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPageSynced(!isPageSynced)}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  isPageSynced
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isPageSynced ? "Synced to Chair" : "Free Roam"}</span>
              </button>

              <button
                onClick={() => setIsLaserPointerActive(!isLaserPointerActive)}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  isLaserPointerActive
                    ? "bg-red-600 text-white shadow-xs animate-pulse"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
                title="Click on the document to point"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Laser Pointer</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Presentation Slide {presentationPage} of 18
            </div>
          </div>

          {/* Interactive Presentation Canvas */}
          <div
            onClick={handleDocumentClick}
            className={`flex-1 p-6 sm:p-8 bg-slate-900 text-white min-h-[440px] relative overflow-hidden select-none flex flex-col justify-between ${
              isLaserPointerActive ? "cursor-crosshair" : ""
            }`}
          >
            {/* Interactive Laser Pointer glowing dot */}
            {laserPos && (
              <div
                style={{ left: laserPos.x, top: laserPos.y }}
                className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-emerald-400 shadow-[0_0_15px_#10b981] pointer-events-none transition-all duration-150 animate-ping"
              />
            )}
            {laserPos && (
              <div
                style={{ left: laserPos.x, top: laserPos.y }}
                className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-emerald-300 pointer-events-none transition-all duration-150"
              />
            )}

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-emerald-400">
                <span>NATIONAL ROAD FUND AGENCY (NRFA) • EXECUTIVE PRESENTATION</span>
                <span>OCTOBER 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-2 leading-tight text-white">
                Road Tolling Program Expansion: Smart ANPR Plazas
              </h2>
            </div>

            {/* Slide Core Visual Diagram & Stats */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Cashless Target</span>
                <span className="text-xl font-black text-emerald-400">85%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">By Q2 2027</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Throughput Rate</span>
                <span className="text-xl font-black text-amber-400">620 v/h</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Up from 140 v/h</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Savings</span>
                <span className="text-xl font-black text-blue-400">ZMW 46.2M</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Operational Efficiency</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 leading-relaxed font-sans">
              <strong>Key Motion Before the Board:</strong> Sanction the FastPass transponder deployment along the Lusaka - Ndola corridor (Manyumbi, Kafulafuta, Katuba plazas) with full solar mini-grid backup to guarantee zero downtime.
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-800">
              <span>Presenter: Eng. Charles M. Banda (Chief Executive Officer)</span>
              <span>Click slide anywhere to move the laser pointer dot</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat, Live Notes & Instant Live Voting (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between max-h-[620px]">
          <div>
            {/* Tab Header */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold mb-3">
              <button
                onClick={() => setActiveRightTab("voting")}
                className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeRightTab === "voting"
                    ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                    : "text-slate-400"
                }`}
              >
                <Vote className="w-3 h-3" />
                <span>Vote</span>
              </button>
              <button
                onClick={() => setActiveRightTab("chat")}
                className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeRightTab === "chat"
                    ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                    : "text-slate-400"
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveRightTab("notes")}
                className={`py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeRightTab === "notes"
                    ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                    : "text-slate-400"
                }`}
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>Notes</span>
              </button>
            </div>

            {/* TAB 1: INSTANT LIVE VOTING */}
            {activeRightTab === "voting" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400">
                    <span>{activeRes.refCode} • Live Motion</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-700 text-white">VOTING OPEN</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                    {activeRes.title}
                  </h4>
                </div>

                {/* Ballot Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cast Your Ballot:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => castLiveVote(activeRes.id, "approve")}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        myLiveVote === "approve"
                          ? "bg-emerald-800 text-white border-emerald-800 shadow-md"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => castLiveVote(activeRes.id, "reject")}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        myLiveVote === "reject"
                          ? "bg-rose-800 text-white border-rose-800 shadow-md"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => castLiveVote(activeRes.id, "abstain")}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        myLiveVote === "abstain"
                          ? "bg-amber-800 text-white border-amber-800 shadow-md"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <MinusCircle className="w-4 h-4" />
                      <span>Abstain</span>
                    </button>
                  </div>
                </div>

                {/* Live Real-Time Tally Progress */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Total Ballots Received:</span>
                    <strong className="text-slate-900 dark:text-white">{totalVotesCast} / 14</strong>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Approve ({approveCount})
                      </span>
                      <span>{totalVotesCast > 0 ? Math.round((approveCount / totalVotesCast) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${totalVotesCast > 0 ? (approveCount / totalVotesCast) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIVE CHAT */}
            {activeRightTab === "chat" && (
              <div className="space-y-2 flex-1 flex flex-col justify-between text-xs max-h-72">
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {messages.map((m) => (
                    <div key={m.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px]">
                      <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 text-[10px]">
                        <span>{m.user}</span>
                        <span className="text-slate-400">{m.time}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 mt-1">{m.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message the boardroom..."
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: LIVE NOTES */}
            {activeRightTab === "notes" && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Secretary's Live Minute Capture
                </span>
                <textarea
                  rows={9}
                  value={liveNotes}
                  onChange={(e) => setLiveNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Meeting Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isMicOn
                ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMicOn ? "Mute" : "Unmute"}</span>
          </button>

          {/* Camera Button */}
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isCameraOn
                ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCameraOn ? "Camera On" : "Camera Off"}</span>
          </button>

          {/* Raise Hand Button */}
          <button
            onClick={() => {
              setIsHandRaised(!isHandRaised);
              addToast(isHandRaised ? "Hand Lowered" : "Hand Raised", "Chairman notified of your speaking request.", "info");
            }}
            className={`p-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isHandRaised
                ? "bg-amber-500 text-white shadow-xs animate-bounce"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">{isHandRaised ? "Hand Raised" : "Raise Hand"}</span>
          </button>
        </div>

        {/* Leave Meeting action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast("Meeting Recorded", "Secretariat minutes capture saved to archive.", "info")}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            Take Minutes
          </button>
          <button
            onClick={() => alert("Exited live boardroom session. Reconnection available anytime.")}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/20 transition-all"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave Room</span>
          </button>
        </div>
      </div>
    </div>
  );
};
