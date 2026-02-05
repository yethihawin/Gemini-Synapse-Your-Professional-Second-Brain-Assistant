import React, { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';

interface InputPanelProps {
  onOrganize: (text: string) => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ onOrganize, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onOrganize(text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gemini Synapse</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Second Brain Assistant</p>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col space-y-4">
        <label htmlFor="input-text" className="block text-sm font-semibold text-slate-700">
          Source Material
        </label>
        <textarea
          id="input-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste meeting notes, PDF dumps, or brain dumps here..."
          className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none"
          spellCheck={false}
        />
        
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 font-semibold text-white transition-all shadow-lg shadow-indigo-100
              ${isLoading || !text.trim() 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:translate-y-[-1px]'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Organize with Gemini</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            Powered by Gemini 3 Flash • Strict JSON Output
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;