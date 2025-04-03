import React, { useState, useEffect } from "react";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    address: string;
  };
  amount: string;
  onSend: () => Promise<void>;
}

export const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, recipient, amount, onSend }) => {
  const [isSending, setIsSending] = useState(false);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsSending(false);
    }
  }, [isOpen]);
  
  // Handle send functionality
  const handleSend = async () => {
    if (isSending) return;
    
    setIsSending(true);
    
    try {
      await onSend();
      // Close modal after success with a small delay to show success state
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Send failed:", error);
      setIsSending(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-xl">
        {/* Back button */}
        <div className="px-6 pt-6">
          <button 
            onClick={onClose} 
            className="text-4xl font-light text-gray-700 hover:text-gray-900 focus:outline-none"
            aria-label="Close"
          >
            &larr;
          </button>
        </div>
        
        <div className="pt-4 pb-10 px-8 text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-800">Send to</h2>
          
          {/* Recipient */}
          <div className="mt-8 pb-2">
            <div className="w-24 h-24 bg-gradient-to-br from-[#363FF9] to-[#5498FF] rounded-full mx-auto flex items-center justify-center">
              {/* Recipient initial removed */}
            </div>
            <p className="text-4xl font-bold mt-6">
              {recipient.address 
                ? `${recipient.address.substring(0, 6)}...${recipient.address.substring(recipient.address.length - 4)}`
                : recipient.name}
            </p>
          </div>
          
          {/* Amount */}
          <div className="mt-12 mb-12">
            <p className="text-7xl font-bold">${amount}</p>
          </div>
          
          {/* Send button */}
          <div className="mt-10 w-full">
            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-6 bg-[#363FF9] text-white text-xl font-bold rounded-full hover:bg-[#2C35DF] disabled:opacity-70 transition-colors shadow-lg"
            >
              {isSending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SENDING...
                </span>
              ) : "SEND NOW"}
            </button>
          </div>
          
          <p className="text-gray-500 mt-8 text-center text-lg">Payments are public</p>
        </div>
      </div>
    </div>
  );
}; 