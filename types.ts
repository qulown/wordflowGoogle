
export enum GameState {
  WELCOME,
  WRITING,
  RESULTS,
}

export interface ScoreDetails {
  score: number;
  words: number;
  uniqueWords: number;
  multiplier: number;
}

export interface GeminiAnalysis {
    summary: string;
    sentiment: string;
    stats: {
        name: string;
        value: string;
    }[];
    interestingWords: string[];
}
