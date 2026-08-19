import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isConfirming = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        id="confirm-modal-content"
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 leading-snug">
                {title}
              </h3>
              <p id="confirm-modal-message" className="text-sm text-slate-600 mt-2 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            id="confirm-modal-cancel-btn"
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            id="confirm-modal-submit-btn"
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {isConfirming && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isConfirming ? 'Deleting...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
