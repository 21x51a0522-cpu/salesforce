import React from 'react';
import { ObjectConfig } from '../types';
import { X, Edit2, Trash2, Copy, Check, ExternalLink, Calendar, Hash } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any | null;
  config: ObjectConfig;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  record,
  config,
  onEdit,
  onDelete,
}) => {
  const { info } = useToast();
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!isOpen || !record) return null;

  const handleCopy = (key: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    info(`Copied ${key} to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getRecordTitle = () => {
    if (config.id === 'Contact') {
      const first = record.firstName || '';
      const last = record.lastName || '';
      const combined = `${first} ${last}`.trim();
      return combined || record.name || 'Contact Details';
    }
    return record[config.nameField] || `${config.name} Details`;
  };

  return (
    <div
      id="record-view-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="record-view-modal-content"
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {config.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {config.name} Record
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {getRecordTitle()}
              </h3>
            </div>
          </div>

          <button
            id="record-modal-close-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Record ID banner */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-mono">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Record ID:</span>
              <span className="font-semibold text-slate-900">{record.id || 'N/A'}</span>
            </div>
            {record.id && (
              <button
                onClick={() => handleCopy('ID', record.id)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
              >
                {copiedKey === 'ID' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ID' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Fields Grid */}
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {config.fields.map((field) => {
              const value = record[field.key];
              const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : '—';
              const isCopied = copiedKey === field.key;

              return (
                <div
                  key={field.key}
                  className="px-4 py-3 bg-white hover:bg-slate-50/70 transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-4">
                    <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                      {field.label}
                    </span>
                    <span className="text-sm font-medium text-slate-900 break-words">
                      {displayValue}
                    </span>
                  </div>

                  {value && (
                    <button
                      onClick={() => handleCopy(field.key, displayValue)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-all flex-shrink-0"
                      title={`Copy ${field.label}`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                id="view-modal-edit-btn"
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                Edit
              </button>
            )}

            {onDelete && (
              <button
                id="view-modal-delete-btn"
                onClick={() => {
                  onClose();
                  onDelete(record);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-xl shadow-2xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>

          <button
            id="view-modal-close-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
