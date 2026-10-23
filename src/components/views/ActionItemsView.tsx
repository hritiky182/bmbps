"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ActionItem } from "@/types";
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Grid,
  List,
  Search,
  X,
  User,
  Calendar,
} from "lucide-react";

export const ActionItemsView: React.FC = () => {
  const { actionItems, createActionItem, updateActionStatus, users, meetings, currentUser, currentRole } = useApp();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssignee, setNewAssignee] = useState(currentUser.id);
  const [newDueDate, setNewDueDate] = useState("2026-11-20");
  const [newPriority, setNewPriority] = useState<ActionItem["priority"]>("high");

  const filteredActions = actionItems.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "all" || a.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const columns: { status: ActionItem["status"]; label: string; color: string }[] = [
    { status: "not_started", label: "Not Started", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
    { status: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
    { status: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
    { status: "overdue", label: "Overdue", color: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createActionItem({
      title: newTitle,
      description: newDesc,
      assignedMemberId: newAssignee,
      dueDate: newDueDate,
      priority: newPriority,
    });
    setIsCreateOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Action Items & Task Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Post-meeting resolution tracking, executive accountability, and milestone deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Assign Action
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action items or assigned director..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colActions = filteredActions.filter((a) => a.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-100/60 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/60 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">{colActions.length}</span>
                </div>

                <div className="space-y-3 mt-3 flex-1 overflow-y-auto">
                  {colActions.map((act) => {
                    const assignee = users.find((u) => u.id === act.assignedMemberId);
                    return (
                      <div
                        key={act.id}
                        onClick={() => setSelectedAction(act)}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-600/50 cursor-pointer space-y-2.5 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className={`font-bold uppercase ${
                              act.priority === "high"
                                ? "text-rose-600"
                                : act.priority === "medium"
                                ? "text-amber-600"
                                : "text-slate-500"
                            }`}
                          >
                            {act.priority} Priority
                          </span>
                          <span className="text-slate-400">{act.dueDate}</span>
                        </div>

                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                          {act.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {act.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span className="truncate max-w-[120px]">{assignee?.name || "Director"}</span>
                          </div>
                          {act.status !== "completed" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateActionStatus(act.id, "completed", "Marked complete by director.");
                              }}
                              className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                            >
                              Complete ✓
                            </button>
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: TABLE VIEW */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
              <tr>
                <th className="p-3.5">Action Title</th>
                <th className="p-3.5">Assigned Director</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredActions.map((act) => {
                const assignee = users.find((u) => u.id === act.assignedMemberId);
                return (
                  <tr
                    key={act.id}
                    onClick={() => setSelectedAction(act)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{act.title}</div>
                      <div className="text-[10px] text-slate-400">{act.meetingTitle}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{assignee?.name}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{act.dueDate}</td>
                    <td className="p-3.5 uppercase font-bold text-[10px]">
                      <span className={act.priority === "high" ? "text-rose-600" : "text-amber-600"}>
                        {act.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {act.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {act.status !== "completed" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateActionStatus(act.id, "completed", "Marked complete.");
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-800 text-white font-semibold text-[10px]"
                        >
                          Mark Done
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold">Done</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Detail & Status Update Drawer/Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {selectedAction.status.replace("_", " ")}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                  {selectedAction.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{selectedAction.description}</p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned To:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {users.find((u) => u.id === selectedAction.assignedMemberId)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAction.dueDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Priority:</span>
                <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                  {selectedAction.priority}
                </span>
              </div>
              {selectedAction.completionNotes && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Notes:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{selectedAction.completionNotes}</p>
                </div>
              )}
            </div>

            {/* Quick Status Update buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Update Governance Status:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    updateActionStatus(selectedAction.id, "in_progress");
                    setSelectedAction(null);
                  }}
                  className="py-2 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold"
                >
                  In Progress
                </button>
                <button
                  onClick={() => {
                    updateActionStatus(selectedAction.id, "completed", "Delivered on schedule.");
                    setSelectedAction(null);
                  }}
                  className="py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Completed ✓
                </button>
                <button
                  onClick={() => {
                    updateActionStatus(selectedAction.id, "overdue");
                    setSelectedAction(null);
                  }}
                  className="py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                >
                  Flag Overdue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Action Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Assign New Governance Action Item
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Action Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Conduct Pavement Asset Audit on T2 Corridor"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Deliverable Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Terms of reference and expected board output..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Assigned Director
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {users.slice(0, 10).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md transition-all"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
