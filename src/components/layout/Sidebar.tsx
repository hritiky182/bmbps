"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Layers,
  FileCheck2,
  FolderLock,
  Vote,
  FileSignature,
  CheckSquare,
  MessageSquare,
  Video,
  FileSpreadsheet,
  BarChart3,
  Archive,
  Users,
  Network,
  TabletSmartphone,
  ShieldAlert,
  History,
  Settings,
  ChevronRight,
  ShieldCheck,
  Building2,
  Radio,
} from "lucide-react";

interface SidebarProps {
  onNavigateMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigateMobile }) => {
  const { activeTab, setActiveTab, currentRole, circularResolutions, signatureRequests, actionItems } = useApp();

  const pendingVotesCount = circularResolutions.filter((c) => c.status === "awaiting_votes").length;
  const pendingSigsCount = signatureRequests.filter((s) => s.status === "pending").length;
  const openActionsCount = actionItems.filter((a) => a.status === "in_progress" || a.status === "not_started").length;

  const handleNav = (tabKey: string) => {
    setActiveTab(tabKey);
    if (onNavigateMobile) onNavigateMobile();
  };

  const navItemClass = (key: string) => {
    const isActive = activeTab === key;
    return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${isActive
        ? "bg-emerald-900 text-white shadow-md shadow-emerald-950/20 dark:bg-emerald-800"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
      }`;
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-slate-50/80 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-950/30 border border-emerald-700/50">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
              NRFA ZAMBIA(Demo)
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none flex items-center gap-1.5 mt-0.5">
              <span>BoardConnect</span>
            </div>
          </div>
        </div>

        {/* Zambia Flag Micro Ribbon */}
        <div className="mt-3 h-1 w-full flex rounded-full overflow-hidden">
          <div className="bg-emerald-600 flex-1 h-full" />
          <div className="bg-red-600 w-4 h-full" />
          <div className="bg-slate-950 w-4 h-full" />
          <div className="bg-orange-500 w-4 h-full" />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* MAIN */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Main
          </div>

          <button onClick={() => handleNav("dashboard")} className={navItemClass("dashboard")}>
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </div>
          </button>

          <button onClick={() => handleNav("meetings")} className={navItemClass("meetings")}>
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span>My Meetings</span>
            </div>
          </button>

          <button onClick={() => handleNav("calendar")} className={navItemClass("calendar")}>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Meeting Calendar</span>
            </div>
          </button>

          <button onClick={() => handleNav("board-packs")} className={navItemClass("board-packs")}>
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Board Packs</span>
            </div>
          </button>

          <button onClick={() => handleNav("circulars")} className={navItemClass("circulars")}>
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4 shrink-0" />
              <span>Circular Resolutions</span>
            </div>
            {pendingVotesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                {pendingVotesCount}
              </span>
            )}
          </button>
        </div>

        {/* COLLABORATION */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Collaboration
          </div>

          <button onClick={() => handleNav("meeting-room")} className={navItemClass("meeting-room")}>
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold">Live Meeting Room</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
              LIVE
            </span>
          </button>

          <button onClick={() => handleNav("documents")} className={navItemClass("documents")}>
            <div className="flex items-center gap-2.5">
              <FolderLock className="w-4 h-4 shrink-0" />
              <span>Document Library</span>
            </div>
          </button>

          <button onClick={() => handleNav("voting")} className={navItemClass("voting")}>
            <div className="flex items-center gap-2.5">
              <Vote className="w-4 h-4 shrink-0" />
              <span>Voting & Decisions</span>
            </div>
          </button>

          <button onClick={() => handleNav("signatures")} className={navItemClass("signatures")}>
            <div className="flex items-center gap-2.5">
              <FileSignature className="w-4 h-4 shrink-0" />
              <span>E-Signatures</span>
            </div>
            {pendingSigsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">
                {pendingSigsCount}
              </span>
            )}
          </button>

          <button onClick={() => handleNav("actions")} className={navItemClass("actions")}>
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Action Items</span>
            </div>
            {openActionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {openActionsCount}
              </span>
            )}
          </button>

          <button onClick={() => handleNav("conversations")} className={navItemClass("conversations")}>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Conversations</span>
            </div>
          </button>
        </div>

        {/* GOVERNANCE */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Governance
          </div>

          <button onClick={() => handleNav("minutes")} className={navItemClass("minutes")}>
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span>Meeting Minutes</span>
            </div>
          </button>

          <button onClick={() => handleNav("reports")} className={navItemClass("reports")}>
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Reports & Analytics</span>
            </div>
          </button>

          <button onClick={() => handleNav("archives")} className={navItemClass("archives")}>
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 shrink-0" />
              <span>Meeting Archives</span>
            </div>
          </button>
        </div>

        {/* ADMINISTRATION (Visible to Admin and Secretary) */}
        {(currentRole === "admin" || currentRole === "secretary") && (
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Administration</span>
              <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold lowercase">
                gov tier
              </span>
            </div>

            <button onClick={() => handleNav("users")} className={navItemClass("users")}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>Users & Groups</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold">
                28/30
              </span>
            </button>

            <button onClick={() => handleNav("committees")} className={navItemClass("committees")}>
              <div className="flex items-center gap-2.5">
                <Network className="w-4 h-4 shrink-0" />
                <span>Committees & Categories</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                5
              </span>
            </button>

            <button onClick={() => handleNav("devices-sync")} className={navItemClass("devices-sync")}>
              <div className="flex items-center gap-2.5">
                <TabletSmartphone className="w-4 h-4 shrink-0" />
                <span>Devices & Offline Sync</span>
              </div>
            </button>

            {currentRole === "admin" && (
              <>
                <button onClick={() => handleNav("security")} className={navItemClass("security")}>
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Security & Permissions</span>
                  </div>
                </button>

                <button onClick={() => handleNav("audit-logs")} className={navItemClass("audit-logs")}>
                  <div className="flex items-center gap-2.5">
                    <History className="w-4 h-4 shrink-0" />
                    <span>Audit Logs</span>
                  </div>
                </button>

                <button onClick={() => handleNav("settings")} className={navItemClass("settings")}>
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>System Settings</span>
                  </div>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Organization Card */}
      <div className="p-3 bg-emerald-950 text-emerald-100 dark:bg-emerald-950/80 border-t border-emerald-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-white truncate">National Road Fund</div>
            <div className="text-[10px] text-emerald-300/80 truncate">Ridgeway, Lusaka, ZM</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
