import React, { useState, useEffect, useCallback } from 'react';
import { SalesforceObjectName, ObjectConfig } from '../types';
import { OBJECT_CONFIGS } from '../config/objectConfig';
import { objectApi } from '../api/objectApi';
import { getApiBaseUrl } from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import { useActivity } from '../context/ActivityContext';
import { ObjectSelector } from '../components/ObjectSelector';
import { DataTable } from '../components/DataTable';
import { RecordModal } from '../components/RecordModal';
import { RecordFormModal } from '../components/RecordFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ComingSoonObject } from '../components/ComingSoonObject';
import { BackendStatusBanner } from '../components/BackendStatusBanner';
import { AuthStatus } from '../types';
import { 
  Database, 
  Layers, 
  ShieldCheck,
  Server
} from 'lucide-react';

interface DashboardProps {
  selectedObject: SalesforceObjectName;
  onSelectObject: (obj: SalesforceObjectName) => void;
  authStatus: AuthStatus;
  authMessage: string;
  isCheckingAuth: boolean;
  onRefreshAuth: () => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  selectedObject,
  onSelectObject,
  authStatus,
  authMessage,
  isCheckingAuth,
  onRefreshAuth,
  onOpenSettings,
}) => {
  const { success, error } = useToast();
  const { logActivity } = useActivity();

  const currentConfig: ObjectConfig = OBJECT_CONFIGS[selectedObject];

  // Records state
  const [records, setRecords] = useState<any[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  // Modals state
  const [viewRecord, setViewRecord] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [deleteTargetRecord, setDeleteTargetRecord] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load records for active object
  const fetchRecords = useCallback(async () => {
    const config = OBJECT_CONFIGS[selectedObject];
    if (!config || !config.isBackendReady) {
      setRecords([]);
      setRecordsError(null);
      return;
    }

    setIsLoadingRecords(true);
    setRecordsError(null);

    try {
      const data = await objectApi.getRecords(selectedObject);
      setRecords(data);
      logActivity(
        'FETCH',
        selectedObject,
        'SUCCESS',
        `Retrieved ${data.length} ${config.pluralName.toLowerCase()} from Spring Boot REST API`
      );
    } catch (err: any) {
      const errMsg = err.message || `Backend unavailable at ${getApiBaseUrl()}`;
      setRecordsError(errMsg);
      setRecords([]);
      logActivity(
        'FETCH',
        selectedObject,
        'ERROR',
        `Notice loading ${config.pluralName}: ${errMsg}`
      );
    } finally {
      setIsLoadingRecords(false);
    }
  }, [selectedObject, logActivity]);

  // Fetch only when selectedObject changes
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // --- CRUD Handlers ---

  // 1. Open Create Modal
  const handleOpenCreate = () => {
    setEditRecord(null);
    setIsFormOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (record: any) => {
    setEditRecord(record);
    setIsFormOpen(true);
  };

  // 3. Submit Create / Edit
  const handleFormSubmit = async (formData: any) => {
    setIsSubmittingForm(true);
    const isEdit = Boolean(editRecord && editRecord.id);

    try {
      if (isEdit) {
        // PUT /api/contacts/{id}
        await objectApi.updateRecord(selectedObject, editRecord.id, formData);
        success(`${currentConfig.name} updated successfully`);
        logActivity(
          'UPDATE',
          selectedObject,
          'SUCCESS',
          `Updated ${currentConfig.name} record (ID: ${editRecord.id})`,
          editRecord.id,
          formData
        );
      } else {
        // POST /api/contacts
        const created = await objectApi.createRecord(selectedObject, formData);
        success(`${currentConfig.name} created successfully`);
        logActivity(
          'CREATE',
          selectedObject,
          'SUCCESS',
          `Created new ${currentConfig.name} record`,
          created?.id,
          formData
        );
      }

      setIsFormOpen(false);
      setEditRecord(null);
      await fetchRecords(); // Refresh table
    } catch (err: any) {
      console.error('Form submission failed:', err);
      const msg = err.message || `Failed to ${isEdit ? 'update' : 'create'} ${currentConfig.name.toLowerCase()}`;
      error(msg);
      logActivity(
        isEdit ? 'UPDATE' : 'CREATE',
        selectedObject,
        'ERROR',
        msg,
        editRecord?.id,
        formData
      );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // 4. Open Delete Confirmation Dialog
  const handleOpenDelete = (record: any) => {
    setDeleteTargetRecord(record);
  };

  // 5. Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTargetRecord) return;
    const recordId = deleteTargetRecord.id;

    if (!recordId) {
      error(`Cannot delete record: Record ID is missing.`);
      setDeleteTargetRecord(null);
      return;
    }

    setIsDeleting(true);
    try {
      // DELETE /api/contacts/{id}
      await objectApi.deleteRecord(selectedObject, recordId);
      success(`${currentConfig.name} deleted successfully`);
      logActivity(
        'DELETE',
        selectedObject,
        'SUCCESS',
        `Deleted ${currentConfig.name} record (ID: ${recordId})`,
        recordId
      );

      setDeleteTargetRecord(null);
      await fetchRecords(); // Refresh table
    } catch (err: any) {
      console.error('Deletion failed:', err);
      const msg = err.message || `Failed to delete ${currentConfig.name.toLowerCase()}`;
      error(msg);
      logActivity(
        'DELETE',
        selectedObject,
        'ERROR',
        msg,
        recordId
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Backend Status Banner (if offline or expired) */}
      <BackendStatusBanner
        authStatus={authStatus}
        authMessage={authMessage}
        isChecking={isCheckingAuth}
        onRefresh={onRefreshAuth}
        onOpenSettings={onOpenSettings}
      />

      {/* Main Metric Stats Header Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Salesforce Connection */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            authStatus === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Salesforce OAuth</p>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {authStatus === 'connected' ? 'Connected' : 'Session Expired'}
            </p>
          </div>
        </div>

        {/* Metric 2: Active Object */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Object</p>
            <p className="text-sm font-bold text-slate-900 leading-snug">{currentConfig.name}</p>
          </div>
        </div>

        {/* Metric 3: Total Records */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Records</p>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {currentConfig.isBackendReady ? `${records.length} Records` : 'Pending Endpoint'}
            </p>
          </div>
        </div>

        {/* Metric 4: Spring Boot Proxy */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">REST Proxy</p>
            <p className="text-sm font-bold text-slate-900 leading-snug truncate max-w-[130px]" title={currentConfig.endpoint}>
              {currentConfig.endpoint}
            </p>
          </div>
        </div>
      </div>

      {/* Main Salesforce Data Manager Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {/* Top bar: Title & Object Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Salesforce Data Manager
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                CRUD Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select an SObject to dynamically inspect records, view schema definitions, and execute CRUD operations through your Spring Boot backend.
            </p>
          </div>

          <ObjectSelector
            selectedObject={selectedObject}
            onSelectObject={onSelectObject}
            disabled={isLoadingRecords}
          />
        </div>

        {/* Dynamic Object Rendering */}
        {currentConfig.isBackendReady ? (
          <DataTable
            config={currentConfig}
            records={records}
            isLoading={isLoadingRecords}
            error={recordsError}
            onRefresh={fetchRecords}
            onViewRecord={(rec) => setViewRecord(rec)}
            onEditRecord={handleOpenEdit}
            onDeleteRecord={handleOpenDelete}
            onCreateRecord={handleOpenCreate}
          />
        ) : (
          <ComingSoonObject
            config={currentConfig}
            onSelectContact={() => onSelectObject('Contact')}
          />
        )}
      </div>

      {/* Modals & Dialogs */}

      {/* 1. View Record Modal */}
      <RecordModal
        isOpen={Boolean(viewRecord)}
        onClose={() => setViewRecord(null)}
        record={viewRecord}
        config={currentConfig}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* 2. Create / Edit Record Modal */}
      <RecordFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditRecord(null);
        }}
        config={currentConfig}
        initialData={editRecord}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmittingForm}
      />

      {/* 3. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetRecord)}
        title={`Delete ${currentConfig.name}?`}
        message={`Are you sure you want to permanently delete this ${currentConfig.name.toLowerCase()} record from Salesforce? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetRecord(null)}
      />
    </div>
  );
};
