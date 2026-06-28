import React, { createContext, useContext, useReducer } from 'react'
import type { AppState, GameAction } from '@/types/game'
import { letterPuzzles, animalPuzzles, memoryPairs, riddleItems, riddleAssetIds, shopItemCosts } from '@/data/gameData'
import { shuffleArray } from '@/lib/utils'

const GROUP_QUESTION_COUNT = 3

function buildMemoryDeck(pairCount: number) {
  const selectedPairs = shuffleArray(memoryPairs).slice(0, pairCount)
  const cards = selectedPairs.flatMap((pair) => [
    { id: `${pair.pairId}-a`, pairId: pair.pairId, label: pair.label, image: pair.image, isFlipped: false, isMatched: false },
    { id: `${pair.pairId}-b`, pairId: pair.pairId, label: pair.label, image: pair.image, isFlipped: false, isMatched: false },
  ])
  return shuffleArray(cards)
}

function buildLetterDeck(groupCount: number) {
  const total = groupCount * GROUP_QUESTION_COUNT * 2
  const pool = shuffleArray(letterPuzzles)
  const deck: AppState['game1Deck'] = []
  let index = 0

  while (deck.length < total) {
    const base = pool[index % pool.length]
    const options = shuffleArray(base.options)
    deck.push({
      ...base,
      options,
    })
    index += 1
  }

  return deck
}

function buildAnimalDeck(groupCount: number) {
  const total = groupCount * GROUP_QUESTION_COUNT * 2
  const pool = shuffleArray(animalPuzzles)
  const deck: AppState['game2Deck'] = []
  let index = 0

  while (deck.length < total) {
    const base = pool[index % pool.length]
    const options = shuffleArray(base.options)
    deck.push({
      ...base,
      options,
    })
    index += 1
  }

  return deck
}

function buildRiddleDeck() {
  const selectedTargets = shuffleArray(riddleItems).slice(0, Math.min(100, riddleItems.length))

  const deck: AppState['game4Deck'] = selectedTargets.map((target, index) => {
    const sameCategory = shuffleArray(
      riddleItems.filter((item) => item.category === target.category && item.id !== target.id),
    ).slice(0, 3)
    const options = shuffleArray([target, ...sameCategory])
    const imageAsset = riddleAssetIds.has(target.id)
      ? `/assets/riddle/${target.id}.svg`
      : '/animal-lion.png'

    return {
      id: `riddle-${index + 1}-${target.id}`,
      imageAsset,
      correctAnswerId: target.id,
      options,
    }
  })

  return shuffleArray(deck)
}

const initialState: AppState = {
  view: 'landing',
  teams: [],
  activeTeamIndex: 0,
  currentPuzzleIndex: 0,
  currentGroupIndex: 0,
  currentGroupQuestionIndex: 0,
  groupCount: 3,
  matchHalf: 1,
  game1Deck: [],
  game2Deck: [],
  game4Deck: [],
  memoryDeck: [],
  memorySelection: [],
  memoryDifficulty: null,
  isAnimating: false,
  teacherPanelOpen: false,
  soundEnabled: true,
  game1Completed: false,
  game2Completed: false,
  game4Completed: false,
  memoryCompleted: false,
  selectedAnswer: null,
  showHint: false,
  lastAnswerCorrect: null,
}

