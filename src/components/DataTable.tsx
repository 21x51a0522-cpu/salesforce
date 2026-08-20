import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  ShieldAlert,
  Loader2,
  Building2,
  TrendingUp,
  LifeBuoy
} from 'lucide-react';

interface DataTableProps {
  config: ObjectConfig;
  records: any[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  error: string | null;
  onRefresh: () => void;
  onLoadMore?: () => void;
  onViewRecord: (record: any) => void;
  onEditRecord: (record: any) => void;
  onDeleteRecord: (record: any) => void;
  onCreateRecord?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  config,
  records,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  error,
  onRefresh,
  onLoadMore,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onCreateRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>(config.defaultSortField || 'id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Setup infinite scroll intersection observer on the bottom sentinel
  useEffect(() => {
    if (!sentinelRef.current || !onLoadMore || !hasMore || isLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  // Handle Sort
  const handleSort = (fieldKey: string) => {
    if (sortField === fieldKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(fieldKey);
      setSortDirection('asc');
    }
  };

  // Filter and Sort records locally for search/sort responsiveness
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

      // Handle composite Name for Contact or Lead
      if (sortField === 'name') {
        if (config.id === 'Contact' || config.id === 'Lead') {
          aVal = `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.name || '';
          bVal = `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.name || '';
        }
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

  // Render cell content intelligently based on field type and object schema
  const renderCellContent = (col: TableColumnConfig, record: any) => {
    if (col.render) {
      return col.render(record);
    }

    // Contact or Lead Name
    if (col.key === 'name' && (config.id === 'Contact' || config.id === 'Lead')) {
      const first = record.firstName || '';
      const last = record.lastName || '';
      const fullName = `${first} ${last}`.trim() || record.name || 'Unnamed';
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {first ? first.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-snug">
              {fullName}
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

    // Account Name
    if (col.key === 'name' && config.id === 'Account') {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-snug">
              {record.name || 'Unnamed Account'}
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

    // Opportunity Name
    if (col.key === 'name' && config.id === 'Opportunity') {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-snug">
              {record.name || 'Unnamed Opportunity'}
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

    // Case Subject
    if (col.key === 'subject' && config.id === 'Case') {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <LifeBuoy className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block leading-snug">
              {record.subject || 'Unnamed Case'}
            </span>
            {record.caseNumber && (
              <span className="text-[10px] text-blue-600 font-mono block font-semibold">
                #{record.caseNumber}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Status or Stage badges
    if (col.key === 'status' || col.key === 'stageName') {
      const val = record[col.key];
      if (!val) return <span className="text-slate-400">—</span>;

      let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
      const strVal = String(val).toLowerCase();
      if (strVal.includes('won') || strVal.includes('closed') || strVal.includes('converted')) {
        badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      } else if (strVal.includes('working') || strVal.includes('negotiation') || strVal.includes('proposal')) {
        badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
      } else if (strVal.includes('new') || strVal.includes('open') || strVal.includes('prospecting')) {
        badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
      } else if (strVal.includes('lost') || strVal.includes('escalated')) {
        badgeColor = 'bg-red-50 text-red-700 border-red-200';
      }

      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeColor}`}>
          {String(val)}
        </span>
      );
    }

    // Priority badge
    if (col.key === 'priority') {
      const val = record.priority;
      if (!val) return <span className="text-slate-400">—</span>;
      const isHigh = String(val).toLowerCase() === 'high';
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
          isHigh ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
        }`}>
          {String(val)}
        </span>
      );
    }

    // Currency / Amount formatting
    if (col.key === 'amount') {
      const val = record.amount;
      if (val === undefined || val === null || val === '') return <span className="text-slate-400">—</span>;
      const num = Number(val);
      return (
        <span className="font-semibold text-slate-900 text-xs">
          ${isNaN(num) ? String(val) : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </span>
      );
    }

    // Probability percentage
    if (col.key === 'probability') {
      const val = record.probability;
      if (val === undefined || val === null || val === '') return <span className="text-slate-400">—</span>;
      return <span className="font-semibold text-slate-700 text-xs">{val}%</span>;
    }

    // Email link
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

    // Phone link
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
      {/* Control Bar: Search, Refresh, New Record Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="table-search-input"
            type="text"
            placeholder={`Search ${config.pluralName.toLowerCase()} by fields...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Error state / Backend Notice */}
      {error && !isLoading && (
        <div
          id="table-error-banner"
          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-800"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Backend Server Notice</h4>
              <p className="text-xs text-slate-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors self-end sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Test Connection</span>
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
                  {filteredAndSortedRecords.map((record, index) => {
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
            {filteredAndSortedRecords.map((record, index) => {
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

          {/* Bottom Sentinel for Infinite Scroll on Scroll End */}
          <div ref={sentinelRef} id="table-scroll-sentinel" className="h-4 w-full" />

          {/* Pagination & Infinite Scroll Footer */}
          <div
            id="table-pagination-footer"
            className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 shadow-2xs"
          >
            <div className="flex items-center gap-2 font-medium">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>
                Loaded <strong className="text-slate-800">{records.length}</strong>{' '}
                {config.pluralName.toLowerCase()} (20 per page)
                {searchTerm && ' (filtered)'}
              </span>
            </div>

            {hasMore ? (
              <button
                id="load-more-records-btn"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading next 20 records...</span>
                  </>
                ) : (
                  <>
                    <span>Scroll or Click to Load Next 20</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">
                All {records.length} records loaded from Salesforce
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
