import React, { useState, useMemo } from 'react';
import { ObjectConfig, TableColumnConfig } from '../types';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import {
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  RefreshCw,
  Plus,
  ChevronDown,
  Layers,
  Phone,
  Mail,
  User,
  ShieldAlert
} from 'lucide-react';

interface DataTableProps {
  config: ObjectConfig;
  records: any[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onViewRecord: (record: any) => void;
  onEditRecord: (record: any) => void;
  onDeleteRecord: (record: any) => void;
  onCreateRecord?: () => void;
}

const PAGE_SIZE = 20;

export const DataTable: React.FC<DataTableProps> = ({
  config,
  records,
  isLoading,
  error,
  onRefresh,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onCreateRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>(config.defaultSortField || 'id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Handle Sort
  const handleSort = (fieldKey: string) => {
    if (sortField === fieldKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(fieldKey);
      setSortDirection('asc');
    }
  };

  // Filter and Sort records
  const filteredAndSortedRecords = useMemo(() => {
    let list = [...records];

    // Filter by search term across all fields
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((item) => {
        return Object.values(item).some((val) => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(term);
        });
      });
    }

    // Sort
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle composite Contact Name
      if (sortField === 'name' && config.id === 'Contact') {
        aVal = `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.name || '';
        bVal = `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.name || '';
      }

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });

    return list;
  }, [records, searchTerm, sortField, sortDirection, config]);

  // Paginated slice for 20 records at a time
  const paginatedRecords = useMemo(() => {
    return filteredAndSortedRecords.slice(0, visibleCount);
  }, [filteredAndSortedRecords, visibleCount]);

  const hasMore = visibleCount < filteredAndSortedRecords.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Get cell display value
  const renderCellContent = (col: TableColumnConfig, record: any) => {
    if (col.render) {
      return col.render(record);
    }

    if (col.key === 'name' && config.id === 'Contact') {
      const first = record.firstName || '';
      const last = record.lastName || '';
      const fullName = `${first} ${last}`.trim();
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {first ? first.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-snug">
              {fullName || record.name || 'Unnamed Contact'}
            </span>
            {record.id && (
              <span className="text-[10px] text-slate-400 font-mono block">
                ID: {record.id.length > 15 ? `${record.id.substring(0, 15)}...` : record.id}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (col.key === 'email') {
      const email = record.email;
      if (!email) return <span className="text-slate-400 italic">No email</span>;
      return (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 font-medium text-xs truncate max-w-xs"
        >
          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{email}</span>
        </a>
      );
    }

    if (col.key === 'phone') {
      const phone = record.phone;
      if (!phone) return <span className="text-slate-400 italic">No phone</span>;
      return (
        <a
          href={`tel:${phone}`}
          className="text-slate-700 hover:text-blue-600 flex items-center gap-1.5 text-xs font-mono"
        >
          <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{phone}</span>
        </a>
      );
    }

    const val = record[col.key];
    if (val === undefined || val === null || val === '') {
      return <span className="text-slate-400">—</span>;
    }

    return <span className="text-slate-700 font-medium text-xs">{String(val)}</span>;
  };

  return (
    <div id="data-manager-container" className="space-y-4">
      {/* Control Bar: Search, Stats, New Record Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="table-search-input"
            type="text"
            placeholder={`Search ${config.pluralName.toLowerCase()} by name, email, phone...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(PAGE_SIZE); // reset pagination on search
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm text-slate-900 transition-all focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right action group */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Refresh Button */}
          <button
            id="table-refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
            title="Reload records from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          {/* Create Record Button */}
          {onCreateRecord && config.isBackendReady && (
            <button
              id="create-record-btn"
              onClick={onCreateRecord}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ New {config.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div
          id="table-error-banner"
          className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800"
        >
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold">Failed to load {config.pluralName}</h4>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
          <button
            onClick={onRefresh}
            className="text-xs font-bold text-red-700 hover:text-red-900 underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <LoadingSkeleton rows={5} columns={config.tableColumns.length + 1} />
      ) : records.length === 0 ? (
        <EmptyState
          config={config}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
          onCreateRecord={onCreateRecord}
          onRefresh={onRefresh}
        />
      ) : filteredAndSortedRecords.length === 0 ? (
        <EmptyState
          config={config}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
          onCreateRecord={onCreateRecord}
          onRefresh={onRefresh}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block w-full bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table id="salesforce-records-table" className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {config.tableColumns.map((col) => {
                      const isSorted = sortField === col.key;
                      return (
                        <th
                          key={col.key}
                          scope="col"
                          className="px-6 py-3.5 select-none"
                        >
                          {col.sortable !== false ? (
                            <button
                              onClick={() => handleSort(col.key)}
                              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors uppercase font-bold tracking-wider"
                            >
                              <span>{col.label}</span>
                              {isSorted ? (
                                sortDirection === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />
                              )}
                            </button>
                          ) : (
                            <span>{col.label}</span>
                          )}
                        </th>
                      );
                    })}
                    <th scope="col" className="px-6 py-3.5 text-right font-bold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedRecords.map((record, index) => {
                    const rowId = record.id || `row-${index}`;
                    return (
                      <tr
                        key={rowId}
                        id={`record-row-${rowId}`}
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        {config.tableColumns.map((col) => (
                          <td key={col.key} className="px-6 py-3.5 align-middle">
                            {renderCellContent(col, record)}
                          </td>
                        ))}

                        {/* Action buttons */}
                        <td className="px-6 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`view-btn-${rowId}`}
                              onClick={() => onViewRecord(record)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 rounded-lg hover:bg-blue-100/70 transition-colors"
                              title="View Record"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              id={`edit-btn-${rowId}`}
                              onClick={() => onEditRecord(record)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              id={`delete-btn-${rowId}`}
                              onClick={() => onDeleteRecord(record)}
                              className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {paginatedRecords.map((record, index) => {
              const rowId = record.id || `card-${index}`;
              const first = record.firstName || '';
              const last = record.lastName || '';
              const displayName = `${first} ${last}`.trim() || record.name || record.subject || `Record #${index + 1}`;

              return (
                <div
                  key={rowId}
                  id={`record-card-${rowId}`}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {displayName}
                      </h4>
                      {record.id && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {record.id}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      {config.name}
                    </span>
                  </div>

                  <div className="pt-1 space-y-1.5 text-xs text-slate-600">
                    {record.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{record.email}</span>
                      </div>
                    )}
                    {record.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewRecord(record)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => onEditRecord(record)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteRecord(record)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination & Record Count Footer */}
          <div
            id="table-pagination-footer"
            className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 shadow-2xs"
          >
            <div className="flex items-center gap-2 font-medium">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>
                Showing{' '}
                <strong className="text-slate-800">
                  {Math.min(visibleCount, filteredAndSortedRecords.length)}
                </strong>{' '}
                of <strong className="text-slate-800">{filteredAndSortedRecords.length}</strong>{' '}
                {config.pluralName.toLowerCase()}
                {searchTerm && ' (filtered)'}
              </span>
            </div>

            {hasMore ? (
              <button
                id="load-more-records-btn"
                onClick={handleLoadMore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
              >
                <span>Load Next 20 Records</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">
                All {filteredAndSortedRecords.length} records displayed
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
