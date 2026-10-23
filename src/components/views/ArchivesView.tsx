"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Archive,
  Search,
  Calendar,
  Download,
  FileText,
  Layers,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const ArchivesView: React.FC = () => {
  const { meetings, boardPacks, setActiveTab, addToast } = useApp();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [search, setSearch] = useState("");

  const archivedMeetings = [
    {
      id: "arc-01",
      title: "83rd Ordinary Board of Directors Meeting",
      date: "2026-08-15",
      year: "2026",
      packPages: 184,
      resolutionsCount: 3,
      status: "Archived & Sealed",
    },
    {
      id: "arc-02",
      title: "Special Board Sitting: 2025 Financial Year-End Accounts",
      date: "2026-04-10",
      year: "2026",
      packPages: 220,
      resolutionsCount: 4,
      status: "Archived & Sealed",
    },
    {
      id: "arc-03",
      title: "82nd Ordinary Board of Directors Meeting",
      date: "2025-11-28",
      year: "2025",
      packPages: 195,
      resolutionsCount: 2,
      status: "Archived & Sealed",
    },
    {
      id: "arc-04",
      title: "81st Ordinary Board of Directors Meeting",
      date: "2025-08-14",
      year: "2025",
      packPages: 210,
      resolutionsCount: 5,
      status: "Archived & Sealed",
    },
    {
      id: "arc-05",
      title: "80th Ordinary Board of Directors Meeting",
      date: "2025-05-20",
      year: "2025",
      packPages: 178,
      resolutionsCount: 3,
      status: "Archived & Sealed",
    },
  ];

  const filteredArchives = archivedMeetings.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchYear = selectedYear === "all" || a.year === selectedYear;
    return matchSearch && matchYear;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Meeting Archives & Historical Vault
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Permanent statutory repository of historical board papers, sealed resolutions, and minutes records.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search historical board archives..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Historical Fiscal Years</option>
            <option value="2026">FY 2026</option>
            <option value="2025">FY 2025</option>
            <option value="2024">FY 2024</option>
          </select>
        </div>
      </div>

      {/* Archives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArchives.map((arc) => (
          <div
            key={arc.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {arc.year}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <Lock className="w-3 h-3" /> Sealed
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                {arc.title}
              </h3>

              <div className="text-xs text-slate-400 space-y-0.5">
                <div>Sitting Date: {arc.date}</div>
                <div>Complete Dossier: {arc.packPages} Pages ({arc.resolutionsCount} Resolutions)</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  addToast("Archive Bundle Downloaded", `Retrieved ${arc.title} dossier.`, "success");
                }}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Bundle
              </button>
              <button
                onClick={() => setActiveTab("minutes")}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Inspect Minutes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
