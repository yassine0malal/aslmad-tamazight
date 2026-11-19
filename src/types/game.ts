export type View = 'landing' | 'setup' | 'game-hub' | 'game1' | 'game2' | 'game3' | 'game4' | 'gameover';

export interface Team {
  id: string;
  name: string;
  score: number;
  avatar: string;
  color: string;
}

export type VocabularyCategory = 'people' | 'school' | 'body' | 'colors' | 'subjects' | 'season' | 'animals';

export interface LetterPuzzle {
  sequence: string[];
  correctAnswer: string;
  options: string[];
  hint: string;
  wordTifinagh: string;
  meaning: string;
  emoji: string;
}

export interface WordPuzzle {
  id: string;
  wordTifinagh: string;
  wordArabic: string;
  wordLatin: string;
  emoji: string;
}

export interface RiddleOption {
  id: string;
  tifinaghText: string;
  phoneticText: string;
  meaning: string;
  category: VocabularyCategory;
  emoji: string;
}

export interface RiddleChallenge {
  id: string;
  correctAnswerId: string;
  options: RiddleOption[];
}

export interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface AppState {
  view: View;
  teams: Team[];
  activeTeamIndex: number;
  currentPuzzleIndex: number;
  currentGroupIndex: number;
  currentGroupQuestionIndex: number;
  groupCount: number;
  matchHalf: 1 | 2;
  game1Deck: LetterPuzzle[];
  game2Deck: WordPuzzle[];
  game4Deck: RiddleChallenge[];
  memoryDeck: MemoryCard[];
  memorySelection: string[];
  memoryDifficulty: number | null;
  isAnimating: boolean;
  teacherPanelOpen: boolean;
  soundEnabled: boolean;
  game1Completed: boolean;
  game2Completed: boolean;
  game4Completed: boolean;
  memoryCompleted: boolean;
  selectedAnswer: string | null;
  showHint: boolean;
  lastAnswerCorrect: boolean | null;
}

export type TeamSetupPayload = {
  name: string;
  color: string;
  avatar: string;
}

export type GameAction =
  | { type: 'START_SETUP' }
  | { type: 'START_GAME'; payload: { teams: TeamSetupPayload[]; groupCount: number } }
  | { type: 'SELECT_GAME'; payload: { game: 'game1' | 'game2' | 'game3' | 'game4' } }
  | { type: 'NEXT_PUZZLE' }
  | { type: 'SET_WORD_DECK'; payload: { wordSetId?: string } }
  | { type: 'SET_LETTER_DECK'; payload: { wordSetId?: string } }
  | { type: 'ANSWER_SELECTED'; payload: { answer: string } }
  | { type: 'ANSWER_CORRECT'; payload?: { points?: number } }
  | { type: 'ANSWER_INCORRECT' }
  | { type: 'SWITCH_TEAM' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SHOW_HINT' }
  | { type: 'SELECT_MEMORY_CARD'; payload: { cardId: string } }
  | { type: 'RESET_MEMORY_SELECTION' }
  | { type: 'SET_MEMORY_DIFFICULTY'; payload: { cardCount: number } }
  | { type: 'RESET_GAME' }
  | { type: 'RETURN_TO_HUB' }
  | { type: 'RETURN_TO_SETUP' }
  | { type: 'END_GAME' };
