
import React, { useState } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { InfoIcon } from './icons/InfoIcon';
import InstructionsModal from './InstructionsModal';

interface WelcomeScreenProps {
  onStart: () => void;
  streak: number;
  selectedDuration: number;
  onDurationChange: (durationInSeconds: number) => void;
}

const DURATION_OPTIONS = [2, 5, 10, 15, 20, 25, 30]; // In minutes

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, streak, selectedDuration, onDurationChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border border-indigo-700/50 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4">
          Wordflow
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          The game that's not about good writing, but about the habit of writing. Just let the words flow.
        </p>
        <div className="mb-6">
          <p className="text-2xl text-amber-400">Current Streak</p>
          <p className="text-6xl font-bold text-amber-300 animate-pulse">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
        </div>
        
        <div className="mb-8">
            <p className="text-lg text-gray-300 mb-3">Choose your session length:</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {DURATION_OPTIONS.map((minutes) => {
                    const durationInSeconds = minutes * 60;
                    const isSelected = selectedDuration === durationInSeconds;
                    return (
                        <button
                            key={minutes}
                            onClick={() => onDurationChange(durationInSeconds)}
                            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105
                                ${isSelected 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'
                                }`}
                        >
                            {minutes} min
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                onClick={onStart}
                className="group w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-lg hover:shadow-indigo-500/50"
            >
                <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <PlayIcon className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative">Start Writing</span>
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
                aria-label="How to play"
            >
                <InfoIcon className="w-6 h-6"/>
                <span>How to Play</span>
            </button>
        </div>
      </div>
      <InstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WelcomeScreen;
