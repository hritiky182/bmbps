"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  MessageSquare,
  Send,
  Hash,
  User,
  Users,
  Search,
  Lock,
  Plus,
} from "lucide-react";

export const ConversationsView: React.FC = () => {
  const { currentUser, users } = useApp();
  const [activeChannel, setActiveChannel] = useState("general");
  const [channels, setChannels] = useState([
    { id: "general", name: "general-boardroom", description: "All NRFA Board Directors & Executive Management" },
    { id: "audit", name: "audit-risk-committee", description: "Audit Committee Members & Internal Audit" },
    { id: "tolling", name: "tolling-automation-working-group", description: "Tolling Plazas, ANPR and FastPass rollout" },
    { id: "finance", name: "finance-treasury-allocations", description: "Fuel levy disbursements and road fund revenues" },
  ]);

  const [channelMessages, setChannelMessages] = useState<Record<string, { id: string; user: string; avatar: string; time: string; text: string }[]>>({
    general: [
      { id: "m1", user: "Test Board Chair", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", time: "09:12", text: "Good morning distinguished directors. Please ensure all comments on the 84th Ordinary Board pack are submitted by tomorrow." },
      { id: "m2", user: "Test Director", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", time: "09:20", text: "Noted Board Chair. The Audit & Risk Committee has completed review of the Auditor General's fuel levy letter." },
      { id: "m3", user: "Test Secretary", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", time: "09:45", text: "Vol. II docket has been published in BoardConnect. Offline reading is available." },
    ],
    audit: [
      { id: "a1", user: "Test Director", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", time: "Yesterday", text: "Colleagues, let us examine the cash reconciliation progress for Shimabala toll gate." },
      { id: "a2", user: "Test Internal Auditor", avatar: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=150&auto=format&fit=crop&q=80", time: "Yesterday", text: "Cash variance reduced to under 0.02% following point-of-sale terminal upgrades." },
    ],
    tolling: [
      { id: "t1", user: "Test Admin", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", time: "Oct 21", text: "FastPass solar mini-grid installations completed at Katuba plaza." },
    ],
    finance: [
      { id: "f1", user: "Test Finance Director", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", time: "Oct 22", text: "Treasury disbursements to RDA reached ZMW 1.02 Billion for Q3." },
    ],
  });

  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      user: currentUser.name,
      avatar: currentUser.avatar,
      time: "Just now",
      text: inputText.trim(),
    };

    setChannelMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));

    setInputText("");
  };

  const currentChannelObj = channels.find((c) => c.id === activeChannel) || channels[0];
  const activeMsgs = channelMessages[activeChannel] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Boardroom Discussions & Secure Messaging
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Confidential peer-to-peer director communication channels and committee deliberation threads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden min-h-[600px]">
        {/* Left Column: Channels List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-100 dark:border-slate-800 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Committee Channels
            </span>

            <div className="space-y-1">
              {channels.map((ch) => {
                const isSelected = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>End-to-End Encrypted Communication</span>
          </div>
        </div>

        {/* Right Column: Chat Stream & Message Input (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6">
          {/* Channel Header */}
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Hash className="w-5 h-5 text-emerald-600" />
              <span>{currentChannelObj.name}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentChannelObj.description}</p>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs">
            {activeMsgs.map((m) => (
              <div key={m.id} className="flex items-start gap-3">
                <img
                  src={m.avatar}
                  alt={m.user}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-emerald-600/20"
                />
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{m.user}</span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${currentChannelObj.name}...`}
              className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
