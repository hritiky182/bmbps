"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DisclaimerModal } from "@/components/layout/DisclaimerModal";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { LoginPage } from "@/components/auth/LoginPage";

// Views
import { DashboardView } from "@/components/views/DashboardView";
import { MeetingsView } from "@/components/views/MeetingsView";
import { CalendarView } from "@/components/views/CalendarView";
import { BoardPacksView } from "@/components/views/BoardPacksView";
import { CircularResolutionsView } from "@/components/views/CircularResolutionsView";
import { LiveMeetingRoomView } from "@/components/views/LiveMeetingRoomView";
import { DocumentLibraryView } from "@/components/views/DocumentLibraryView";
import { VotingDecisionsView } from "@/components/views/VotingDecisionsView";
import { SignaturesView } from "@/components/views/SignaturesView";
import { ActionItemsView } from "@/components/views/ActionItemsView";
import { ConversationsView } from "@/components/views/ConversationsView";
import { MinutesView } from "@/components/views/MinutesView";
import { ReportsView } from "@/components/views/ReportsView";
import { ArchivesView } from "@/components/views/ArchivesView";
import { UsersView } from "@/components/views/UsersView";
import { CommitteesView } from "@/components/views/CommitteesView";
import { DevicesSyncView } from "@/components/views/DevicesSyncView";
import { SecurityView } from "@/components/views/SecurityView";
import { AuditLogsView } from "@/components/views/AuditLogsView";
import { SettingsView } from "@/components/views/SettingsView";

function MainContent() {
  const { activeTab } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "meetings":
        return <MeetingsView />;
      case "calendar":
        return <CalendarView />;
      case "board-packs":
        return <BoardPacksView />;
      case "circulars":
        return <CircularResolutionsView />;
      case "meeting-room":
        return <LiveMeetingRoomView />;
      case "documents":
        return <DocumentLibraryView />;
      case "voting":
        return <VotingDecisionsView />;
      case "signatures":
        return <SignaturesView />;
      case "actions":
        return <ActionItemsView />;
      case "conversations":
        return <ConversationsView />;
      case "minutes":
        return <MinutesView />;
      case "reports":
        return <ReportsView />;
      case "archives":
        return <ArchivesView />;
      case "users":
        return <UsersView />;
      case "committees":
        return <CommitteesView />;
      case "devices-sync":
        return <DevicesSyncView />;
      case "security":
        return <SecurityView />;
      case "audit-logs":
        return <AuditLogsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <Sidebar onNavigateMobile={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <DisclaimerModal />
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
}

export default function AppEntry() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  return (
    <AppProvider>
      {isAuthenticated ? (
        <MainContent />
      ) : (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </AppProvider>
  );
}
