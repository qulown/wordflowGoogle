
import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import WritingScreen from './components/WritingScreen';
import ResultsScreen from './components/ResultsScreen';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [lastRoundText, setLastRoundText] = useState<string>('');
  const [lastRoundScore, setLastRoundScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedDuration, setSelectedDuration] = useState<number>(300); // Default to 5 minutes (300 seconds)

  useEffect(() => {
    // Streak logic
    const savedStreak = localStorage.getItem('wordflow_streak');
    const lastVisit = localStorage.getItem('wordflow_last_visit');
    
    if (savedStreak && lastVisit) {
      const today = new Date().toDateString();
      const lastVisitDate = new Date(lastVisit).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toDateString();

      if (today !== lastVisitDate && yesterdayDate !== lastVisitDate) {
        setStreak(0);
        localStorage.setItem('wordflow_streak', '0');
      } else {
        setStreak(parseInt(savedStreak, 10));
      }
    }
    
    // Duration logic
    const savedDuration = localStorage.getItem('wordflow_duration');
    if (savedDuration) {
        setSelectedDuration(parseInt(savedDuration, 10));
    }

  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date();
    const lastVisit = localStorage.getItem('wordflow_last_visit');
    let currentStreak = streak;

    if (!lastVisit || new Date(lastVisit).toDateString() !== today.toDateString()) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit && new Date(lastVisit).toDateString() === yesterday.toDateString()) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      setStreak(currentStreak);
      localStorage.setItem('wordflow_streak', currentStreak.toString());
      localStorage.setItem('wordflow_last_visit', today.toISOString());
    }
  }, [streak]);

  const handleDurationChange = (durationInSeconds: number) => {
    setSelectedDuration(durationInSeconds);
    localStorage.setItem('wordflow_duration', durationInSeconds.toString());
  };

  const handleRoundEnd = (text: string, score: number) => {
    setLastRoundText(text);
    setLastRoundScore(score);
    setGameState(GameState.RESULTS);
    updateStreak();
  };

  const handlePlayAgain = () => {
    setGameState(GameState.WRITING);
  };
  
  const handleMainMenu = () => {
    setGameState(GameState.WELCOME);
  };

  const renderScreen = () => {
    switch (gameState) {
      case GameState.WRITING:
        return <WritingScreen onRoundEnd={handleRoundEnd} duration={selectedDuration} />;
      case GameState.RESULTS:
        return (
          <ResultsScreen
            text={lastRoundText}
            score={lastRoundScore}
            onPlayAgain={handlePlayAgain}
            onMainMenu={handleMainMenu}
          />
        );
      case GameState.WELCOME:
      default:
        return (
          <WelcomeScreen 
            onStart={() => setGameState(GameState.WRITING)} 
            streak={streak}
            selectedDuration={selectedDuration}
            onDurationChange={handleDurationChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
