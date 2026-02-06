import React from 'react';
import { ChatMessage } from '../types';
import ChatView from './DashboardView';

interface OutputPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const AI_AVATAR_URL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const OutputPanel: React.FC<OutputPanelProps> = ({ messages, isLoading, error }) => {
  
  // Empty State
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 rounded-full p-1.5 bg-white border border-gray-100 shadow-xl mb-6 relative">
           <img 
            src={AI_AVATAR_URL} 
            alt="AI Assistant" 
            className="w-full h-full rounded-full object-cover"
           />
        </div>
        <h3 className="text-2xl font-serif font-bold text-[#3730A3] mb-3">Hello, Friend</h3>
        <p className="max-w-md mx-auto text-gray-600 text-sm leading-relaxed mb-10">
          I am Sweet, your professional second brain. I'm here to help you code, design, write, or just chat.
          <br/><span className="text-xs text-gray-400 mt-2 block">Try saying "Hey Sweet" to start.</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
           <div className="p-5 bg-white border border-stone-100 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] text-left hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
              <span className="text-indigo-800 font-bold text-xs uppercase block mb-1 tracking-wider group-hover:text-indigo-600">Coding</span>
              <p className="text-sm text-gray-600 font-serif italic">"Review this Python script..."</p>
           </div>
           <div className="p-5 bg-white border border-stone-100 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] text-left hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
              <span className="text-indigo-800 font-bold text-xs uppercase block mb-1 tracking-wider group-hover:text-indigo-600">Writing</span>
              <p className="text-sm text-gray-600 font-serif italic">"Draft a warm email..."</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pt-8 pb-12 px-4 md:px-12 scroll-smooth">
        <ChatView messages={messages} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm flex items-center gap-2 shadow-sm">
             <span>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;