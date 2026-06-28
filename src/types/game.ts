export type View = 'landing' | 'setup' | 'game-hub' | 'game1' | 'game2' | 'game3' | 'game4' | 'souk' | 'gameover';

export interface Team {
  id: string;
  name: string;
  score: number;
  avatar: string;
  coins: number;
  color: string;
  accessories: string[];
}

export interface LetterPuzzle {
  sequence: string[];
  correctAnswer: string;
  options: string[];
  hint: string;
}

export interface AnimalPuzzle {
  animalName: string;
  animalImage: string;
  correctLetter: string;
  fullWordTifinagh: string;
  fullWordLatin: string;
  options: string[];
  pronunciation: string;
}

export interface RiddleOption {
  id: string;
  tifinaghText: string;
  phoneticText: string;
  meaning: string;
  category: 'animal' | 'nature' | 'food';
}

export interface RiddleChallenge {
  id: string;
  imageAsset: string;
  correctAnswerId: string;
  options: RiddleOption[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'background' | 'accessory' | 'emote';
}

export interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
  image: string;
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
  game2Deck: AnimalPuzzle[];
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
  | { type: 'GO_TO_SOUK' }
  | { type: 'BUY_ITEM'; payload: { itemId: string; teamIndex: number } }
  | { type: 'RETURN_TO_HUB' }
  | { type: 'RETURN_TO_SETUP' }
  | { type: 'END_GAME' };
