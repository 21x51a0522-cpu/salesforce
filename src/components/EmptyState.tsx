import React from 'react';
import { Database, Plus, RefreshCw, FolderSearch } from 'lucide-react';
import { ObjectConfig } from '../types';

interface EmptyStateProps {
  config: ObjectConfig;
  searchTerm?: string;
  onClearSearch?: () => void;
  onCreateRecord?: () => void;
  onRefresh?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  config,
  searchTerm,
  onClearSearch,
  onCreateRecord,
  onRefresh,
}) => {
  const isSearching = Boolean(searchTerm && searchTerm.trim());

  return (
    <div
      id="empty-records-state"
      className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs my-4"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-inner">
        {isSearching ? <FolderSearch className="w-8 h-8" /> : <Database className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {isSearching ? 'No matching records found' : 'No records found'}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {isSearching
          ? `We couldn't find any ${config.pluralName.toLowerCase()} matching "${searchTerm}". Try adjusting your search query.`
          : `There are currently no ${config.pluralName.toLowerCase()} available from your Salesforce database via the Spring Boot API.`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isSearching ? (
          <button
            id="clear-search-btn"
            onClick={onClearSearch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Clear Search
          </button>
        ) : (
          <>
            {onCreateRecord && config.isBackendReady && (
              <button
                id="create-first-record-btn"
                onClick={onCreateRecord}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                + Create First {config.name}
              </button>
            )}

            {onRefresh && (
              <button
                id="empty-refresh-btn"
                onClick={onRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
