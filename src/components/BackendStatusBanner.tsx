import React from 'react';
import { AuthStatus } from '../types';
import { getApiBaseUrl } from '../api/apiClient';
import { authApi } from '../api/authApi';
import { 
  AlertTriangle, 
  LogIn, 
  RefreshCw, 
  Server, 
  ExternalLink,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface BackendStatusBannerProps {
  authStatus: AuthStatus;
  authMessage: string;
  isChecking: boolean;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({
  authStatus,
  authMessage,
  isChecking,
  onRefresh,
  onOpenSettings,
}) => {
  const apiBaseUrl = getApiBaseUrl();

  if (authStatus === 'connected') {
    return null; // Don't take up banner space if everything is 100% green
  }

  const isExpired = authStatus === 'expired';
  const isOffline = authStatus === 'error';

  return (
    <div
      id="backend-status-alert"
      className={`p-4 rounded-2xl border mb-6 transition-all ${
        isExpired
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isExpired ? 'bg-amber-100 text-amber-700' : 'bg-blue-600 text-white'
            }`}
          >
            {isExpired ? <AlertTriangle className="w-5 h-5" /> : <Server className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold">
                {isExpired
                  ? 'Salesforce Session Expired'
                  : isOffline
                  ? 'Spring Boot Backend Connection Notice'
                  : 'Checking Backend Status'}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-black/10">
                Target: {apiBaseUrl}
              </span>
            </div>

            <p className={`text-xs mt-1 leading-relaxed ${isExpired ? 'text-amber-800' : 'text-slate-300'}`}>
              {isExpired
                ? 'Your Salesforce OAuth session on Spring Boot has expired. Please authenticate to continue making live CRUD requests.'
                : `Attempted connection to ${apiBaseUrl}. Ensure your Spring Boot backend is running locally on port 8080 with CORS enabled.`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={onOpenSettings}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isExpired
                ? 'bg-white hover:bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            Configure API URL
          </button>

          <button
            onClick={onRefresh}
            disabled={isChecking}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50 ${
              isExpired
                ? 'bg-white hover:bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>

          <button
            onClick={() => authApi.redirectToLogin()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login to Salesforce</span>
          </button>
        </div>
      </div>
    </div>
  );
};
