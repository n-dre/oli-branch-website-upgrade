// src/components/OliChatTrigger.jsx
import React from 'react';

const OliChatTrigger = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      title="Talk to Oli AI"
      className="fixed bottom-5 right-5 cursor-pointer z-[1000] w-[60px] h-[60px] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.7)] flex items-center justify-center animate-vibrate-glow"
    >
      <img 
        src="/resources/Gemini_Generated_Image_qt3fakqt3fakqt3f.png" 
        alt="Oli AI Avatar" 
        className="w-full h-full rounded-full border-2 border-[#FFD700]"
      />
    </div>
  );
};

export default OliChatTrigger;