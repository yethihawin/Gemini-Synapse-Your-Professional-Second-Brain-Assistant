import React from 'react';
import { ChatMessage } from '../types';
import ChatView from './DashboardView';
import { Sparkles, Terminal } from 'lucide-react';

interface OutputPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ messages, isLoading, error }) => {
  
  // Empty State
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 text-center p-8">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 bg-accent/5 rounded-2xl transform rotate-6"></div>
           <Terminal className="w-10 h-10 text-gray-300 relative z-10" />
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">Gemini Workspace</h3>
        <p className="max-w-md mx-auto text-gray-500 text-sm leading-relaxed mb-8">
          I am ready to assist with coding, network design, writing, and analysis. 
          Upload images or files for multimodal insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
           <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm text-left">
              <span className="text-accent font-bold text-xs uppercase block mb-1">Code</span>
              <p className="text-xs text-gray-600">"Debug this React component..."</p>
           </div>
           <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm text-left">
              <span className="text-blue-500 font-bold text-xs uppercase block mb-1">Write</span>
              <p className="text-xs text-gray-600">"Draft a Q3 strategy memo..."</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/30 relative">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pt-8 pb-12 px-4 md:px-12 scroll-smooth">
        <ChatView messages={messages} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm flex items-center gap-2">
             <span>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
