import React, { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { ChatMessage, Attachment } from './types';
import { sendMessage, startChatSession } from './services/geminiService';
import { Menu } from 'lucide-react';

const AI_AVATAR_URL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat on mount
  useEffect(() => {
    startChatSession();
  }, []);

  const handleSendMessage = async (text: string, attachments: Attachment[], isLiveMode: boolean) => {
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
      const responseText = await sendMessage(text, attachments, isLiveMode);

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
    <div className="h-screen w-full flex flex-col md:flex-row bg-gradient-to-b from-[#FFFDF5] to-[#F7F3E9] overflow-hidden safe-area-inset">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="md:hidden h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-2">
          <img src={AI_AVATAR_URL} alt="AI" className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" />
          <h1 className="font-serif font-bold text-gray-900">Gemini Synapse</h1>
        </div>
        <button className="text-gray-500">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Input Panel / Sidebar 
          - Desktop: Left Sidebar (order-1)
          - Mobile: Fixed Bottom Bar (order-2 visually, but using fixed positioning)
      */}
      <div className="
        fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200
        md:relative md:w-[400px] md:h-full md:border-t-0 md:border-r md:z-10
        order-2 md:order-1 shadow-xl md:shadow-none
      ">
        <InputPanel onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Chat Output Area 
          - Mobile: Flex-1, padding-bottom to account for fixed input
          - Desktop: Flex-1, full height
      */}
      <div className="
        flex-1 relative order-1 md:order-2 
        h-full overflow-hidden flex flex-col
        pb-[70px] md:pb-0 
      ">
        <OutputPanel messages={messages} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default App;