
import React, { useState } from 'react';

const AuditModal = ({ isOpen, onClose }) => {
  const [feeInput, setFeeInput] = useState('');
  const [progress, setProgress] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');

  const processAudit = () => {
    const fee = parseFloat(feeInput) || 0;
    setProgress(100);
    
    setTimeout(() => {
      setShowResult(true);
      if (fee > 40) {
        setResultText(`Oli identified a leak of $${(fee * 12 * 0.4).toFixed(0)} per year in redundant charges.`);
      } else {
        setResultText("Your fees look healthy, but we found yield mismatches. Let's fix this.");
      }
    }, 800);
  };

  const handleClose = () => {
    setFeeInput('');
    setProgress(30);
    setShowResult(false);
    setResultText('');
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-10 max-w-[600px] w-[90%] max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-[#2D3748] text-2xl transition-colors"
        >
          &times;
        </button>

        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src="/resources/oli-branch-1 (9).png" 
              alt="Oli" 
              className="w-12 h-12 rounded-full border border-[#D4AF37]"
            />
            <h3 className="font-display text-2xl font-bold text-[#1B4332]">
              Oli Financial Audit
            </h3>
          </div>
          
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-8">
            <div 
              className="h-full bg-[#D4AF37] transition-all duration-400 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!showResult && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                What are your average monthly banking fees?
              </label>
              <input 
                type="number" 
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                placeholder="$0.00" 
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#52796F] focus:shadow-[0_0_0_3px_rgba(82,121,111,0.1)] mb-6"
              />
              <button 
                onClick={processAudit} 
                className="w-full py-4 rounded-lg font-bold bg-[#1B4332] text-white hover:bg-[#52796F] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Analyze My Fees
              </button>
            </div>
          )}

          {showResult && (
            <div className="text-center">
              <h4 className="text-xl font-bold text-[#1B4332] mb-2">
                Audit Complete
              </h4>
              <p className="text-gray-700 mb-6">
                {resultText}
              </p>
              <button 
                onClick={handleClose} 
                className="w-full py-3 rounded-lg border-2 border-[#1B4332] text-[#1B4332] bg-transparent hover:bg-[#1B4332] hover:text-white transition-all"
              >
                Get Full Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;