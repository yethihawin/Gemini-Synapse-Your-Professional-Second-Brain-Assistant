import React, { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { ChatMessage, Attachment } from './types';
import { sendMessage, startChatSession } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat on mount
  useEffect(() => {
    startChatSession();
  }, []);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    setIsLoading(true);
    setError(null);

    // 1. Add User Message to UI
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      attachments: attachments,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // 2. Call Gemini
      const responseText = await sendMessage(text, attachments);

      // 3. Add Model Response to UI
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#FCFBF9] overflow-hidden">
      {/* Left Panel - Input / Sidebar */}
      <div className="w-full md:w-[400px] h-[35vh] md:h-full shrink-0 z-10 shadow-xl shadow-slate-200/50 relative order-2 md:order-1">
        <InputPanel onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Right Panel - Chat Output */}
      <div className="flex-1 h-[65vh] md:h-full relative order-1 md:order-2">
        <OutputPanel messages={messages} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default App;
