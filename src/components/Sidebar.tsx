import React from 'react';
import { SalesforceObjectName } from '../types';
import { OBJECT_CONFIGS, SALESFORCE_OBJECT_KEYS } from '../config/objectConfig';
import {
  LayoutDashboard,
  Database,
  Activity,
  Settings,
  UserCheck,
  Building2,
  TrendingUp,
  UserPlus,
  LifeBuoy,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type NavTab = 'dashboard' | 'objects' | 'activity' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedObject: SalesforceObjectName;
  onSelectObject: (obj: SalesforceObjectName) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedObject,
  onSelectObject,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'objects' as NavTab, label: 'Objects', icon: Database, badge: '5 Objects' },
    { id: 'activity' as NavTab, label: 'Activity Log', icon: Activity },
    { id: 'settings' as NavTab, label: 'Settings & API', icon: Settings },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleObjectClick = (obj: SalesforceObjectName) => {
    onSelectObject(obj);
    onSelectTab('objects');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between lg:hidden">
          <span className="font-bold text-slate-900">Navigation</span>
          <button
            onClick={onCloseMobile}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 p-1"
          >
            Close ✕
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <div className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-blue-200/60 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Salesforce Objects List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-1 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Salesforce Objects
            </p>
            <span className="text-[10px] text-slate-400 font-mono">5 items</span>
          </div>

          {SALESFORCE_OBJECT_KEYS.map((key) => {
            const config = OBJECT_CONFIGS[key];
            const Icon = getObjectIcon(config.iconName);
            const isSelected = currentTab === 'objects' && selectedObject === key;

            return (
              <button
                key={key}
                id={`sidebar-object-${key.toLowerCase()}`}
                onClick={() => handleObjectClick(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{config.name}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {config.isBackendReady ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      Live
                    </span>
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-400'
                    }`}>
                      Ready
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom System Card */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
          <div className="rounded-xl p-3 bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-bold text-slate-800">Spring Boot REST API</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Contact CRUD active on <code className="text-slate-700 font-mono text-[10px]">/api/contacts</code>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
