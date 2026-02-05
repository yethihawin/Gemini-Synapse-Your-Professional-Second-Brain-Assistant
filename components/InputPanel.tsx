import React, { useState, useRef } from 'react';
import { ArrowRight, Paperclip, Loader2, Sparkles, X, Image as ImageIcon, FileCode } from 'lucide-react';
import { Attachment } from '../types';

interface InputPanelProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((text.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(text, attachments);
      setText('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAttachment: Attachment = {
            name: file.name,
            mimeType: file.type,
            data: event.target.result as string
          };
          setAttachments(prev => [...prev, newAttachment]);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-surface border-r border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <h1 className="font-serif text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Gemini Synapse
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Your Professional Second Brain Assistant</p>
        <p className="text-[10px] text-gray-400 mt-2 font-semibold tracking-widest uppercase">AI WORKSPACE &bull; MULTIMODAL</p>
      </div>

      {/* Main Input Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group flex-shrink-0">
                <div className="w-20 h-20 rounded-lg border border-gray-200 bg-white flex flex-col items-center justify-center overflow-hidden shadow-sm">
                  {att.mimeType.startsWith('image/') ? (
                    <img src={att.data} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileCode className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-[9px] text-gray-500 mt-1 truncate max-w-[5rem] text-center">{att.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Writing Pad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col focus-within:ring-2 focus-within:ring-accent/10 transition-all relative overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 w-full bg-transparent p-4 resize-none outline-none text-gray-700 placeholder-gray-300 text-base leading-relaxed"
            spellCheck={false}
            autoFocus
          />
          
          {/* Bottom Bar */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={handleFileSelect}
                 accept="image/*,application/pdf,text/*" 
               />
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-lg transition-colors flex items-center gap-2" 
                 title="Add context (Image/File)"
               >
                  <Paperclip className="w-4 h-4" />
                  <span className="text-xs font-medium">Add Context</span>
               </button>
             </div>
             
             <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-300 font-medium hidden lg:inline-block">⌘ + ENTER</span>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || (!text.trim() && attachments.length === 0)}
                  className={`h-9 px-4 rounded-lg flex items-center justify-center font-medium transition-all duration-200
                    ${isLoading || (!text.trim() && attachments.length === 0)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 text-white shadow hover:bg-black'
                    }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Capability Tags */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Active Agents</p>
         <div className="flex flex-wrap gap-2">
            {[
              { label: 'Coder', icon: '💻' },
              { label: 'Architect', icon: '☁️' },
              { label: 'Writer', icon: '✍️' },
              { label: 'Analyst', icon: '📊' }
            ].map((cap, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-600 font-medium shadow-sm">
                 <span>{cap.icon}</span> {cap.label}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default InputPanel;