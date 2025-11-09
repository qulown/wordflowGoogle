import React, { useState } from 'react';
import { downloadTextFile, downloadMarkdownFile } from '../utils/fileUtils';
import { getWritingAnalysis } from '../services/geminiService';
import { GeminiAnalysis } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { CopyIcon } from './icons/CopyIcon';

interface ResultsScreenProps {
  text: string;
  score: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ text, score, onPlayAgain, onMainMenu }) => {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getWritingAnalysis(text);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }, (err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-indigo-700/50 animate-fade-in">
      <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2">Round Complete!</h2>
      <p className="text-center text-2xl text-amber-300 mb-6">Final Score: {score.toLocaleString()}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="max-h-96">
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Your Text</h3>
          <div className="bg-gray-900/70 p-4 rounded-lg h-full overflow-y-auto font-serif text-gray-300">
            {text || <span className="italic text-gray-500">You didn't write anything this round.</span>}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Flow Analysis</h3>
          <div className="bg-gray-900/70 p-4 rounded-lg h-full">
            {isLoading && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div></div>}
            {error && <p className="text-red-400">{error}</p>}
            {analysis && (
              <div className="space-y-4 text-gray-300 animate-fade-in">
                <p><strong className="text-indigo-300">Summary:</strong> {analysis.summary}</p>
                <p><strong className="text-indigo-300">Sentiment:</strong> <span className="font-semibold">{analysis.sentiment}</span></p>
                <div>
                  <strong className="text-indigo-300">Stats:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {analysis.stats.map(stat => <li key={stat.name}><strong>{stat.name}:</strong> {stat.value}</li>)}
                  </ul>
                </div>
                 <div>
                  <strong className="text-indigo-300">Interesting Words:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.interestingWords.map(word => <span key={word} className="bg-purple-600/50 px-2 py-1 rounded-md text-sm">{word}</span>)}
                  </div>
                </div>
              </div>
            )}
            {!analysis && !isLoading && !error && (
              <div className="flex flex-col justify-center items-center h-full text-center">
                 <p className="text-gray-400 mb-4">Get AI-powered insights on your writing flow.</p>
                <button
                  onClick={handleAnalyze}
                  disabled={!text}
                  className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <AnalyzeIcon className="w-5 h-5 mr-2" />
                  Analyze My Flow
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
        <button onClick={onPlayAgain} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Play Again</button>
        <button onClick={onMainMenu} className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">Main Menu</button>
        <button
            onClick={handleCopyToClipboard}
            disabled={!text || isCopied}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            <CopyIcon className="w-5 h-5 mr-2" />
            {isCopied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={() => downloadTextFile(text, 'wordflow-export.txt')} disabled={!text} className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-600"><DownloadIcon className="w-5 h-5 mr-2" /> .txt</button>
        <button onClick={() => downloadMarkdownFile(text, 'wordflow-export.md')} disabled={!text} className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-600"><DownloadIcon className="w-5 h-5 mr-2" /> .md</button>
      </div>
    </div>
  );
};

export default ResultsScreen;