function gameReducer(state: AppState, action: GameAction): AppState {
  switch (action.type) {
    case 'START_SETUP':
      return {
        ...state,
        view: 'setup',
        teams: [],
        activeTeamIndex: 0,
        currentPuzzleIndex: 0,
        currentGroupIndex: 0,
        currentGroupQuestionIndex: 0,
        groupCount: 3,
        matchHalf: 1,
        game1Deck: [],
        game2Deck: [],
        game4Deck: [],
        game1Completed: false,
        game2Completed: false,
        game4Completed: false,
        selectedAnswer: null,
        showHint: false,
        lastAnswerCorrect: null,
      }

    case 'START_GAME': {
      const newTeams = action.payload.teams.map((team, idx) => ({
        id: `team-${idx + 1}`,
        name: team.name,
        score: 0,
        avatar: team.avatar,
        coins: 0,
        color: team.color,
        accessories: [],
      }))
      return {
        ...state,
        view: 'game-hub',
        teams: newTeams,
        activeTeamIndex: 0,
        currentPuzzleIndex: 0,
        currentGroupIndex: 0,
        currentGroupQuestionIndex: 0,
        groupCount: Math.max(1, action.payload.groupCount),
        matchHalf: 1,
        game1Deck: buildLetterDeck(action.payload.groupCount),
        game2Deck: buildAnimalDeck(action.payload.groupCount),
        game4Deck: buildRiddleDeck(),
        memoryDeck: [],
        memoryDifficulty: null,
        memorySelection: [],
        game1Completed: false,
        game2Completed: false,
        game4Completed: false,
        memoryCompleted: false,
        selectedAnswer: null,
        showHint: false,
        lastAnswerCorrect: null,
      }
    }

    case 'SELECT_GAME':
      return {
        ...state,
        view:
          action.payload.game === 'game1'
            ? 'game1'
            : action.payload.game === 'game2'
            ? 'game2'
            : action.payload.game === 'game3'
            ? 'game3'
            : 'game4',
        currentPuzzleIndex: 0,
        currentGroupIndex: 0,
        currentGroupQuestionIndex: 0,
        memorySelection: [],
        matchHalf: 1,
        selectedAnswer: null,
        showHint: false,
        lastAnswerCorrect: null,
        // Reset memory game state so it always starts fresh
        ...(action.payload.game === 'game3' && {
          memoryDeck: [],
          memoryDifficulty: null,
          memoryCompleted: false,
        }),
      }

    case 'NEXT_PUZZLE': {
      const totalQuestions =
        state.view === 'game1'
          ? state.game1Deck.length
          : state.view === 'game2'
          ? state.game2Deck.length
          : state.view === 'game4'
          ? state.game4Deck.length
          : state.groupCount * GROUP_QUESTION_COUNT * 2
      const nextOverall = state.currentPuzzleIndex + 1
      let nextGroupQuestionIndex = state.currentGroupQuestionIndex + 1
      let nextGroupIndex = state.currentGroupIndex
      let nextHalf = state.matchHalf
      let completed = false

      if (nextGroupQuestionIndex >= GROUP_QUESTION_COUNT) {
        nextGroupQuestionIndex = 0
        if (nextGroupIndex + 1 >= state.groupCount) {
          if (state.matchHalf === 1) {
            nextHalf = 2
            nextGroupIndex = 0
          } else {
            completed = true
          }
        } else {
          nextGroupIndex += 1
        }
      }

      if (completed || nextOverall >= totalQuestions) {
        return {
          ...state,
          view: 'game-hub',
          currentPuzzleIndex: 0,
          currentGroupIndex: 0,
          currentGroupQuestionIndex: 0,
          matchHalf: 1,
          [state.view === 'game1'
            ? 'game1Completed'
            : state.view === 'game2'
            ? 'game2Completed'
            : 'game4Completed']: true,
          selectedAnswer: null,
          lastAnswerCorrect: null,
          showHint: false,
        }
      }

      return {
        ...state,
        currentPuzzleIndex: nextOverall,
        currentGroupIndex: nextGroupIndex,
        currentGroupQuestionIndex: nextGroupQuestionIndex,
        matchHalf: nextHalf,
        selectedAnswer: null,
        lastAnswerCorrect: null,
        showHint: false,
      }
    }

    case 'ANSWER_SELECTED':
      return {
        ...state,
        selectedAnswer: action.payload.answer,
      }

    case 'ANSWER_CORRECT': {
      const newTeams = [...state.teams]
      const points = action.payload?.points ?? (state.view === 'game1' ? 10 : state.view === 'game2' ? 15 : 20)
      newTeams[state.activeTeamIndex] = {
        ...newTeams[state.activeTeamIndex],
        score: newTeams[state.activeTeamIndex].score + points,
      }
      return {
        ...state,
        teams: newTeams,
        lastAnswerCorrect: true,
      }
    }

    case 'ANSWER_INCORRECT':
      return {
        ...state,
        lastAnswerCorrect: false,
      }

    case 'SWITCH_TEAM':
      return {
        ...state,
        activeTeamIndex:
          state.teams.length > 0
            ? (state.activeTeamIndex + 1) % state.teams.length
            : 0,
        selectedAnswer: null,
        lastAnswerCorrect: null,
      }

    case 'SELECT_MEMORY_CARD': {
      if (state.memoryCompleted) return state
      const selected = state.memorySelection
      const cardId = action.payload.cardId
      if (selected.includes(cardId)) return state

      const nextSelection = [...selected, cardId]
      let nextDeck = state.memoryDeck.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card,
      )
      let nextState: AppState = {
        ...state,
        memoryDeck: nextDeck,
        memorySelection: nextSelection,
      }

      if (nextSelection.length === 2) {
        const [firstId, secondId] = nextSelection
        const firstCard = nextDeck.find((card) => card.id === firstId)
        const secondCard = nextDeck.find((card) => card.id === secondId)

        if (firstCard && secondCard) {
          if (firstCard.pairId === secondCard.pairId) {
            nextDeck = nextDeck.map((card) =>
              card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card,
            )
            nextState = {
              ...nextState,
              memoryDeck: nextDeck,
              memorySelection: [],
              teams: state.teams.map((team, idx) =>
                idx === state.activeTeamIndex
                  ? { ...team, score: team.score + 10 }
                  : team,
              ),
            }
            const isComplete = nextDeck.every((card) => card.isMatched)
            if (isComplete) {
              nextState.memoryCompleted = true
            }
          } else {
            nextState = {
              ...nextState,
              memorySelection: nextSelection,
            }
          }
        }
      }

      return nextState
    }

    case 'RESET_MEMORY_SELECTION': {
      return {
        ...state,
        memoryDeck: state.memoryDeck.map((card) =>
          card.isMatched ? card : { ...card, isFlipped: false },
        ),
        memorySelection: [],
      }
    }

    case 'TOGGLE_PANEL':
      return {
        ...state,
        teacherPanelOpen: !state.teacherPanelOpen,
      }

    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      }

    case 'SHOW_HINT':
      return {
        ...state,
        showHint: true,
      }

    case 'GO_TO_SOUK': {
      const newTeams = state.teams.map((team) => ({
        ...team,
        coins: Math.floor(team.score / 5),
      }))
      return {
        ...state,
        view: 'souk',
        teams: newTeams,
      }
    }

    case 'BUY_ITEM': {
      const { itemId, teamIndex } = action.payload
      const newTeams = [...state.teams]
      const cost = shopItemCosts[itemId] || 10
      if (newTeams[teamIndex]?.coins >= cost && !newTeams[teamIndex]?.accessories.includes(itemId)) {
        newTeams[teamIndex] = {
          ...newTeams[teamIndex],
          coins: newTeams[teamIndex].coins - cost,
          accessories: [...newTeams[teamIndex].accessories, itemId],
        }
      }
      return { ...state, teams: newTeams }
    }

    case 'SET_MEMORY_DIFFICULTY': {
      const pairCount = Math.floor(action.payload.cardCount / 2)
      return {
        ...state,
        memoryDifficulty: action.payload.cardCount,
        memoryDeck: buildMemoryDeck(pairCount),
        memorySelection: [],
        memoryCompleted: false,
      }
    }

    case 'RETURN_TO_HUB':
      return {
        ...state,
        view: 'game-hub',
        selectedAnswer: null,
        lastAnswerCorrect: null,
      }

    case 'RETURN_TO_SETUP':
      return {
        ...state,
        view: 'setup',
        selectedAnswer: null,
        lastAnswerCorrect: null,
      }

    case 'END_GAME':
      return {
        ...state,
        view: 'gameover',
      }

    case 'RESET_GAME':
      return {
        ...initialState,
        soundEnabled: state.soundEnabled,
      }

    default:
      return state
  }
}

interface GameContextType {
  state: AppState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
