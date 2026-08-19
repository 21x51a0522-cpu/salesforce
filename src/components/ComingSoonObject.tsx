import React, { useState } from 'react';
import { ObjectConfig, SalesforceObjectName } from '../types';
import { 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Server, 
  Clock, 
  Database,
  UserCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ComingSoonObjectProps {
  config: ObjectConfig;
  onSelectContact: () => void;
}

export const ComingSoonObject: React.FC<ComingSoonObjectProps> = ({
  config,
  onSelectContact,
}) => {
  const { info } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (section: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    info(`Copied ${section} to clipboard`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div id="coming-soon-container" className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Frontend Architecture Ready • Backend Endpoint Pending</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {config.name} Management
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            {config.description} The frontend data model, form validation schemas, table columns, and REST API abstraction are completely configured. When you deploy the <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-blue-200">{config.endpoint}</code> endpoint on your Spring Boot backend, this view will automatically go live.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSelectContact}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to Contact (Active Live API)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Two Column Architectural Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Schema & Field Definitions */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Pre-configured {config.name} Schema ({config.fields.length} Fields)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">objectConfig.ts</span>
          </div>

          <p className="text-xs text-slate-500">
            These fields are mapped to Salesforce SObject fields and prepared for dynamic form rendering:
          </p>

          <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
            {config.fields.map((field) => (
              <div key={field.key} className="px-3.5 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800">{field.label}</span>
                  <span className="text-slate-400 font-mono ml-2 text-[11px]">({field.key})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                    {field.type}
                  </span>
                  {field.required ? (
                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-medium">
                      Required
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 text-[10px]">
                      Optional
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sample JSON Payload */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">Sample JSON Payload for POST {config.endpoint}</span>
              <button
                onClick={() => handleCopy('Payload', JSON.stringify(config.samplePayload, null, 2))}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                {copiedSection === 'Payload' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'Payload' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto">
              {JSON.stringify(config.samplePayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right: Spring Boot Implementation Blueprint */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Spring Boot Controller Blueprint
              </h3>
            </div>
            <button
              onClick={() => handleCopy('Controller Code', config.springBootDtoExample || '')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {copiedSection === 'Controller Code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'Controller Code' ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Paste this starter REST Controller in your Spring Boot application to instantly connect this {config.name} view:
          </p>

          <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            {config.springBootDtoExample}
          </pre>

          <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-800 space-y-1">
            <p className="font-semibold">Backend Integration Step:</p>
            <p className="text-blue-700">
              Once you implement <code className="font-mono font-bold">@GetMapping("{config.endpoint}")</code> in Spring Boot, change <code className="font-mono font-bold">isBackendReady: true</code> in <code className="font-mono">src/config/objectConfig.ts</code> and this tab will immediately switch to live CRUD mode!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
