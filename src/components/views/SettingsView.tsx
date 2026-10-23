"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Settings,
  Building2,
  Calendar,
  HardDrive,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { resetDemoData, addToast } = useApp();
  const [agencyName, setAgencyName] = useState("National Road Fund Agency (NRFA)");
  const [address, setAddress] = useState("Plot 330/1, Corner of Government & Fairley Roads, Ridgeway, Lusaka");
  const [fiscalYear, setFiscalYear] = useState("2026");
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  const handleTriggerBackup = () => {
    setIsBackupRunning(true);
    setTimeout(() => {
      setIsBackupRunning(false);
      addToast("Backup Created", "Encrypted sovereign snapshot archived to offsite DR location.", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          System Settings & Agency Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Organizational parameters, sovereign data sovereignty settings, and demonstration utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agency Legal Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Statutory Agency Parameters</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Organization Legal Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Headquarters Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Active Governance Fiscal Year
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="2026">FY 2026 (Active Deliberations)</option>
                <option value="2027">FY 2027 (Budget Planning)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sovereign Backup & Demonstration Reset */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Sovereign Data Protection & Backup</span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Automated Daily Snapshot:</span>
                <span className="font-semibold text-emerald-600">Enabled (04:00 CAT)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Encryption Standard:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">AES-256 GCM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Data Residency:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">In-Country (Lusaka Tier III)</span>
              </div>
            </div>

            <button
              onClick={handleTriggerBackup}
              disabled={isBackupRunning}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackupRunning ? "animate-spin" : ""}`} />
              <span>{isBackupRunning ? "Archiving Snapshot..." : "Trigger Manual Encrypted Snapshot"}</span>
            </button>
          </div>

          {/* Demonstration Reset Utility */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Demonstration Environment Utility
            </span>
            <button
              onClick={() => {
                if (confirm("Reset NRFA BoardConnect demonstration data back to fresh pristine state?")) {
                  resetDemoData();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demonstration Dataset to Initial State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
