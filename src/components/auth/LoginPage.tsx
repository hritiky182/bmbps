"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  Briefcase,
  Shield,
  Key,
  Building2,
  ChevronRight,
  Info,
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { switchRole, addToast } = useApp();
  const [email, setEmail] = useState("mwansa.lungu@nrfa.org.zm");
  const [password, setPassword] = useState("••••••••••••");

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    onLoginSuccess();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("admin") || email.includes("dalitso")) {
      switchRole("admin");
    } else if (email.includes("sec") || email.includes("mutale")) {
      switchRole("secretary");
    } else {
      switchRole("member");
    }
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-900/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Zambia Flag Micro Top Bar */}
      <div className="h-1.5 w-full flex">
        <div className="bg-emerald-600 flex-1 h-full" />
        <div className="bg-red-600 w-16 h-full" />
        <div className="bg-slate-950 w-16 h-full" />
        <div className="bg-orange-500 w-16 h-full" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Organization Branding & Scope (6 cols) */}
          <div className="md:col-span-6 space-y-6 text-white text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Republic of Zambia • National Road Fund</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                NRFA <span className="text-emerald-400">BoardConnect</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Enterprise Digital Board Pack & Governance Management Platform. Developed under statutory mandate Act No. 13 of 2002.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Encrypted Board Dockets & Dynamic Dynamic Watermarking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Offline Tablet Reading with Conflict-Free Synchronization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-400 flex items-center justify-center shrink-0">
                  ✓
                </div>
                <span>Circular Resolutions, E-Signatures & Live Boardroom Voting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 1-Click Demo Accounts & Form (6 cols) */}
          <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Select Demonstration Role</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any profile to access authenticated workspace:
              </p>
            </div>

            {/* Quick 1-Click Access Cards */}
            <div className="space-y-2.5">
              {/* Role 1: Board Member */}
              <button
                type="button"
                onClick={() => handleQuickLogin("member")}
                className="w-full p-3 rounded-2xl border border-emerald-600/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                      Dr. Mwansa K. Lungu
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      Non-Executive Director & Audit Chair
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Role 2: Board Secretary */}
              <button
                type="button"
                onClick={() => handleQuickLogin("secretary")}
                className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-blue-200 flex items-center justify-center font-bold shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
                      Mrs. Mutale Chileshe
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Corporate Board Secretary & Legal Counsel
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Role 3: System Administrator */}
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900 text-purple-200 flex items-center justify-center font-bold shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                      Eng. Dalitso Phiri
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ICT Director & System Administrator
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Simulated Form Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-800" />
              <span className="shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
                Or Sign In with Email
              </span>
              <div className="grow border-t border-slate-800" />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-white focus:outline-hidden focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-[11px]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-white focus:outline-hidden focus:border-emerald-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter BoardConnect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-[11px] text-slate-500 border-t border-slate-900">
        National Road Fund Agency (NRFA) • Lusaka, Republic of Zambia • Sovereign Board Portal Prototype
      </div>
    </div>
  );
};
