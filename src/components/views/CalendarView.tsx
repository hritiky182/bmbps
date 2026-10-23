"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Meeting } from "@/types";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  MapPin,
  Clock,
  Layers,
  X,
  Filter,
} from "lucide-react";

export const CalendarView: React.FC = () => {
  const { meetings, committees, setActiveTab, currentRole } = useApp();
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October 2026
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [viewType, setViewType] = useState<"month" | "week" | "day">("month");
  const [selectedCommittee, setSelectedCommittee] = useState<string>("all");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const totalDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);

  // Generate calendar grid cells
  const calendarCells = [];
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  const getMeetingsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    return meetings.filter((m) => {
      const matchDate = m.date === dateStr;
      const matchComm = selectedCommittee === "all" || m.committeeId === selectedCommittee;
      return matchDate && matchComm;
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Governance Sitting Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            NRFA Board, Sub-Committees, and statutory fiscal timetables for {currentYear}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Type Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewType("month")}
              className={`px-3 py-1 rounded-lg font-semibold ${
                viewType === "month"
                  ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewType("week")}
              className={`px-3 py-1 rounded-lg font-semibold ${
                viewType === "week"
                  ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewType("day")}
              className={`px-3 py-1 rounded-lg font-semibold ${
                viewType === "day"
                  ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Day
            </button>
          </div>

          {(currentRole === "secretary" || currentRole === "admin") && (
            <button
              onClick={() => setActiveTab("meetings")}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Sitting
            </button>
          )}
        </div>
      </div>

      {/* Month Navigation & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-semibold">Filter:</span>
          <select
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Sittings</option>
            {committees.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="min-h-[110px] bg-slate-50/40 dark:bg-slate-950/20" />;
            }

            const dayMeetings = getMeetingsForDay(day);
            const isToday = day === 23 && currentMonth === 9 && currentYear === 2026;

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[110px] p-2 flex flex-col justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                  isToday ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {day}
                  </span>
                  {dayMeetings.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>

                {/* Events list */}
                <div className="space-y-1 mt-1">
                  {dayMeetings.map((m) => {
                    let color = "bg-emerald-100/90 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
                    if (m.type === "committee") {
                      color = "bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
                    } else if (m.type === "extraordinary") {
                      color = "bg-amber-100/90 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
                    }

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMeeting(m)}
                        className={`w-full text-left p-1.5 rounded-lg border text-[10px] font-semibold leading-tight truncate block hover:shadow-xs transition-all ${color}`}
                      >
                        <div className="truncate font-bold">{m.startTime} {m.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Meeting Popup Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {selectedMeeting.status.replace("_", " ")}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {selectedMeeting.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{selectedMeeting.description}</p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {selectedMeeting.date} ({selectedMeeting.startTime} - {selectedMeeting.endTime})
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedMeeting.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="capitalize">{selectedMeeting.format} ({selectedMeeting.videoProvider || "Teams"})</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab("board-packs", { packId: selectedMeeting.boardPackId });
                  setSelectedMeeting(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                View Board Pack
              </button>
              <button
                onClick={() => {
                  setActiveTab("meeting-room");
                  setSelectedMeeting(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
