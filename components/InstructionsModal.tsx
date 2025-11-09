import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { XIcon } from './icons/XIcon';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructions = [
  {
    title: 'Welcome to Wordflow!',
    content: "The goal is simple: write. Don't worry about perfection, just keep the words flowing for the entire session to build your writing habit.",
  },
  {
    title: 'How Scoring Works',
    content: 'You earn points for every word. Discovering new words and using longer words gives bonus points. The key is the multiplier: it grows as you write and shrinks when you pause. Stay in the flow to maximize your score!',
  },
  {
    title: 'Flow, Not Fluff',
    content: 'The system is designed to encourage real writing. Mashing the keyboard or repeating the same word over and over again won\'t increase your score.',
  },
  {
    title: 'AI Insights & Saving',
    content: 'After each round, get private AI insights. Your writing is never saved on our servers. To keep your work, use the download or copy buttons on the results screen before starting over.',
  },
];

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      // Reset to first page when closed
      setTimeout(() => setCurrentPage(0), 300);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, instructions.length - 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="relative bg-gray-800 border border-indigo-700/50 rounded-2xl shadow-2xl w-11/12 max-w-lg p-6 text-white transform transition-all duration-300 ease-in-out scale-95 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close instructions">
            <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4">{instructions[currentPage].title}</h2>
            <p className="text-gray-300 min-h-[100px]">{instructions[currentPage].content}</p>
        </div>
        
        <div className="flex items-center justify-between mt-6">
            <button onClick={handlePrev} disabled={currentPage === 0} className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
                {instructions.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-colors ${currentPage === index ? 'bg-indigo-400' : 'bg-gray-600'}`}></div>
                ))}
            </div>
            <button onClick={handleNext} disabled={currentPage === instructions.length - 1} className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
       <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
          @keyframes modalEnter { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          .animate-modal-enter { animation: modalEnter 0.3s ease-out forwards; }
       `}</style>
    </div>
  );
};

export default InstructionsModal;