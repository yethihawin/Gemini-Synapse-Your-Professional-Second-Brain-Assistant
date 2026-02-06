import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Paperclip, Loader2, X, FileCode, Camera, Zap, SwitchCamera, Mic } from 'lucide-react';
import { Attachment } from '../types';

interface InputPanelProps {
  onSendMessage: (text: string, attachments: Attachment[], isLiveMode: boolean) => void;
  isLoading: boolean;
}

const AI_AVATAR_URL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const InputPanel: React.FC<InputPanelProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if ((text.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(text, attachments, isLiveMode);
      setText('');
      setAttachments([]);
      // Reset height
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Voice Recognition Logic ---
  const handleMicClick = () => {
    if (isListening) return;

    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const lowerTranscript = transcript.toLowerCase().trim();

      // Check for Wake Word "Hey Sweet"
      if (lowerTranscript.startsWith("hey sweet")) {
         // Auto-send immediately for the wake word experience
         onSendMessage(transcript, attachments, isLiveMode);
         setText(''); 
         setAttachments([]);
      } else {
         // Otherwise just populate the text field
         setText(prev => (prev ? prev + ' ' : '') + transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };


  // --- Camera Logic ---
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsCameraOpen(false);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      const newAttachment: Attachment = {
        name: `capture_${Date.now()}.jpg`,
        mimeType: 'image/jpeg',
        data: dataUrl
      };
      setAttachments(prev => [...prev, newAttachment]);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col h-full bg-surface ${isLiveMode ? 'md:bg-red-50/30' : ''} transition-colors duration-300 md:border-r border-gray-200`}>
      
      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={AI_AVATAR_URL}
            alt="AI Assistant"
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <h1 className="font-serif text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Gemini Synapse
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">AI WORKSPACE</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-2 font-medium">Your Professional Second Brain Assistant</p>
        
        <div className="flex items-center justify-between mt-4">
           {/* Live Toggle (Desktop) */}
          <button 
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
              ${isLiveMode ? 'bg-red-500 text-white border-red-600 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 shadow-sm'}`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            {isLiveMode ? 'LIVE MODE ACTIVE' : 'ENABLE LIVE MODE'}
          </button>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="flex-1 flex flex-col md:p-6 overflow-hidden relative">
        
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 md:mb-4 overflow-x-auto pb-2 px-4 md:px-0 scrollbar-hide">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-gray-200 bg-white flex flex-col items-center justify-center overflow-hidden shadow-sm">
                  {att.mimeType.startsWith('image/') ? (
                    <img src={att.data} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileCode className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  )}
                </div>
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Controls */}
        <div className={`
          flex flex-row md:flex-col gap-2 md:gap-0
          bg-white md:bg-transparent
          p-2 md:p-0
          border-t md:border-t-0 border-gray-200 md:border-0
          items-end md:items-stretch
          ${isLiveMode ? 'border-t-red-200' : ''}
        `}>
          
          {/* Mobile Actions: Live, Camera, Mic */}
          <div className="flex md:hidden gap-1 pb-1">
             <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`p-2 rounded-full transition-colors ${isLiveMode ? 'bg-red-100 text-red-600' : 'text-gray-400 bg-gray-50'}`}
             >
                <Zap className="w-5 h-5 fill-current" />
             </button>
             <button 
                onClick={startCamera}
                className="p-2 rounded-full text-gray-500 bg-gray-50 active:bg-gray-200"
             >
                <Camera className="w-5 h-5" />
             </button>
             <button 
                onClick={handleMicClick}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-500 bg-gray-50 active:bg-gray-200'}`}
             >
                <Mic className="w-5 h-5" />
             </button>
          </div>

          {/* Desktop Wrapper Style */}
          <div className={`
            flex-1 w-full flex md:flex-col
            md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 
            md:focus-within:ring-2 md:focus-within:ring-accent/10 md:transition-all 
            md:overflow-hidden relative
            items-center md:items-stretch gap-2 md:gap-0
          `}>
             
             {/* Text Area */}
             <textarea
               ref={textareaRef}
               value={text}
               onChange={(e) => setText(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={isListening ? "Listening..." : (isLiveMode ? "Chat with Sweet..." : "Ask anything...")}
               className={`
                  flex-1 w-full bg-gray-100 md:bg-transparent 
                  px-4 py-3 md:p-4 
                  rounded-2xl md:rounded-none
                  resize-none outline-none 
                  text-gray-700 placeholder-gray-400 text-base leading-relaxed
                  max-h-[120px] md:max-h-none overflow-y-auto
               `}
               rows={1}
               style={{ minHeight: '44px' }}
             />

             {/* Desktop Bottom Toolbar */}
             <div className="hidden md:flex p-3 bg-gray-50 border-t border-gray-100 justify-between items-center">
                <div className="flex items-center gap-1">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg" title="Upload File">
                     <Paperclip className="w-4 h-4" />
                  </button>
                  <button onClick={startCamera} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg" title="Use Camera">
                     <Camera className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleMicClick} 
                    className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-500 hover:bg-gray-200'}`} 
                    title="Voice Input (Say 'Hey Sweet')"
                  >
                     <Mic className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] text-gray-300 font-medium">ENTER to send</span>
                   <button onClick={handleSubmit} disabled={isLoading} className={`h-9 px-4 rounded-lg flex items-center justify-center transition-colors ${isLoading ? 'bg-gray-300' : 'bg-gray-900 hover:bg-black'} text-white`}>
                     {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                   </button>
                </div>
             </div>

             {/* Mobile Send Button */}
             <button 
                onClick={handleSubmit} 
                disabled={isLoading || (!text.trim() && attachments.length === 0)}
                className={`md:hidden w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-colors mb-px
                  ${isLoading || (!text.trim() && attachments.length === 0) 
                    ? 'bg-gray-200 text-gray-400' 
                    : isLiveMode ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}
             >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
             </button>
          </div>
          
          {/* Mobile Upload (Hidden inside logic, simpler to have dedicated button or combine) */}
           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
           <button onClick={() => fileInputRef.current?.click()} className="md:hidden p-2 text-gray-400 active:bg-gray-100 rounded-full mb-1">
              <Paperclip className="w-5 h-5" />
           </button>
        </div>
      </div>
      
      {/* Desktop Capability Tags */}
      <div className="hidden md:flex px-6 py-4 bg-gray-50/50 border-t border-gray-100">
         <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1.5 mr-2">Agents:</span>
            {[
              { label: 'Coder', icon: '💻' },
              { label: 'Architect', icon: '☁️' },
              { label: 'Writer', icon: '✍️' },
              { label: 'Translator', icon: '🌐' }
            ].map((cap, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-600 font-medium shadow-sm">
                 <span>{cap.icon}</span> {cap.label}
              </div>
            ))}
         </div>
      </div>

      {/* Camera Overlay Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex-1 relative bg-black">
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
             
             {/* Close Btn */}
             <button onClick={stopCamera} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full backdrop-blur-md">
               <X className="w-6 h-6" />
             </button>
          </div>
          
          <div className="h-32 bg-black flex items-center justify-center gap-8 pb-8">
             <button onClick={() => {
                alert("Switch camera not implemented in this demo.");
             }} className="p-4 rounded-full bg-gray-800 text-white opacity-50">
               <SwitchCamera className="w-6 h-6" />
             </button>
             
             <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:bg-white/20 transition-colors">
               <div className="w-16 h-16 bg-white rounded-full"></div>
             </button>
             
             <div className="w-14"></div> {/* Spacer */}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPanel;