"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { SignatureRequest } from "@/types";
import {
  FileSignature,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  RotateCcw,
  Eye,
  Key,
  X,
  FileText,
  Sparkles,
} from "lucide-react";

export const SignaturesView: React.FC = () => {
  const { signatureRequests, signDocument, currentUser, documents, setActiveTab } = useApp();
  const [activeTab, setActiveTabFilter] = useState<"pending" | "signed">("pending");
  const [selectedSig, setSelectedSig] = useState<SignatureRequest | null>(
    signatureRequests.find((s) => s.status === "pending") || signatureRequests[0]
  );
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);

  // Signature canvas & style
  const [sigMode, setSigMode] = useState<"draw" | "type">("type");
  const [typedName, setTypedName] = useState(currentUser.name);
  const [typedStyle, setTypedStyle] = useState<"cursive" | "formal" | "executive">("cursive");
  const [twoFactorPin, setTwoFactorPin] = useState("842109");
  const [isConfirmed2FA, setIsConfirmed2FA] = useState(false);

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const pendingRequests = signatureRequests.filter((s) => s.status === "pending");
  const signedRequests = signatureRequests.filter((s) => s.status === "signed");

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#064e3b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleExecuteSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSig) return;
    const styleDescription = sigMode === "type" ? `Cryptographic Font (${typedStyle})` : "Hand-Drawn Stylus Vector";
    signDocument(selectedSig.id, styleDescription);
    setIsSigningModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Electronic Signatures & Execution
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic document endorsement pursuant to the Electronic Communications and Transactions Act.
          </p>
        </div>

        {/* Tab Toggle: Pending vs Signed */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTabFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Execution ({pendingRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveTabFilter("signed")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "signed"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed Archive ({signedRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Request Cards & Signature Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Signature Requests List (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {(activeTab === "pending" ? pendingRequests : signedRequests).map((sig) => {
            const isSelected = selectedSig?.id === sig.id;
            return (
              <div
                key={sig.id}
                onClick={() => setSelectedSig(sig)}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs space-y-3 ${
                  isSelected
                    ? "border-emerald-700 ring-2 ring-emerald-700/20"
                    : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400 text-[11px]">
                    {sig.documentCategory}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      sig.status === "signed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {sig.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {sig.documentTitle}
                </h3>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Requested by: <strong>{sig.requestedBy}</strong></div>
                  <div>Statutory Deadline: <strong>{sig.deadline}</strong></div>
                  {sig.signedAt && (
                    <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Executed: {sig.signedAt} ({sig.signedBy})
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    {sig.securityMethod}
                  </span>
                  {sig.status === "pending" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSig(sig);
                        setIsSigningModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                    >
                      Sign Now
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-bold text-[11px]">Sealed & Archived</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Document Details & Official Seal Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {selectedSig ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  Governance Endorsement Docket
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Authentication: 2FA Token
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedSig.documentTitle}
                </h2>
                <div className="text-[11px] text-slate-400 mt-1">
                  Issued on {selectedSig.requestedDate} • Deadline: {selectedSig.deadline}
                </div>
              </div>

              {/* Status Certificate Banner */}
              {selectedSig.status === "signed" ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Cryptographically Signed & Sealed</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
                    Endorsed by <strong>{selectedSig.signedBy}</strong> on {selectedSig.signedAt}.
                  </p>
                  <div className="p-2 rounded bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all">
                    {selectedSig.digitalCertificateHash || "SHA256:7f9a1b8c4d2e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8"}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1 text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Pending Formal Director Endorsement
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    The Board Secretariat requires your electronic signature prior to publishing the confirmed resolution.
                  </p>
                </div>
              )}

              {/* Document Overview Snippet */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Legal Covenant Excerpt
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-serif">
                  "IN WITNESS WHEREOF, the undersigned Director of the National Road Fund Agency (NRFA), in exercise of powers conferred under Section 11 of Act No. 13 of 2002, hereby executes this instrument and confirms concurrence with the approved board resolution."
                </div>
              </div>

              {/* Action Button */}
              {selectedSig.status === "pending" ? (
                <button
                  onClick={() => setIsSigningModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
                >
                  <FileSignature className="w-4 h-4" />
                  Proceed to Electronic Signature
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab("documents")}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  View Original Docket in Archive
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 text-xs">
              Select a signature request to inspect docket.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Electronic Signature Modal */}
      {isSigningModalOpen && selectedSig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Electronic Signature Seal
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Execute Digital Signature
                </h3>
              </div>
              <button
                onClick={() => setIsSigningModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Endorsing: <strong>{selectedSig.documentTitle}</strong>
            </p>

            <form onSubmit={handleExecuteSignature} className="space-y-4 text-xs">
              {/* Mode Toggle: Type vs Draw */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSigMode("type")}
                  className={`py-1.5 rounded-lg transition-all ${
                    sigMode === "type"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Type Signature (Calligraphy)
                </button>
                <button
                  type="button"
                  onClick={() => setSigMode("draw")}
                  className={`py-1.5 rounded-lg transition-all ${
                    sigMode === "draw"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Draw with Stylus / Mouse
                </button>
              </div>

              {/* Mode 1: Type Signature */}
              {sigMode === "type" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600 font-medium"
                    />
                  </div>

                  {/* Font previews */}
                  <div className="p-4 rounded-xl border-2 border-emerald-600/30 bg-emerald-50/30 dark:bg-emerald-950/20 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">Signature Seal Preview:</span>
                    <div className="text-2xl font-serif italic text-emerald-950 dark:text-emerald-200 tracking-wide py-2">
                      {typedName || "Dr. Mwansa K. Lungu"}
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      Verified Board Member • NRFA Zambia
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode 2: Draw Signature */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Draw your signature in the box below:</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={440}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-crosshair"
                  />
                </div>
              )}

              {/* 2FA Identity Confirmation */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    Simulated 2FA Identity PIN
                  </span>
                  <span className="text-[10px] text-slate-400">Default PIN: 842109</span>
                </div>
                <input
                  type="password"
                  value={twoFactorPin}
                  onChange={(e) => setTwoFactorPin(e.target.value)}
                  placeholder="Enter 6-digit board token"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center tracking-widest font-mono text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSigningModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate & Endorse Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
