import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-900';
        let iconClass = 'text-emerald-600';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-200 bg-red-50 text-red-900';
          iconClass = 'text-red-600';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-200 bg-amber-50 text-amber-900';
          iconClass = 'text-amber-600';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-200 bg-blue-50 text-blue-900';
          iconClass = 'text-blue-600';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              {toast.title && <p className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-90">{toast.title}</p>}
              <p className="text-sm font-medium leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-black/5"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
