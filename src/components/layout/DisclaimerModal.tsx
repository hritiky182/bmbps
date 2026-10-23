"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Lock, AlertTriangle, FileText, Check } from "lucide-react";

export const DisclaimerModal: React.FC = () => {
  const { isDisclaimerAccepted, acceptDisclaimer, currentUser } = useApp();
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
  const [agreedToAll, setAgreedToAll] = useState(false);

  if (isDisclaimerAccepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Zambia Flag Trim Header */}
        <div className="h-1.5 w-full flex">
          <div className="bg-emerald-600 flex-1 h-full" />
          <div className="bg-red-600 w-12 h-full" />
          <div className="bg-slate-950 w-12 h-full" />
          <div className="bg-orange-500 w-12 h-full" />
        </div>

        <div className="p-6 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Republic of Zambia • National Road Fund Agency
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Board Governance & Confidentiality Undertaking
              </h2>
            </div>
          </div>
        </div>

        <div
          className="p-6 overflow-y-auto text-xs leading-relaxed text-slate-600 dark:text-slate-300 space-y-4"
          onScroll={(e) => {
            const target = e.currentTarget;
            if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
              setHasScrolledTerms(true);
            }
          }}
        >
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Official Fiduciary Notice:</span> You are accessing the protected governance portal of the National Road Fund Agency (NRFA), established under Act No. 13 of 2002. All documents, deliberations, and resolutions herein are subject to statutory confidentiality.
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              1. Non-Disclosure & Statutory Secrecy
            </h3>
            <p>
              Under Section 18 of the National Road Fund Act and the State Security Act, Cap 111 of the Laws of Zambia, every Board Director and Officer undertakes not to disclose, replicate, photograph, or transfer any road funding allocation papers, tender evaluations, toll revenue audits, or internal committee minutes to unauthorized parties.
            </p>

            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              2. Digital Rights & Dynamic Watermarking
            </h3>
            <p>
              All board packs and docket excerpts viewed within this platform are dynamically watermarked with your full identity (<strong>{currentUser.name}</strong>), assigned role, IP address, and cryptographic timestamp. Unauthorized extraction or screenshot capture constitutes a breach of the Data Protection Act No. 3 of 2021.
            </p>

            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              3. Device Security & Offline Synchronization
            </h3>
            <p>
              Downloaded board packs stored locally for offline review remain encrypted. In the event of device loss, theft, or compromise, the System Administrator is mandated to trigger a remote wipe of the local BoardConnect cache.
            </p>

            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              4. Electronic Voting & Digital Signatures
            </h3>
            <p>
              Electronic ballots cast on Circular Resolutions and simulated digital signatures executed on board resolutions carry full governance record validity under the Electronic Communications and Transactions Act.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToAll}
                onChange={(e) => setAgreedToAll(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 w-4 h-4"
              />
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                I, <strong>{currentUser.name}</strong> ({currentUser.title}), confirm that I have read, understood, and solemnly undertake to abide by the NRFA Board Governance & Confidentiality Charter.
              </span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit Encrypted Session • NRFA Head Office, Lusaka
          </div>
          <button
            onClick={acceptDisclaimer}
            disabled={!agreedToAll}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all ${
              agreedToAll
                ? "bg-emerald-800 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Check className="w-4 h-4" />
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
