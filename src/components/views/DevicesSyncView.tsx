"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  TabletSmartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
  X,
} from "lucide-react";

export const DevicesSyncView: React.FC = () => {
  const {
    isOffline,
    setIsOffline,
    pendingSyncItems,
    syncNow,
    isSyncing,
    lastSyncTime,
    devices,
    remoteWipeDevice,
    boardPacks,
    currentUser,
    addToast,
    setActiveTab,
  } = useApp();

  const [wipeConfirmDevice, setWipeConfirmDevice] = useState<string | null>(null);

  const handleToggleOffline = () => {
    setIsOffline(!isOffline);
    if (!isOffline) {
      addToast("Offline Mode Enabled", "Application running from local browser cache. Annotations will be queued.", "warning");
    } else {
      addToast("Online Mode Restored", "Connected to NRFA cloud servers. Ready to synchronize.", "success");
    }
  };

  const handleExecuteWipe = () => {
    if (!wipeConfirmDevice) return;
    remoteWipeDevice(wipeConfirmDevice);
    setWipeConfirmDevice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Devices & Offline Synchronization
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Offline docket caching, conflict reconciliation, and mobile device management (MDM).
          </p>
        </div>

        {/* Global Online/Offline Switcher Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleOffline}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
              isOffline
                ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 animate-pulse-subtle"
                : "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            <span>{isOffline ? "Switch to Online Mode" : "Simulate Offline Mode"}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div
        className={`p-5 rounded-2xl border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isOffline
            ? "bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
            : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isOffline ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`}
            />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {isOffline ? "Currently Operating Offline" : "Central Sync Status: Up to Date"}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Last server synchronization: <strong>{lastSyncTime}</strong> • Device vault: AES-256 local encrypted container.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={syncNow}
            disabled={isSyncing || isOffline}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing with Cloud..." : "Sync Now"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Pending Sync Queue & Cached Dockets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Changes Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Pending Changes Queue ({pendingSyncItems.length})
            </h3>
            {pendingSyncItems.length > 0 && !isOffline && (
              <button onClick={syncNow} className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                Upload All
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Modifications made while in offline mode will appear here until synchronized with the central repository.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
            {pendingSyncItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p>No pending offline changes.</p>
                <p className="text-[11px] text-slate-400">
                  Switch to Offline Mode, add an annotation in a board pack, and watch it queue here!
                </p>
              </div>
            ) : (
              pendingSyncItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 dark:text-amber-200 uppercase text-[10px]">
                      {item.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.title}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Offline Cached Board Packs & Registered Fleet (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cached Packs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Locally Cached Board Dockets
            </h3>

            <div className="space-y-2.5 text-xs">
              {boardPacks.slice(0, 3).map((pack) => (
                <div
                  key={pack.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{pack.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {pack.totalPages} Pages • Encrypted Cache Size: ~14.2 MB
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    Downloaded
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Device Fleet & Remote Wipe */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <TabletSmartphone className="w-4 h-4 text-purple-600" />
              Registered Director Devices Fleet ({devices.length})
            </h3>

            <div className="space-y-2.5 text-xs">
              {devices.slice(0, 4).map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{dev.deviceName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Assigned: {dev.assignedUserName} • {dev.os} • Last Sync: {dev.lastSync}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        dev.status === "active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {dev.status}
                    </span>

                    {dev.status === "active" && (
                      <button
                        onClick={() => setWipeConfirmDevice(dev.id)}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 text-[10px] font-bold transition-colors"
                      >
                        Remote Wipe
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Remote Wipe Safety Confirmation Modal */}
      {wipeConfirmDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Security Directive
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Simulated Remote Device Wipe
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to trigger a remote wipe on device{" "}
              <strong>
                {devices.find((d) => d.id === wipeConfirmDevice)?.deviceName}
              </strong>
              ? This action transmits an encrypted erase command to wipe all cached board packs, notes, and session tokens.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setWipeConfirmDevice(null)}
                className="px-4 py-2 rounded-xl text-slate-500 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteWipe}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Transmit Remote Wipe Payload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
