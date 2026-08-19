import React, { useState, useEffect, useCallback } from 'react';
import { SalesforceObjectName, AuthStatus } from './types';
import { authApi } from './api/authApi';
import { ToastProvider } from './context/ToastContext';
import { ActivityProvider, useActivity } from './context/ActivityContext';
import { ToastContainer } from './components/Toast';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { logActivity } = useActivity();

  // Navigation & SObject state
  const [currentTab, setCurrentTab] = useState<NavTab>('objects');
  const [selectedObject, setSelectedObject] = useState<SalesforceObjectName>('Contact');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  // Authentication & Connection status
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
  const [authMessage, setAuthMessage] = useState<string>('Checking Salesforce connection...');
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(false);

  // Probe auth / backend status
  const checkAuth = useCallback(async (isSilent = false) => {
    setIsCheckingAuth(true);
    if (!isSilent) {
      setAuthStatus('checking');
    }

    try {
      const result = await authApi.checkSessionStatus();
      setAuthStatus(result.status);
      setAuthMessage(result.message);

      if (result.status === 'connected') {
        logActivity('AUTH', 'Contact', 'SUCCESS', 'Verified active Salesforce session on Spring Boot backend');
      } else if (result.status === 'expired') {
        logActivity('AUTH', 'Contact', 'ERROR', 'Salesforce session expired on backend');
      }
    } catch (err: any) {
      setAuthStatus('error');
      setAuthMessage(err.message || 'Connection error');
      logActivity('AUTH', 'Contact', 'ERROR', err.message || 'Backend connection failed');
    } finally {
      setIsCheckingAuth(false);
    }
  }, [logActivity]);

  // Initial check once on mount
  useEffect(() => {
    checkAuth(true);
  }, [checkAuth]);

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Header
        authStatus={authStatus}
        authMessage={authMessage}
        isCheckingAuth={isCheckingAuth}
        onRefreshAuth={() => checkAuth(false)}
        onToggleSidebar={() => setIsSidebarMobileOpen((prev) => !prev)}
        onOpenSettings={() => setCurrentTab('settings')}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          selectedObject={selectedObject}
          onSelectObject={(obj) => {
            setSelectedObject(obj);
            setCurrentTab('objects');
          }}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
        />

        {/* Content Area */}
        <main id="main-content-area" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {(currentTab === 'dashboard' || currentTab === 'objects') && (
            <Dashboard
              selectedObject={selectedObject}
              onSelectObject={setSelectedObject}
              authStatus={authStatus}
              authMessage={authMessage}
              isCheckingAuth={isCheckingAuth}
              onRefreshAuth={() => checkAuth(false)}
              onOpenSettings={() => setCurrentTab('settings')}
            />
          )}

          {currentTab === 'activity' && <ActivityPage />}

          {currentTab === 'settings' && (
            <SettingsPage onRefreshAuth={() => checkAuth(false)} />
          )}
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ActivityProvider>
        <AppContent />
      </ActivityProvider>
    </ToastProvider>
  );
}
