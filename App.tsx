import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { SynapseData } from './types';
import { organizeContent } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<SynapseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrganize = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setData(null); // Reset prev data while loading

    try {
      const result = await organizeContent(text);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Left Panel - Input */}
      <div className="w-full md:w-5/12 lg:w-1/3 h-[45vh] md:h-full shrink-0">
        <InputPanel onOrganize={handleOrganize} isLoading={isLoading} />
      </div>

      {/* Right Panel - Output */}
      <div className="w-full md:w-7/12 lg:w-2/3 h-[55vh] md:h-full flex-1 border-l border-slate-200">
        <OutputPanel data={data} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default App;