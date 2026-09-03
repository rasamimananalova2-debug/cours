import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FloatingEduBot } from './components/FloatingEduBot';
import { CacheInspectorModal } from './components/CacheInspectorModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { UpgradeModal } from './components/UpgradeModal';

// Views
import { DashboardView } from './views/DashboardView';
import { CoursePlayerView } from './views/CoursePlayerView';
import { CatalogView } from './views/CatalogView';
import { MessagesView } from './views/MessagesView';
import { MyCoursesView } from './views/MyCoursesView';
import { AssignmentsView } from './views/AssignmentsView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();
  const { isAuthenticated } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // If in CoursePlayerView, render full screen player with its own integrated header/footer
  if (currentView === 'player') {
    return (
      <div className="min-h-screen bg-background text-on-background font-body-md transition-colors duration-200">
        <CoursePlayerView />
        <CacheInspectorModal />
        <ThemeCustomizerModal />
        <UpgradeModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex transition-colors duration-200">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-2xs animate-in fade-in"
        />
      )}

      {/* Main Persistent Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'courses' && <MyCoursesView />}
          {currentView === 'catalog' && <CatalogView />}
          {currentView === 'messages' && <MessagesView />}
          {currentView === 'assignments' && <AssignmentsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Persistent Floating AI Bot */}
      <FloatingEduBot />

      {/* Global Modals */}
      <CacheInspectorModal />
      <ThemeCustomizerModal />
      <UpgradeModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <MainLayout />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

