import React, { useState } from 'react';
import { SynapseData } from '../types';
import DashboardView from './DashboardView';
import { Code, LayoutDashboard } from 'lucide-react';

interface OutputPanelProps {
  data: SynapseData | null;
  isLoading: boolean;
  error: string | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ data, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
        <div className="h-4 bg-slate-200 rounded w-48"></div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-red-500 p-8 text-center">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 className="text-lg font-bold mb-2">Analysis Failed</h3>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center opacity-60">
        <LayoutDashboard className="w-20 h-20 mb-6 text-slate-200" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Organize</h3>
        <p className="max-w-xs mx-auto">Paste your notes on the left and click "Organize" to generate your second brain dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <h2 className="font-bold text-slate-800">Results</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'visual' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'json' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Raw JSON</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 scroll-smooth">
        {activeTab === 'visual' ? (
          <DashboardView data={data} />
        ) : (
          <div className="bg-slate-900 rounded-xl shadow-inner p-6 overflow-x-auto border border-slate-800">
            <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;