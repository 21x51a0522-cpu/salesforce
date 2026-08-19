import React from 'react';
import { SalesforceObjectName } from '../types';
import { OBJECT_CONFIGS, SALESFORCE_OBJECT_KEYS } from '../config/objectConfig';
import {
  ChevronDown,
  UserCheck,
  Building2,
  TrendingUp,
  UserPlus,
  LifeBuoy,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ObjectSelectorProps {
  selectedObject: SalesforceObjectName;
  onSelectObject: (obj: SalesforceObjectName) => void;
  disabled?: boolean;
}

const getObjectIcon = (iconName: string) => {
  switch (iconName) {
    case 'UserCheck':
      return UserCheck;
    case 'Building2':
      return Building2;
    case 'TrendingUp':
      return TrendingUp;
    case 'UserPlus':
      return UserPlus;
    case 'LifeBuoy':
      return LifeBuoy;
    default:
      return Database;
  }
};

export const ObjectSelector: React.FC<ObjectSelectorProps> = ({
  selectedObject,
  onSelectObject,
  disabled = false,
}) => {
  const currentConfig = OBJECT_CONFIGS[selectedObject];
  const CurrentIcon = getObjectIcon(currentConfig.iconName);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <label htmlFor="salesforce-object-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Salesforce Object:
      </label>

      <div className="relative inline-block min-w-[240px]">
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-blue-600">
            <CurrentIcon className="w-4 h-4" />
          </div>

          <select
            id="salesforce-object-select"
            value={selectedObject}
            disabled={disabled}
            onChange={(e) => onSelectObject(e.target.value as SalesforceObjectName)}
            className="w-full pl-9.5 pr-10 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-semibold text-slate-900 shadow-2xs appearance-none transition-all cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            {SALESFORCE_OBJECT_KEYS.map((key) => {
              const config = OBJECT_CONFIGS[key];
              return (
                <option key={key} value={key}>
                  {config.name} {config.isBackendReady ? '✓ (Live REST API)' : '(Schema Ready)'}
                </option>
              );
            })}
          </select>

          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Pill with object status info */}
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        {currentConfig.isBackendReady ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Backend Connected ({currentConfig.endpoint})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 font-medium">
            <Clock className="w-3.5 h-3.5" />
            Endpoint Ready for Spring Boot ({currentConfig.endpoint})
          </span>
        )}
      </div>
    </div>
  );
};
