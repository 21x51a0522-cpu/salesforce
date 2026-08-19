import React from 'react';
import { useActivity } from '../context/ActivityContext';
import { 
  Activity, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowUpRight, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { activities, clearActivities } = useActivity();

  return (
    <div id="activity-page-container" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Activity & Audit Log</h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time audit trail of Salesforce CRUD requests, OAuth handshakes, and Spring Boot API transactions.
          </p>
        </div>

        {activities.length > 0 && (
          <button
            id="clear-activity-log-btn"
            onClick={clearActivities}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        )}
      </div>

      {/* Activity Timeline */}
      {activities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Activity Logged Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            CRUD operations such as creating, updating, or deleting contacts will be logged here with timestamps and status responses.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
            <span>Recent Events ({activities.length})</span>
            <span className="text-[11px] text-slate-400 font-mono">Session Log</span>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.map((act) => {
              const date = new Date(act.timestamp);
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const formattedDate = date.toLocaleDateString();

              let actionBadge = 'bg-slate-100 text-slate-700';
              if (act.action === 'CREATE') actionBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (act.action === 'UPDATE') actionBadge = 'bg-blue-50 text-blue-700 border-blue-200';
              if (act.action === 'DELETE') actionBadge = 'bg-red-50 text-red-700 border-red-200';
              if (act.action === 'AUTH') actionBadge = 'bg-purple-50 text-purple-700 border-purple-200';

              return (
                <div key={act.id} className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {act.status === 'SUCCESS' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : act.status === 'ERROR' ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${actionBadge}`}>
                        {act.action}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {act.objectType}
                      </span>
                      {act.recordId && (
                        <span className="text-[11px] font-mono text-slate-400">
                          ID: {act.recordId}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {act.message}
                    </p>

                    {act.payload && (
                      <details className="mt-2 text-[11px]">
                        <summary className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                          Inspect Payload
                        </summary>
                        <pre className="mt-1.5 p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono overflow-x-auto text-[10px]">
                          {JSON.stringify(act.payload, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>

                  <div className="text-right text-[11px] text-slate-400 font-mono flex-shrink-0">
                    <div>{formattedTime}</div>
                    <div className="text-[10px] text-slate-300">{formattedDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
