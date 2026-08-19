import React, { useState, useEffect } from 'react';
import { ObjectConfig } from '../types';
import { X, Loader2, Save, Plus } from 'lucide-react';

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ObjectConfig;
  initialData?: any | null; // If null -> Create mode, If provided -> Edit mode
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting?: boolean;
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  onClose,
  config,
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const isEditMode = Boolean(initialData && initialData.id);

  // Initialize form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        // Reset with blank fields
        const blank: Record<string, any> = {};
        config.fields.forEach((f) => {
          blank[f.key] = '';
        });
        setFormData(blank);
      }
      setErrors({});
    }
  }, [isOpen, initialData, config]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for that field
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      const val = formData[field.key];
      if (field.required && (!val || String(val).trim() === '')) {
        newErrors[field.key] = `${field.label} is required`;
      } else if (field.type === 'email' && val && String(val).trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val))) {
          newErrors[field.key] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Filter only defined config fields
    const payload: Record<string, any> = {};
    config.fields.forEach((f) => {
      payload[f.key] = formData[f.key] !== undefined ? formData[f.key] : '';
    });

    await onSubmit(payload);
  };

  return (
    <div
      id="record-form-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        id="record-form-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {config.name} Management
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {isEditMode ? `Edit ${config.name}` : `+ New ${config.name}`}
            </h3>
          </div>

          <button
            id="record-form-close-btn"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4">
            {config.fields.map((field) => {
              const value = formData[field.key] ?? '';
              const error = errors[field.key];

              return (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`form-field-${field.key}`}
                      className="text-xs font-semibold text-slate-700 flex items-center gap-1"
                    >
                      <span>{field.label}</span>
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.description && (
                      <span className="text-[11px] text-slate-400">{field.description}</span>
                    )}
                  </div>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={`form-field-${field.key}`}
                      rows={3}
                      value={value}
                      placeholder={field.placeholder}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 transition-all focus:ring-2 focus:outline-none ${
                        error
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      id={`form-field-${field.key}`}
                      value={value}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 transition-all focus:ring-2 focus:outline-none ${
                        error
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    >
                      <option value="">-- Select {field.label} --</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`form-field-${field.key}`}
                      type={field.type === 'currency' ? 'number' : field.type}
                      value={value}
                      placeholder={field.placeholder}
                      disabled={isSubmitting}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 transition-all focus:ring-2 focus:outline-none ${
                        error
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                  )}

                  {error && (
                    <p className="text-xs font-medium text-red-600 animate-fade-in">{error}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              id="record-form-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              id="record-form-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditMode ? `Updating ${config.name.toLowerCase()}...` : `Creating ${config.name.toLowerCase()}...`}</span>
                </>
              ) : (
                <>
                  {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isEditMode ? `Save Changes` : `Create ${config.name}`}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
