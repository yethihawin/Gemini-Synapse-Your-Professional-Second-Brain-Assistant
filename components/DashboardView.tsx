import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { Bot, User, FileIcon } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

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
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm
            ${msg.role === 'model' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-gray-200 text-gray-600'}`}>
            {msg.role === 'model' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>

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

            {/* Text Bubble / Artifact */}
            <div className={`
              ${msg.role === 'user' 
                ? 'bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-tr-sm' 
                : 'bg-white shadow-sm border border-gray-100 px-8 py-8 rounded-xl min-h-[100px] w-full artifact-container'}
            `}>
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
              ) : (
                <div className="markdown-prose text-gray-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            <div className={`text-[10px] text-gray-300 font-medium uppercase tracking-wider ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
               {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 text-accent border border-accent/20 flex items-center justify-center">
             <Bot className="w-5 h-5" />
          </div>
          <div className="bg-white shadow-sm border border-gray-100 px-8 py-6 rounded-xl w-full max-w-[85%]">
             <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-300"></div>
             </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatView;
