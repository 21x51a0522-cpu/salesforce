import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ActivityLogItem, SalesforceObjectName } from '../types';

interface ActivityContextValue {
  activities: ActivityLogItem[];
  logActivity: (
    action: ActivityLogItem['action'],
    objectType: SalesforceObjectName,
    status: ActivityLogItem['status'],
    message: string,
    recordId?: string,
    payload?: any
  ) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

const STORAGE_KEY = 'CLOUDVANDANA_ACTIVITY_LOG';

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, 100)));
    } catch (e) {
      console.warn('Failed to persist activity log', e);
    }
  }, [activities]);

  const logActivity = useCallback((
    action: ActivityLogItem['action'],
    objectType: SalesforceObjectName,
    status: ActivityLogItem['status'],
    message: string,
    recordId?: string,
    payload?: any
  ) => {
    const newItem: ActivityLogItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      objectType,
      status,
      message,
      recordId,
      payload,
    };
    setActivities((prev) => [newItem, ...prev]);
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, logActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextValue => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
