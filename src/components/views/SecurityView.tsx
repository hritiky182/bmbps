"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldAlert,
  Lock,
  Eye,
  Key,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";

export const SecurityView: React.FC = () => {
  const { addToast } = useApp();
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [sessionTimeoutMin, setSessionTimeoutMin] = useState(15);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(3);
  const [enableDynamicWatermark, setEnableDynamicWatermark] = useState(true);
  const [enableScreenShotProtection, setEnableScreenShotProtection] = useState(true);
  const [requireBiometrics, setRequireBiometrics] = useState(true);

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Security Policy Updated", "Enforced updated cryptographic baseline across all director endpoints.", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Security & Access Permissions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Sovereign governance policies, cryptographic access thresholds, and DRM watermark enforcement.
        </p>
      </div>

      <form onSubmit={handleSavePolicy} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Password & Authentication Policies */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Authentication & Password Policy</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Minimum Password Complexity
              </label>
              <select
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value={12}>12 Characters (Alphanumeric + Special Symbol)</option>
                <option value={14}>14 Characters (High Enterprise)</option>
                <option value={16}>16 Characters (Sovereign Tier)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Inactivity Session Timeout (Minutes)
              </label>
              <select
                value={sessionTimeoutMin}
                onChange={(e) => setSessionTimeoutMin(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value={10}>10 Minutes of Inactivity</option>
                <option value={15}>15 Minutes of Inactivity (Recommended)</option>
                <option value={30}>30 Minutes of Inactivity</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Failed Login Account Lockout Threshold
              </label>
              <select
                value={failedLoginAttempts}
                onChange={(e) => setFailedLoginAttempts(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value={3}>3 Failed Attempts (Lockout 30 Mins)</option>
                <option value={5}>5 Failed Attempts (Lockout 15 Mins)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireBiometrics}
                  onChange={(e) => setRequireBiometrics(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-700 w-4 h-4"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Enforce Biometric TouchID / FaceID for Director iPad Sessions
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: Digital Rights Management (DRM) & Watermarking */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Document Protection & Dynamic DRM</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active DRM Policy
              </span>
              <p className="text-[11px] leading-relaxed">
                Watermark automatically composites director name, assigned role, IP address, and cryptographic timestamp diagonally across every rendered PDF canvas.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDynamicWatermark}
                  onChange={(e) => setEnableDynamicWatermark(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-700 w-4 h-4"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Enforce Dynamic Watermarking on all Board Dockets
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableScreenShotProtection}
                  onChange={(e) => setEnableScreenShotProtection(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-700 w-4 h-4"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Prevent OS-Level Screenshot Capture on Tablet Clients
                </span>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Save & Apply Governance Policy
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
