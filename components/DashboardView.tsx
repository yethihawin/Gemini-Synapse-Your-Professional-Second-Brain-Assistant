import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { User, FileIcon } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const AI_AVATAR_URL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-4">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`group flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Avatar */}
          {msg.role === 'model' ? (
             <img 
               src={AI_AVATAR_URL}
               alt="AI"
               className="flex-shrink-0 w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
             />
          ) : (
             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shadow-inner border-2 border-gray-100">
                <User className="w-5 h-5" />
             </div>
          )}

          {/* Message Content */}
          <div className={`flex-1 max-w-[85%] space-y-2`}>
            
            {/* Attachments (User Only usually) */}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className={`flex flex-wrap gap-2 mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.attachments.map((att, i) => (
                   <div key={i} className="bg-white p-2 rounded border border-gray-200 shadow-sm flex items-center gap-2 max-w-[200px]">
                      {att.mimeType.startsWith('image/') ? (
                        <img src={att.data} alt="att" className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <FileIcon className="w-6 h-6 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-600 truncate">{att.name}</span>
                   </div>
                ))}
              </div>
            )}

            {/* Text Bubble / Artifact 
                Updated for Classic Premium Theme: 
                - White background
                - Elegant subtle shadow
                - Soft borders
            */}
            <div className={`
              ${msg.role === 'user' 
                ? 'bg-[#1F2937] text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md' 
                : 'bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),0_2px_6px_-2px_rgba(0,0,0,0.01)] border border-stone-100 px-8 py-8 rounded-xl min-h-[100px] w-full artifact-container'}
            `}>
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{msg.text}</div>
              ) : (
                <div className="markdown-prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            <div className={`text-[10px] text-gray-400 font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left pl-2'}`}>
               {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-4">
          <img 
               src={AI_AVATAR_URL}
               alt="AI"
               className="flex-shrink-0 w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
             />
          <div className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-stone-100 px-8 py-6 rounded-xl w-full max-w-[85%]">
             <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-800 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-indigo-800 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-indigo-800 rounded-full animate-bounce delay-300"></div>
             </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatView;