import React, { useState } from 'react';
import { 
  getApiBaseUrl, 
  setCustomApiBaseUrl, 
  DEFAULT_LOCAL_BACKEND, 
  DEFAULT_REMOTE_BACKEND 
} from '../api/apiClient';
import { authApi } from '../api/authApi';
import { contactApi } from '../api/contactApi';
import { useToast } from '../context/ToastContext';
import { 
  Settings, 
  Server, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Code,
  Lock,
  Globe
} from 'lucide-react';

interface SettingsPageProps {
  onRefreshAuth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onRefreshAuth }) => {
  const { success, error, info } = useToast();
  const currentBaseUrl = getApiBaseUrl();
  const [apiUrlInput, setApiUrlInput] = useState(currentBaseUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'error'; message: string; data?: any } | null>(null);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrlInput.trim()) {
      setCustomApiBaseUrl(null);
      setApiUrlInput(getApiBaseUrl());
      info('Reset to default backend URL');
    } else {
      setCustomApiBaseUrl(apiUrlInput.trim());
      success(`Updated backend API URL to: ${apiUrlInput.trim()}`);
    }
    onRefreshAuth();
  };

  const handleSetPreset = (url: string, label: string) => {
    setCustomApiBaseUrl(url);
    setApiUrlInput(url);
    success(`Switched backend target to ${label}: ${url}`);
    onRefreshAuth();
  };

  const handleResetDefault = () => {
    setCustomApiBaseUrl(null);
    setApiUrlInput(getApiBaseUrl());
    success('Reset to default backend URL');
    onRefreshAuth();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const authStatus = await authApi.checkSessionStatus();
      if (authStatus.status === 'connected') {
        const contacts = await contactApi.getAll();
        setTestResult({
          status: 'success',
          message: `Successfully connected to Spring Boot at ${getApiBaseUrl()} and verified Salesforce session! Loaded ${contacts.length} contacts.`,
          data: { totalContacts: contacts.length, session: 'Active' },
        });
        success('Spring Boot connection verified successfully!');
      } else {
        setTestResult({
          status: 'error',
          message: `Backend reachable at ${getApiBaseUrl()} — Salesforce session returned: ${authStatus.message}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err.message || `Unable to reach Spring Boot server at ${getApiBaseUrl()}`,
      });
      error('Backend connectivity test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div id="settings-page-container" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Backend & API Configuration</h2>
        </div>
        <p className="text-xs text-slate-500">
          Manage your Spring Boot REST proxy connection, inspect endpoint routing, and verify Salesforce OAuth status.
        </p>
      </div>

      {/* Backend URL Configuration Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Spring Boot Service Endpoint</h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            VITE_API_BASE_URL
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium mr-1">Quick Switch:</span>
          <button
            type="button"
            onClick={() => handleSetPreset(DEFAULT_REMOTE_BACKEND, 'Render Production')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 ${
              apiUrlInput === DEFAULT_REMOTE_BACKEND 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            Render (Production)
          </button>
          <button
            type="button"
            onClick={() => handleSetPreset(DEFAULT_LOCAL_BACKEND, 'Localhost')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-1.5 ${
              apiUrlInput === DEFAULT_LOCAL_BACKEND 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            Localhost:8080
          </button>
        </div>

        <form onSubmit={handleSaveUrl} className="space-y-3">
          <div>
            <label htmlFor="settings-api-url" className="text-xs font-semibold text-slate-700 block mb-1">
              Backend REST Base URL
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                id="settings-api-url"
                type="text"
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                placeholder="http://localhost:8080"
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-mono text-slate-900 focus:outline-none"
              />
              <button
                id="settings-save-url-btn"
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save URL</span>
              </button>
              <button
                id="settings-reset-url-btn"
                type="button"
                onClick={handleResetDefault}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Reset to default environment URL"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              id="settings-test-connection-btn"
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isTesting ? 'Testing REST Endpoints...' : 'Run Connectivity Diagnostic'}</span>
            </button>
          </div>
        </form>

        {testResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start gap-2.5 border ${
              testResult.status === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            {testResult.status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{testResult.status === 'success' ? 'Connection Succeeded' : 'Diagnostic Notice'}</p>
              <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Security & Architecture Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architecture Flow Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Zero-Credential Frontend Security</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            In compliance with enterprise security requirements, this React frontend contains <strong>no Salesforce Client IDs, Secrets, Access Tokens, or Refresh Tokens</strong>. All Salesforce communication is strictly proxied through Spring Boot REST endpoints with <code className="font-mono text-slate-700">credentials: "include"</code>.
          </p>

          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
            <div className="text-blue-400">React Frontend (UI)</div>
            <div className="text-slate-500 pl-3">│  HTTP REST requests (credentials: "include")</div>
            <div className="text-emerald-400">▼ Spring Boot Backend</div>
            <div className="text-slate-500 pl-3">│  Salesforce OAuth 2.0 PKCE & REST API</div>
            <div className="text-indigo-400">▼ Salesforce Cloud (Instance URL)</div>
          </div>
        </div>

        {/* Spring Boot Endpoints Reference Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Configured REST Endpoints</h3>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            <div className="p-2.5 bg-slate-50 flex items-center justify-between font-mono">
              <span className="text-emerald-700 font-bold">GET</span>
              <span className="text-slate-700">/api/auth/status</span>
              <span className="text-[10px] text-slate-500 font-medium">OAuth</span>
            </div>
            <div className="p-2.5 flex items-center justify-between font-mono">
              <span className="text-blue-700 font-bold">CRUD</span>
              <span className="text-slate-700">/api/accounts</span>
              <span className="text-[10px] text-emerald-600 font-bold">Live (20/pg)</span>
            </div>
            <div className="p-2.5 flex items-center justify-between font-mono">
              <span className="text-blue-700 font-bold">CRUD</span>
              <span className="text-slate-700">/api/opportunities</span>
              <span className="text-[10px] text-emerald-600 font-bold">Live (20/pg)</span>
            </div>
            <div className="p-2.5 flex items-center justify-between font-mono">
              <span className="text-blue-700 font-bold">CRUD</span>
              <span className="text-slate-700">/api/leads</span>
              <span className="text-[10px] text-emerald-600 font-bold">Live (20/pg)</span>
            </div>
            <div className="p-2.5 flex items-center justify-between font-mono">
              <span className="text-blue-700 font-bold">CRUD</span>
              <span className="text-slate-700">/api/contacts</span>
              <span className="text-[10px] text-emerald-600 font-bold">Live (20/pg)</span>
            </div>
            <div className="p-2.5 flex items-center justify-between font-mono">
              <span className="text-blue-700 font-bold">CRUD</span>
              <span className="text-slate-700">/api/cases</span>
              <span className="text-[10px] text-emerald-600 font-bold">Live (20/pg)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
