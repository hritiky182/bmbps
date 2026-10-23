"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
  CheckCircle2,
  FileCheck2,
  Layers,
} from "lucide-react";

export const ReportsView: React.FC = () => {
  const { committees, meetings, circularResolutions, actionItems, users, addToast } = useApp();
  const [selectedCommittee, setSelectedCommittee] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("2026-q3-q4");

  // Realistic analytics datasets
  const attendanceData = [
    { name: "Dr. Lungu", attendance: 96, apologies: 4 },
    { name: "Mr. Mutwale", attendance: 100, apologies: 0 },
    { name: "Dr. Zimba", attendance: 92, apologies: 8 },
    { name: "Prof. Situmbeko", attendance: 88, apologies: 12 },
    { name: "Mrs. Mwanza", attendance: 94, apologies: 6 },
    { name: "Eng. Chilufya", attendance: 90, apologies: 10 },
  ];

  const votingOutcomesData = [
    { name: "Approved", value: 16, color: "#059669" },
    { name: "Rejected", value: 1, color: "#e11d48" },
    { name: "Amended", value: 2, color: "#d97706" },
  ];

  const packReadinessData = [
    { committee: "Main Board", readPct: 88, avgMinutes: 142 },
    { committee: "Audit & Risk", readPct: 95, avgMinutes: 190 },
    { committee: "Finance & Invest.", readPct: 91, avgMinutes: 165 },
    { committee: "Governance", readPct: 85, avgMinutes: 110 },
    { committee: "Technical", readPct: 90, avgMinutes: 155 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Director,Attendance Rate,Apologies,Packs Read,Resolutions Voted,Actions Completed\n" +
      "Dr. Mwansa K. Lungu,96%,1,8,7,5\n" +
      "Mr. Joe Mutwale,100%,0,8,7,4\n" +
      "Dr. Beatrice S. Zimba,92%,2,7,6,3\n" +
      "Prof. Muyunda M. Situmbeko,88%,3,6,5,2\n" +
      "Mrs. Chipo K. Mwanza,94%,1,7,6,4\n" +
      "Eng. Charles M. Banda,100%,0,8,7,6\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NRFA_Board_Governance_Report_FY2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Report Exported", "NRFA governance CSV dataset downloaded.", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Governance Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Board member participation metrics, resolution pass rates, and statutory audit readiness.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Date Range Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Fiscal Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="2026-q3-q4">FY2026 (Q3 - Q4 Current)</option>
            <option value="2026-full">Full Year 2026</option>
            <option value="2025-annual">FY2025 Historical Baseline</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter Committee:</span>
          <select
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Governance Bodies</option>
            {committees.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Attendance</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">94.8%</div>
          <div className="text-[11px] text-emerald-600 mt-1">Exceeds 85% statutory benchmark</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolutions Adopted</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">16 of 17</div>
          <div className="text-[11px] text-slate-400 mt-1">94.1% unanimous or supermajority</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Board Pack Read Rate</span>
          <div className="text-2xl font-black text-blue-600 mt-1">89.6%</div>
          <div className="text-[11px] text-slate-400 mt-1">Average 2.4 hours pre-reading</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Action Resolution</span>
          <div className="text-2xl font-black text-amber-600 mt-1">86.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">19 of 22 milestones completed</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance by Director Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Board Director Attendance Rate (%)
            </h3>
            <span className="text-xs text-slate-400">Statutory Sittings FY2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#064e3b", color: "#fff", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="attendance" fill="#059669" radius={[6, 6, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Voting Outcomes Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Resolution Decision Outcomes
            </h3>
            <span className="text-xs text-slate-400">19 Motions</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={votingOutcomesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {votingOutcomesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Committee Pack Read Status Table (12 cols) */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Board Pack Preparation & Pre-Meeting Review Performance
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">100% On-Time Distribution</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="p-3">Committee / Organ</th>
                  <th className="p-3">Read Rate (%)</th>
                  <th className="p-3">Avg Director Reading Time</th>
                  <th className="p-3">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {packReadinessData.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{p.committee}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full" style={{ width: `${p.readPct}%` }} />
                        </div>
                        <span className="font-mono">{p.readPct}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">
                      {Math.floor(p.avgMinutes / 60)}h {p.avgMinutes % 60}m
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Compliant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
