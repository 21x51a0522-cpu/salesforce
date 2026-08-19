import React from 'react';
import { AuthStatus } from '../types';
import { authApi } from '../api/authApi';
import { getApiBaseUrl } from '../api/apiClient';
import { 
  Cloud, 
  LogIn, 
  LogOut, 
  RefreshCw, 
  Server, 
  Menu,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  authStatus: AuthStatus;
  authMessage: string;
  isCheckingAuth: boolean;
  onRefreshAuth: () => void;
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  authStatus,
  authMessage,
  isCheckingAuth,
  onRefreshAuth,
  onToggleSidebar,
  onOpenSettings,
}) => {
  const apiBaseUrl = getApiBaseUrl();

  const handleLogin = () => {
    authApi.redirectToLogin();
  };

  const handleLogout = async () => {
    await authApi.logout();
    onRefreshAuth();
  };

  return (
    <header id="app-header" className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo and Title */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                id="sidebar-toggle-btn"
                onClick={onToggleSidebar}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                    CloudVandana CRM
                  </h1>
                  <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Salesforce Hub
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
                  Spring Boot REST Proxy Architecture
                </p>
              </div>
            </div>
          </div>

          {/* Center/Right: Connection Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Salesforce Connection Status Badge */}
            <div
              id="salesforce-status-badge"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
              style={{
                backgroundColor:
                  authStatus === 'connected'
                    ? '#f0fdf4'
                    : authStatus === 'expired'
                    ? '#fffbeb'
                    : authStatus === 'error'
                    ? '#fef2f2'
                    : '#f8fafc',
                borderColor:
                  authStatus === 'connected'
                    ? '#bbf7d0'
                    : authStatus === 'expired'
                    ? '#fde68a'
                    : authStatus === 'error'
                    ? '#fecaca'
                    : '#e2e8f0',
                color:
                  authStatus === 'connected'
                    ? '#166534'
                    : authStatus === 'expired'
                    ? '#92400e'
                    : authStatus === 'error'
                    ? '#991b1b'
                    : '#475569',
              }}
              title={`Status: ${authMessage} | Backend: ${apiBaseUrl}`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {authStatus === 'connected' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    authStatus === 'connected'
                      ? 'bg-emerald-500'
                      : authStatus === 'expired'
                      ? 'bg-amber-500'
                      : authStatus === 'error'
                      ? 'bg-red-500'
                      : 'bg-slate-400'
                  }`}
                />
              </span>

              <span className="font-semibold hidden md:inline">
                {authStatus === 'connected'
                  ? 'Salesforce Connected'
                  : authStatus === 'expired'
                  ? 'Session Expired'
                  : authStatus === 'error'
                  ? 'Connection Issue'
                  : 'Checking...'}
              </span>

              <button
                id="refresh-auth-status-btn"
                onClick={onRefreshAuth}
                disabled={isCheckingAuth}
                className="p-0.5 hover:text-slate-900 rounded transition-transform active:rotate-180 disabled:opacity-50"
                title="Refresh connection status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingAuth ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Backend URL Indicator (Desktop) */}
            <div 
              id="backend-host-badge"
              onClick={onOpenSettings}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-mono border border-slate-200/60 cursor-pointer transition-colors"
              title="Click to view or edit backend API settings"
            >
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[130px]">{apiBaseUrl.replace('http://', '').replace('https://', '')}</span>
            </div>

            {/* Login / Logout Button */}
            {authStatus === 'connected' ? (
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            ) : (
              <button
                id="salesforce-login-btn"
                onClick={handleLogin}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors"
                title={`Initiate Salesforce OAuth login flow via ${apiBaseUrl}/api/auth/login`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Salesforce Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
