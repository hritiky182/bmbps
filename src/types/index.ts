export type UserRole = "admin" | "secretary" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  salutation?: string;
  department: string;
  committeeIds: string[];
  avatar: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  phone: string;
  isChairperson?: boolean;
}

export interface Committee {
  id: string;
  name: string;
  code: string;
  description: string;
  chairId: string;
  secretaryId: string;
  memberIds: string[];
  meetingCadence: string;
  category: "governance" | "finance" | "technical" | "audit" | "executive";
}

export type MeetingStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "in_progress"
  | "completed"
  | "archived";

export type MeetingType = "ordinary" | "extraordinary" | "committee" | "emergency";
export type MeetingFormat = "physical" | "hybrid" | "virtual";

export interface AgendaItem {
  id: string;
  order: string;
  title: string;
  presenter: string;
  durationMinutes: number;
  documentIds: string[];
  status?: "pending" | "current" | "concluded";
  description?: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  committeeId: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  format: MeetingFormat;
  videoProvider?: "teams" | "zoom" | "internal";
  videoLink?: string;
  participantIds: string[];
  chairId: string;
  secretaryId: string;
  status: MeetingStatus;
  boardPackId?: string;
  agenda: AgendaItem[];
  recurring?: boolean;
  visibility: "confidential" | "restricted" | "internal";
}

export interface BoardDocument {
  id: string;
  title: string;
  category:
    | "Financial Reports"
    | "Strategic Documents"
    | "Board Minutes"
    | "Committee Reports"
    | "Policies"
    | "Governance"
    | "Legal & Compliance"
    | "Circular Resolutions";
  confidentiality: "STRICTLY CONFIDENTIAL" | "BOARD ONLY" | "RESTRICTED" | "INTERNAL";
  fileSize: string;
  fileType: "pdf" | "docx" | "xlsx" | "pptx";
  version: string;
  lastModified: string;
  uploadedBy: string;
  pageCount: number;
  content: string; // Rich simulated excerpt or sections
  downloadUrl?: string;
}

export interface Annotation {
  id: string;
  documentId: string;
  pageNumber: number;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  type: "sticky_note" | "highlight" | "comment";
  isPrivate: boolean;
  color?: string;
}

export interface BoardPack {
  id: string;
  meetingId: string;
  title: string;
  status: "draft" | "published" | "distributed" | "archived";
  version: string;
  publishedAt?: string;
  documentIds: string[];
  readStatus: Record<string, boolean>; // userId -> hasRead
  offlineAvailable: boolean;
  totalPages: number;
}

export interface CircularResolution {
  id: string;
  refNumber: string;
  committeeId: string;
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  targetDate: string;
  status: "draft" | "published" | "awaiting_votes" | "approved" | "rejected" | "closed";
  supportingDocIds: string[];
  assignedMemberIds: string[];
  votes: Record<
    string,
    {
      choice: "approve" | "reject" | "abstain";
      timestamp: string;
      comments?: string;
    }
  >;
  approvalThresholdPct: number;
}

export interface LiveResolution {
  id: string;
  meetingId: string;
  refCode: string;
  title: string;
  description: string;
  status: "open" | "voting" | "passed" | "rejected" | "deferred";
  votes: Record<string, "approve" | "reject" | "abstain">;
  openedAt?: string;
}

export interface SignatureRequest {
  id: string;
  documentTitle: string;
  documentId: string;
  documentCategory: string;
  requestedDate: string;
  deadline: string;
  status: "pending" | "signed" | "declined" | "expired";
  requestedBy: string;
  signedBy?: string;
  signedAt?: string;
  signatureStyle?: string;
  digitalCertificateHash?: string;
  securityMethod: "Simulated 2FA Token" | "Board Biometric PIN";
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  meetingId: string;
  meetingTitle?: string;
  assignedMemberId: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "not_started" | "in_progress" | "completed" | "overdue";
  completionNotes?: string;
  completedAt?: string;
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  title: string;
  preparedBy: string;
  date: string;
  status: "draft" | "pending_approval" | "approved" | "archived";
  attendees: {
    userId: string;
    name: string;
    role: string;
    status: "present" | "apology" | "absent";
  }[];
  executiveSummary: string;
  sections: {
    agendaId: string;
    agendaTitle: string;
    discussion: string;
    resolutionsMade: string[];
    actionItemsCreated: string[];
  }[];
  approvedBy?: string;
  approvalDate?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module:
    | "Auth"
    | "Meetings"
    | "Board Packs"
    | "Documents"
    | "Voting"
    | "E-Signatures"
    | "Users"
    | "Security"
    | "Sync";
  details: string;
  ipAddress: string;
  severity: "info" | "warning" | "critical";
}

export interface RegisteredDevice {
  id: string;
  deviceName: string;
  assignedUserId: string;
  assignedUserName: string;
  os: "iPadOS 17" | "macOS Sonoma" | "Windows 11 Enterprise" | "iOS 17" | "Android 14";
  browser: "Safari" | "Chrome Enterprise" | "Edge Secure";
  lastSync: string;
  lastActive: string;
  status: "active" | "offline" | "wiped";
  isOfflineCached: boolean;
  ipAddress: string;
}

export interface OfflineSyncItem {
  id: string;
  type: "annotation" | "vote" | "review_status" | "action_update";
  title: string;
  timestamp: string;
  synced: boolean;
  data: any;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "meeting" | "pack" | "vote" | "signature" | "action" | "system";
  timestamp: string;
  read: boolean;
  linkTab: string;
  targetId?: string;
}
