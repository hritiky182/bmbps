"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Committee,
  Meeting,
  BoardDocument,
  BoardPack,
  CircularResolution,
  LiveResolution,
  SignatureRequest,
  ActionItem,
  MeetingMinutes,
  AuditLog,
  RegisteredDevice,
  OfflineSyncItem,
  AppNotification,
  Annotation,
} from "@/types";
import {
  SEED_USERS,
  SEED_COMMITTEES,
  SEED_DOCUMENTS,
  SEED_MEETINGS,
  SEED_BOARD_PACKS,
  SEED_CIRCULAR_RESOLUTIONS,
  SEED_LIVE_RESOLUTIONS,
  SEED_SIGNATURE_REQUESTS,
  SEED_ACTION_ITEMS,
  SEED_ANNOTATIONS,
  SEED_MINUTES,
  SEED_AUDIT_LOGS,
  SEED_DEVICES,
  SEED_NOTIFICATIONS,
} from "@/data/seedData";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface AppContextType {
  // Auth & Roles
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  isDisclaimerAccepted: boolean;
  acceptDisclaimer: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;

  // Navigation & Deep link state
  activeTab: string;
  setActiveTab: (tab: string, meta?: any) => void;
  activeMeetingId: string | null;
  setActiveMeetingId: (id: string | null) => void;
  activePackId: string | null;
  setActivePackId: (id: string | null) => void;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;

  // Search & Global modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Offline & Synchronization
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  pendingSyncItems: OfflineSyncItem[];
  addPendingSyncItem: (item: Omit<OfflineSyncItem, "id" | "timestamp" | "synced">) => void;
  syncNow: () => void;
  isSyncing: boolean;
  lastSyncTime: string;

  // Entities & Operations
  users: User[];
  addUser: (user: Partial<User>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  toggleUserStatus: (id: string) => void;

  committees: Committee[];

  meetings: Meeting[];
  createMeeting: (meeting: Partial<Meeting>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;

  boardPacks: BoardPack[];
  publishBoardPack: (packId: string) => void;
  markPackAsRead: (packId: string, userId?: string) => void;

  documents: BoardDocument[];
  addDocument: (doc: Partial<BoardDocument>) => void;

  annotations: Annotation[];
  addAnnotation: (ann: Omit<Annotation, "id" | "createdAt" | "authorId" | "authorName">) => void;
  deleteAnnotation: (id: string) => void;

  circularResolutions: CircularResolution[];
  createCircular: (cr: Partial<CircularResolution>) => void;
  castCircularVote: (crId: string, choice: "approve" | "reject" | "abstain", comments?: string) => void;

  liveResolutions: LiveResolution[];
  castLiveVote: (resId: string, choice: "approve" | "reject" | "abstain") => void;
  openLiveVote: (resId: string) => void;
  createLiveResolution: (res: Partial<LiveResolution>) => void;

  signatureRequests: SignatureRequest[];
  signDocument: (sigId: string, signatureStyle: string, hash?: string) => void;

  actionItems: ActionItem[];
  createActionItem: (item: Partial<ActionItem>) => void;
  updateActionStatus: (actId: string, status: ActionItem["status"], notes?: string) => void;

  minutesList: MeetingMinutes[];
  createMinutes: (min: Partial<MeetingMinutes>) => void;
  updateMinutes: (id: string, updates: Partial<MeetingMinutes>) => void;
  approveMinutes: (id: string) => void;

  devices: RegisteredDevice[];
  remoteWipeDevice: (devId: string) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: AuditLog["module"], details: string, severity?: AuditLog["severity"]) => void;

  notifications: AppNotification[];
  unreadNotifCount: number;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;

  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = "nrfa_boardconnect_v2_";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentRole, setCurrentRole] = useState<UserRole>("member");
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[2]); // Test Director by default
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Nav state
  const [activeTab, setActiveTabState] = useState<string>("dashboard");
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>("mtg-01");
  const [activePackId, setActivePackId] = useState<string | null>("pack-01");
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>("doc-01");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Offline state
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncItems, setPendingSyncItems] = useState<OfflineSyncItem[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Today, 09:42");

  // Collections
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [committees, setCommittees] = useState<Committee[]>(SEED_COMMITTEES);
  const [meetings, setMeetings] = useState<Meeting[]>(SEED_MEETINGS);
  const [boardPacks, setBoardPacks] = useState<BoardPack[]>(SEED_BOARD_PACKS);
  const [documents, setDocuments] = useState<BoardDocument[]>(SEED_DOCUMENTS);
  const [annotations, setAnnotations] = useState<Annotation[]>(SEED_ANNOTATIONS);
  const [circularResolutions, setCircularResolutions] = useState<CircularResolution[]>(SEED_CIRCULAR_RESOLUTIONS);
  const [liveResolutions, setLiveResolutions] = useState<LiveResolution[]>(SEED_LIVE_RESOLUTIONS);
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>(SEED_SIGNATURE_REQUESTS);
  const [actionItems, setActionItems] = useState<ActionItem[]>(SEED_ACTION_ITEMS);
  const [minutesList, setMinutesList] = useState<MeetingMinutes[]>(SEED_MINUTES);
  const [devices, setDevices] = useState<RegisteredDevice[]>(SEED_DEVICES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedDisclaimer = localStorage.getItem(`${STORAGE_PREFIX}disclaimer`);
      if (storedDisclaimer === "true") setIsDisclaimerAccepted(true);

      const storedRole = localStorage.getItem(`${STORAGE_PREFIX}role`) as UserRole;
      if (storedRole && ["admin", "secretary", "member"].includes(storedRole)) {
        setCurrentRole(storedRole);
        if (storedRole === "admin") setCurrentUser(SEED_USERS[0]);
        else if (storedRole === "secretary") setCurrentUser(SEED_USERS[1]);
        else setCurrentUser(SEED_USERS[2]);
      }

      const storedMeetings = localStorage.getItem(`${STORAGE_PREFIX}meetings`);
      if (storedMeetings) setMeetings(JSON.parse(storedMeetings));

      const storedPacks = localStorage.getItem(`${STORAGE_PREFIX}packs`);
      if (storedPacks) setBoardPacks(JSON.parse(storedPacks));

      const storedCirculars = localStorage.getItem(`${STORAGE_PREFIX}circulars`);
      if (storedCirculars) setCircularResolutions(JSON.parse(storedCirculars));

      const storedLiveRes = localStorage.getItem(`${STORAGE_PREFIX}live_res`);
      if (storedLiveRes) setLiveResolutions(JSON.parse(storedLiveRes));

      const storedSigs = localStorage.getItem(`${STORAGE_PREFIX}signatures`);
      if (storedSigs) setSignatureRequests(JSON.parse(storedSigs));

      const storedActions = localStorage.getItem(`${STORAGE_PREFIX}actions`);
      if (storedActions) setActionItems(JSON.parse(storedActions));

      const storedAnnotations = localStorage.getItem(`${STORAGE_PREFIX}annotations`);
      if (storedAnnotations) setAnnotations(JSON.parse(storedAnnotations));

      const storedSyncQueue = localStorage.getItem(`${STORAGE_PREFIX}sync_queue`);
      if (storedSyncQueue) setPendingSyncItems(JSON.parse(storedSyncQueue));

      const storedDevices = localStorage.getItem(`${STORAGE_PREFIX}devices`);
      if (storedDevices) setDevices(JSON.parse(storedDevices));

      const storedLogs = localStorage.getItem(`${STORAGE_PREFIX}audit_logs`);
      if (storedLogs) setAuditLogs(JSON.parse(storedLogs));

      const storedUsers = localStorage.getItem(`${STORAGE_PREFIX}users`);
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
  }, []);

  // Helper to persist
  const persist = (key: string, data: any) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  };

  const addToast = (title: string, message: string, type: ToastMessage["type"] = "success") => {
    const id = "toast-" + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (
    action: string,
    module: AuditLog["module"],
    details: string,
    severity: AuditLog["severity"] = "info"
  ) => {
    const newLog: AuditLog = {
      id: "aud-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentRole === "admin" ? "System Administrator" : currentRole === "secretary" ? "Board Secretary" : "Board Member",
      action,
      module,
      details,
      ipAddress: isOffline ? "Offline Device Cache" : "102.140.218.42 (Lusaka, ZM)",
      severity,
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    persist("audit_logs", updated);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem(`${STORAGE_PREFIX}role`, role);
    let targetUser = SEED_USERS[2];
    if (role === "admin") targetUser = SEED_USERS[0];
    else if (role === "secretary") targetUser = SEED_USERS[1];

    setCurrentUser(targetUser);
    addToast("Role Switched", `Active view changed to ${targetUser.name} (${targetUser.title})`, "info");
    addAuditLog("Role Switched", "Auth", `Switched active session view to ${role}`);
  };

  const acceptDisclaimer = () => {
    setIsDisclaimerAccepted(true);
    localStorage.setItem(`${STORAGE_PREFIX}disclaimer`, "true");
    addToast("Confidentiality Confirmed", "Governance terms accepted. Access to NRFA BoardConnect granted.", "success");
    addAuditLog("Terms Accepted", "Auth", "Accepted Confidentiality and Governance Undertaking");
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setActiveTab = (tab: string, meta?: any) => {
    setActiveTabState(tab);
    if (meta?.meetingId) setActiveMeetingId(meta.meetingId);
    if (meta?.packId) setActivePackId(meta.packId);
    if (meta?.docId) setActiveDocumentId(meta.docId);
  };

  // Offline Sync Management
  const addPendingSyncItem = (item: Omit<OfflineSyncItem, "id" | "timestamp" | "synced">) => {
    const newItem: OfflineSyncItem = {
      ...item,
      id: "sync-" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      synced: false,
    };
    const updated = [newItem, ...pendingSyncItems];
    setPendingSyncItems(updated);
    persist("sync_queue", updated);
    addToast("Saved to Device Cache", `${item.title} queued for synchronization when online`, "info");
  };

  const syncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setPendingSyncItems([]);
      persist("sync_queue", []);
      const nowStr = "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSyncTime(nowStr);
      addToast("Synchronization Complete", "All cached annotations, reading states, and logs uploaded to server.", "success");
      addAuditLog("Manual Synchronization", "Sync", "Reconciled local device cache with NRFA central registry");
    }, 1400);
  };

  // Meeting operations
  const createMeeting = (newMtg: Partial<Meeting>) => {
    const id = "mtg-" + Date.now();
    const fullMeeting: Meeting = {
      id,
      title: newMtg.title || "New Board Sitting",
      type: newMtg.type || "ordinary",
      committeeId: newMtg.committeeId || "comm-1",
      description: newMtg.description || "Meeting convened under NRFA Act No. 13 of 2002.",
      date: newMtg.date || "2026-11-20",
      startTime: newMtg.startTime || "09:00",
      endTime: newMtg.endTime || "13:00",
      location: newMtg.location || "NRFA Executive Boardroom",
      format: newMtg.format || "hybrid",
      videoProvider: newMtg.videoProvider || "teams",
      videoLink: newMtg.videoLink || "https://teams.microsoft.com/l/meetup-join/nrfa-meeting",
      participantIds: newMtg.participantIds || [currentUser.id, "usr-chair-1", "usr-ceo-1", "usr-sec-1"],
      chairId: newMtg.chairId || "usr-chair-1",
      secretaryId: newMtg.secretaryId || "usr-sec-1",
      status: newMtg.status || "scheduled",
      visibility: newMtg.visibility || "confidential",
      agenda: newMtg.agenda || [
        {
          id: "ag-" + Date.now(),
          order: "1.0",
          title: "Opening Remarks & Quorum Confirmation",
          presenter: "Board Chairperson",
          durationMinutes: 15,
          documentIds: [],
        },
      ],
    };
    const updated = [fullMeeting, ...meetings];
    setMeetings(updated);
    persist("meetings", updated);
    addToast("Meeting Created", `Scheduled: ${fullMeeting.title}`, "success");
    addAuditLog("Meeting Created", "Meetings", `Created meeting: ${fullMeeting.title} on ${fullMeeting.date}`);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    const updated = meetings.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMeetings(updated);
    persist("meetings", updated);
    addToast("Meeting Updated", "Meeting details successfully modified", "info");
    addAuditLog("Meeting Updated", "Meetings", `Updated meeting ID: ${id}`);
  };

  // Board pack operations
  const publishBoardPack = (packId: string) => {
    const updated = boardPacks.map((p) => {
      if (p.id === packId) {
        return {
          ...p,
          status: "published" as const,
          publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        };
      }
      return p;
    });
    setBoardPacks(updated);
    persist("packs", updated);
    addToast("Board Pack Published", "Digital pack compiled and dispatched to assigned directors.", "success");
    addAuditLog("Board Pack Published", "Board Packs", `Published pack ID: ${packId}`);
  };

  const markPackAsRead = (packId: string, userId?: string) => {
    const uId = userId || currentUser.id;
    if (isOffline) {
      addPendingSyncItem({
        type: "review_status",
        title: `Read Status: Pack ${packId}`,
        data: { packId, userId: uId },
      });
    }
    const updated = boardPacks.map((p) => {
      if (p.id === packId) {
        return {
          ...p,
          readStatus: { ...p.readStatus, [uId]: true },
        };
      }
      return p;
    });
    setBoardPacks(updated);
    persist("packs", updated);
    addToast("Pack Marked as Read", "Your review completion has been registered.", "success");
    addAuditLog("Document Read", "Board Packs", `Director marked pack ${packId} as reviewed`);
  };

  // Annotations
  const addAnnotation = (ann: Omit<Annotation, "id" | "createdAt" | "authorId" | "authorName">) => {
    const newAnn: Annotation = {
      ...ann,
      id: "ann-" + Date.now(),
      createdAt: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      authorId: currentUser.id,
      authorName: currentUser.name,
    };
    if (isOffline) {
      addPendingSyncItem({
        type: "annotation",
        title: `Offline Note on Document ${ann.documentId}`,
        data: newAnn,
      });
    }
    const updated = [newAnn, ...annotations];
    setAnnotations(updated);
    persist("annotations", updated);
    addToast(ann.isPrivate ? "Private Note Added" : "Shared Comment Added", "Annotation pinned to document.", "info");
    addAuditLog("Annotation Created", "Board Packs", `Added ${ann.type} on document ${ann.documentId}`);
  };

  const deleteAnnotation = (id: string) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    persist("annotations", updated);
    addToast("Annotation Removed", "Selected note has been deleted.", "info");
  };

  // Documents
  const addDocument = (doc: Partial<BoardDocument>) => {
    const newDoc: BoardDocument = {
      id: "doc-" + Date.now(),
      title: doc.title || "Untitled NRFA Document",
      category: doc.category || "Board Minutes",
      confidentiality: doc.confidentiality || "BOARD ONLY",
      fileSize: doc.fileSize || "2.4 MB",
      fileType: doc.fileType || "pdf",
      version: doc.version || "1.0",
      lastModified: new Date().toISOString().substring(0, 10),
      uploadedBy: currentUser.name,
      pageCount: doc.pageCount || 12,
      content: doc.content || "National Road Fund Agency Board Documentation Excerpt.",
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    addToast("Document Uploaded", `${newDoc.title} added to Document Library`, "success");
    addAuditLog("Document Uploaded", "Documents", `Uploaded ${newDoc.title}`);
  };

  // Circular Resolutions
  const createCircular = (cr: Partial<CircularResolution>) => {
    const id = "cr-" + Date.now();
    const newCr: CircularResolution = {
      id,
      refNumber: cr.refNumber || `NRFA/CR/2026/0${circularResolutions.length + 14}`,
      committeeId: cr.committeeId || "comm-1",
      title: cr.title || "Emergency Circular Resolution",
      description: cr.description || "Board circular resolution for written concurrence.",
      createdDate: new Date().toISOString().substring(0, 10),
      deadline: cr.deadline || "2026-11-10",
      targetDate: cr.targetDate || "2026-11-12",
      status: "published",
      supportingDocIds: cr.supportingDocIds || ["doc-01"],
      assignedMemberIds: cr.assignedMemberIds || [
        "usr-chair-1", "usr-mem-1", "usr-mem-2", "usr-mem-3", "usr-mem-4", "usr-mem-5", "usr-ceo-1"
      ],
      votes: {},
      approvalThresholdPct: cr.approvalThresholdPct || 75,
    };
    const updated = [newCr, ...circularResolutions];
    setCircularResolutions(updated);
    persist("circulars", updated);
    addToast("Circular Resolution Dispatched", `${newCr.refNumber} published for director voting.`, "success");
    addAuditLog("Circular Created", "Voting", `Created Circular: ${newCr.refNumber}`);
  };

  const castCircularVote = (crId: string, choice: "approve" | "reject" | "abstain", comments?: string) => {
    if (isOffline) {
      addPendingSyncItem({
        type: "vote",
        title: `Vote on Circular ${crId}`,
        data: { crId, choice, comments, userId: currentUser.id },
      });
    }
    const updated = circularResolutions.map((c) => {
      if (c.id === crId) {
        return {
          ...c,
          votes: {
            ...c.votes,
            [currentUser.id]: {
              choice,
              timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
              comments,
            },
          },
        };
      }
      return c;
    });
    setCircularResolutions(updated);
    persist("circulars", updated);
    addToast("Vote Recorded", `You voted '${choice.toUpperCase()}' on this resolution.`, "success");
    addAuditLog("Vote Cast", "Voting", `Voted ${choice} on circular ${crId}`);
  };

  // Live Resolutions
  const castLiveVote = (resId: string, choice: "approve" | "reject" | "abstain") => {
    const updated = liveResolutions.map((r) => {
      if (r.id === resId) {
        return {
          ...r,
          votes: {
            ...r.votes,
            [currentUser.id]: choice,
          },
        };
      }
      return r;
    });
    setLiveResolutions(updated);
    persist("live_res", updated);
    addToast("Live Vote Registered", `Cast '${choice.toUpperCase()}' for boardroom resolution.`, "success");
    addAuditLog("Live Vote Cast", "Voting", `Live vote recorded on ${resId}: ${choice}`);
  };

  const openLiveVote = (resId: string) => {
    const updated = liveResolutions.map((r) => (r.id === resId ? { ...r, status: "voting" as const } : r));
    setLiveResolutions(updated);
    persist("live_res", updated);
    addToast("Voting Floor Opened", "Directors may now cast electronic ballots.", "info");
    addAuditLog("Live Vote Opened", "Voting", `Opened voting on ${resId}`);
  };

  const createLiveResolution = (res: Partial<LiveResolution>) => {
    const id = "res-" + Date.now();
    const newRes: LiveResolution = {
      id,
      meetingId: res.meetingId || activeMeetingId || "mtg-01",
      refCode: `RES-84-0${liveResolutions.length + 1}`,
      title: res.title || "Resolution on Boardroom Motion",
      description: res.description || "Formal motion moved for board resolution.",
      status: "voting",
      votes: {},
      openedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [newRes, ...liveResolutions];
    setLiveResolutions(updated);
    persist("live_res", updated);
    addToast("Resolution Tabulated", `${newRes.refCode} is now active for live voting.`, "success");
  };

  // E-Signatures
  const signDocument = (sigId: string, signatureStyle: string, hash?: string) => {
    const generatedHash = hash || `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}nrfa2026`;
    const updated = signatureRequests.map((s) => {
      if (s.id === sigId) {
        return {
          ...s,
          status: "signed" as const,
          signedBy: currentUser.name,
          signedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          signatureStyle,
          digitalCertificateHash: generatedHash,
        };
      }
      return s;
    });
    setSignatureRequests(updated);
    persist("signatures", updated);
    addToast("Document Signed Successfully", `Digital certificate hash appended: ${generatedHash.substring(0, 16)}...`, "success");
    addAuditLog("E-Signature Completed", "E-Signatures", `Signed document request ${sigId} with cryptographic seal`);
  };

  // Action Items
  const createActionItem = (item: Partial<ActionItem>) => {
    const id = "act-" + Date.now();
    const newAct: ActionItem = {
      id,
      title: item.title || "New Action Item",
      description: item.description || "Direct action assigned from board resolution.",
      meetingId: item.meetingId || "mtg-01",
      meetingTitle: item.meetingTitle || "84th Ordinary Board of Directors Meeting",
      assignedMemberId: item.assignedMemberId || currentUser.id,
      dueDate: item.dueDate || "2026-11-30",
      priority: item.priority || "medium",
      status: "not_started",
    };
    const updated = [newAct, ...actionItems];
    setActionItems(updated);
    persist("actions", updated);
    addToast("Action Item Assigned", `Assigned to ${users.find((u) => u.id === newAct.assignedMemberId)?.name}`, "success");
    addAuditLog("Action Created", "Meetings", `Created action item: ${newAct.title}`);
  };

  const updateActionStatus = (actId: string, status: ActionItem["status"], notes?: string) => {
    const updated = actionItems.map((a) => {
      if (a.id === actId) {
        return {
          ...a,
          status,
          completionNotes: notes || a.completionNotes,
          completedAt: status === "completed" ? new Date().toISOString().replace("T", " ").substring(0, 16) : undefined,
        };
      }
      return a;
    });
    setActionItems(updated);
    persist("actions", updated);
    addToast("Action Status Updated", `Task marked as ${status.replace("_", " ").toUpperCase()}`, "info");
    addAuditLog("Action Updated", "Meetings", `Updated action item ${actId} to ${status}`);
  };

  // Minutes
  const createMinutes = (min: Partial<MeetingMinutes>) => {
    const id = "min-" + Date.now();
    const newMin: MeetingMinutes = {
      id,
      meetingId: min.meetingId || "mtg-01",
      title: min.title || "Official Minutes of Meeting",
      preparedBy: currentUser.name,
      date: new Date().toISOString().substring(0, 10),
      status: "draft",
      attendees: min.attendees || [],
      executiveSummary: min.executiveSummary || "Executive record of deliberations.",
      sections: min.sections || [],
    };
    const updated = [newMin, ...minutesList];
    setMinutesList(updated);
    addToast("Minutes Draft Saved", "Meeting minutes draft recorded.", "success");
    addAuditLog("Minutes Created", "Meetings", `Created minutes draft for ${newMin.meetingId}`);
  };

  const updateMinutes = (id: string, updates: Partial<MeetingMinutes>) => {
    const updated = minutesList.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMinutesList(updated);
    addToast("Minutes Updated", "Changes to meeting record saved.", "info");
  };

  const approveMinutes = (id: string) => {
    const updated = minutesList.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status: "approved" as const,
          approvedBy: currentUser.name,
          approvalDate: new Date().toISOString().substring(0, 10),
        };
      }
      return m;
    });
    setMinutesList(updated);
    addToast("Minutes Formally Approved", "Minutes adopted and locked into governance archive.", "success");
    addAuditLog("Minutes Approved", "Meetings", `Board Chairperson approved minutes: ${id}`);
  };

  // User Management
  const addUser = (newUser: Partial<User>) => {
    const id = "usr-" + Date.now();
    const fullUser: User = {
      id,
      name: newUser.name || "New Director",
      email: newUser.email || "director@test.com",
      role: newUser.role || "member",
      title: newUser.title || "Board Director",
      department: newUser.department || "NRFA Board",
      committeeIds: newUser.committeeIds || ["comm-1"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "active",
      lastLogin: "Never",
      phone: newUser.phone || "+260 977 000000",
    };
    const updated = [...users, fullUser];
    setUsers(updated);
    persist("users", updated);
    addToast("User Added", `${fullUser.name} added to agency roster.`, "success");
    addAuditLog("User Added", "Users", `Created user account: ${fullUser.name}`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    setUsers(updated);
    persist("users", updated);
    addToast("User Updated", "User profile updated.", "info");
  };

  const toggleUserStatus = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "active" ? ("inactive" as const) : ("active" as const);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    persist("users", updated);
    addToast("User Status Changed", "Roster permission updated.", "info");
    addAuditLog("User Status Changed", "Users", `Toggled status for user ${id}`);
  };

  // Device Remote Wipe
  const remoteWipeDevice = (devId: string) => {
    const updated = devices.map((d) => (d.id === devId ? { ...d, status: "wiped" as const, isOfflineCached: false } : d));
    setDevices(updated);
    persist("devices", updated);
    addToast("Remote Wipe Triggered", "Security payload transmitted. Offline vault erased.", "warning");
    addAuditLog("Remote Wipe Executed", "Security", `Triggered remote device wipe on device: ${devId}`, "critical");
  };

  // Notifications
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const markNotifAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("Notifications Cleared", "All marked as read", "info");
  };

  // Reset Demo Data
  const resetDemoData = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    setUsers(SEED_USERS);
    setCommittees(SEED_COMMITTEES);
    setMeetings(SEED_MEETINGS);
    setBoardPacks(SEED_BOARD_PACKS);
    setDocuments(SEED_DOCUMENTS);
    setAnnotations(SEED_ANNOTATIONS);
    setCircularResolutions(SEED_CIRCULAR_RESOLUTIONS);
    setLiveResolutions(SEED_LIVE_RESOLUTIONS);
    setSignatureRequests(SEED_SIGNATURE_REQUESTS);
    setActionItems(SEED_ACTION_ITEMS);
    setMinutesList(SEED_MINUTES);
    setDevices(SEED_DEVICES);
    setAuditLogs(SEED_AUDIT_LOGS);
    setNotifications(SEED_NOTIFICATIONS);
    setPendingSyncItems([]);
    setCurrentRole("member");
    setCurrentUser(SEED_USERS[2]);
    setIsDisclaimerAccepted(true);
    addToast("Demo Data Reset", "Restored pristine NRFA Zambia demonstration dataset.", "success");
    addAuditLog("Demo Data Reset", "Security", "Restored initial seed state for presentation");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        isDisclaimerAccepted,
        acceptDisclaimer,
        isDark,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        activeMeetingId,
        setActiveMeetingId,
        activePackId,
        setActivePackId,
        activeDocumentId,
        setActiveDocumentId,
        isSearchOpen,
        setIsSearchOpen,
        isOffline,
        setIsOffline,
        pendingSyncItems,
        addPendingSyncItem,
        syncNow,
        isSyncing,
        lastSyncTime,
        users,
        addUser,
        updateUser,
        toggleUserStatus,
        committees,
        meetings,
        createMeeting,
        updateMeeting,
        boardPacks,
        publishBoardPack,
        markPackAsRead,
        documents,
        addDocument,
        annotations,
        addAnnotation,
        deleteAnnotation,
        circularResolutions,
        createCircular,
        castCircularVote,
        liveResolutions,
        castLiveVote,
        openLiveVote,
        createLiveResolution,
        signatureRequests,
        signDocument,
        actionItems,
        createActionItem,
        updateActionStatus,
        minutesList,
        createMinutes,
        updateMinutes,
        approveMinutes,
        devices,
        remoteWipeDevice,
        auditLogs,
        addAuditLog,
        notifications,
        unreadNotifCount,
        markNotifAsRead,
        markAllNotifsAsRead,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
