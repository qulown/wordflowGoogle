import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScoreDetails } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

interface WritingScreenProps {
  onRoundEnd: (text: string, score: number) => void;
  duration: number; // in seconds
}

const WritingScreen: React.FC<WritingScreenProps> = ({ onRoundEnd, duration }) => {
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails>({
    score: 0,
    words: 0,
    uniqueWords: 0,
    multiplier: 1,
  });

  const uniqueWordsSet = useRef(new Set<string>());
  const lastInteractionTime = useRef(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Refs to hold the latest values for the timer callback to avoid stale closures
  const textRef = useRef(text);
  const scoreRef = useRef(scoreDetails.score);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    scoreRef.current = scoreDetails.score;
  }, [scoreDetails.score]);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
        setText(prev => prev ? `${prev} ${transcript}` : transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const calculateScore = useCallback((currentText: string) => {
    const words = currentText.toLowerCase().match(/\b(\w+)\b/g) || [];
    let newScore = 0;
    let newUniqueWords = 0;
    const currentUniqueWords = new Set<string>();

    // Anti-cheat: check for keyboard mashing
    const nonAlphaNumeric = currentText.replace(/[\w\s]/g, '').length;
    if (nonAlphaNumeric / currentText.length > 0.4 && currentText.length > 20) {
      return; // Stop scoring if it looks like mashing
    }

    words.forEach(word => {
      // Anti-cheat: ignore short words and simple repetitions
      if (word.length < 2) return;
      
      const isNew = !uniqueWordsSet.current.has(word);
      if (isNew) {
        newScore += 10 + Math.min(word.length, 10); // Base points + length bonus
        newUniqueWords++;
        uniqueWordsSet.current.add(word);
      } else {
        newScore += 1; // Small points for reuse
      }
      currentUniqueWords.add(word);
    });

    setScoreDetails(prev => ({
      ...prev,
      score: Math.floor(newScore * prev.multiplier),
      words: words.length,
      uniqueWords: currentUniqueWords.size,
    }));
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    calculateScore(newText);
    lastInteractionTime.current = Date.now();
    setScoreDetails(prev => ({ ...prev, multiplier: Math.min(prev.multiplier + 0.05, 5) }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRoundEnd(textRef.current, scoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRoundEnd]);

  useEffect(() => {
    const multiplierDecay = setInterval(() => {
      if (Date.now() - lastInteractionTime.current > 2000) {
        setScoreDetails(prev => ({ ...prev, multiplier: Math.max(1, prev.multiplier * 0.95) }));
      }
    }, 500);
    return () => clearInterval(multiplierDecay);
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col h-[85vh] bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-indigo-700/50 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-sm text-indigo-300">Time Left</p>
          <p className="text-2xl font-bold text-white">{formatTime(timeLeft)}</p>
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-sm text-purple-300">Score</p>
          <p className="text-2xl font-bold text-white">{scoreDetails.score.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-sm text-teal-300">Words</p>
          <p className="text-2xl font-bold text-white">{scoreDetails.words}</p>
        </div>
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <p className="text-sm text-amber-300">Multiplier</p>
          <p className="text-2xl font-bold text-white">x{scoreDetails.multiplier.toFixed(2)}</p>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        className="flex-grow w-full bg-gray-900/70 p-4 rounded-lg text-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed tracking-wide font-serif"
        placeholder="Start writing here..."
        autoFocus
      />
      <div className="mt-4 flex justify-center">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-6 py-3 rounded-full flex items-center font-semibold transition-colors duration-300 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isListening ? (
            <>
              <StopIcon className="w-6 h-6 mr-2 animate-pulse"/> Stop Dictation
            </>
          ) : (
             <>
              <MicrophoneIcon className="w-6 h-6 mr-2" /> Start Dictation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WritingScreen;