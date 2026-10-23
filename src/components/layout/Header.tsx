"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  Search,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Sun,
  Moon,
  Shield,
  Briefcase,
  UserCheck,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Menu,
} from "lucide-react";

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    isOffline,
    setIsOffline,
    pendingSyncItems,
    syncNow,
    isSyncing,
    notifications,
    unreadNotifCount,
    markNotifAsRead,
    markAllNotifsAsRead,
    isDark,
    toggleDarkMode,
    setIsSearchOpen,
    setActiveTab,
    resetDemoData,
    lastSyncTime,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left section: Mobile menu & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-xs w-48 sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 text-left truncate">Search dockets, votes, packs...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-200/70 dark:bg-slate-700 rounded text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Simulated Online / Offline Toggle */}
        <div className="hidden md:flex items-center gap-1.5 pl-2">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              isOffline
                ? "bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse-subtle"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
            }`}
            title="Click to toggle simulated offline/online state"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>OFFLINE MODE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>ONLINE</span>
              </>
            )}
          </button>

          {/* Pending Sync / Sync Now button */}
          {(pendingSyncItems.length > 0 || isOffline) && (
            <button
              onClick={syncNow}
              disabled={isSyncing || isOffline}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                isOffline
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  : "bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-800 shadow-xs"
              }`}
              title={isOffline ? "Switch to Online Mode to sync changes" : "Upload offline queue to server"}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              <span>
                {isSyncing ? "Syncing..." : pendingSyncItems.length > 0 ? `Sync Now (${pendingSyncItems.length})` : "Synced"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Right section: Role switcher, notifications, theme, reset & profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Chips */}
        <div className="relative" ref={roleRef}>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => switchRole("member")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentRole === "member"
                  ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Switch to Non-Executive Board Director view"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Director</span>
            </button>

            <button
              onClick={() => switchRole("secretary")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentRole === "secretary"
                  ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Switch to Corporate Board Secretary view"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Secretary</span>
            </button>

            <button
              onClick={() => switchRole("admin")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentRole === "admin"
                  ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Switch to ICT System Administrator view"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotifCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotifsAsRead}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotifAsRead(notif.id);
                      setActiveTab(notif.linkTab, { targetId: notif.targetId });
                      setShowNotifMenu(false);
                    }}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3 ${
                      !notif.read ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !notif.read ? "bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{notif.timestamp}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline flex items-center gap-0.5">
                          Open <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Reset Demo Data button */}
        <button
          onClick={() => {
            if (confirm("Reset NRFA BoardConnect demonstration data back to fresh pristine state?")) {
              resetDemoData();
            }
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset Demo Dataset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-emerald-600/30 ring-2 ring-emerald-600/10"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
              {currentRole === "admin"
                ? "ICT Administrator"
                : currentRole === "secretary"
                ? "Board Secretary"
                : "Board Director"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
