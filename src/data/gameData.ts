import { shuffleArray } from '@/lib/utils'
import type { LetterPuzzle, WordPuzzle, RiddleOption } from '@/types/game'
import { vocabularyWords, type VocabularyWord } from '@/data/vocabularyData'

export const TIFINAGH_LETTERS = [
  'ⴰ', 'ⴱ', 'ⴳ', 'ⴷ', 'ⴹ', 'ⴻ', 'ⴼ', 'ⴽ', 'ⵀ', 'ⵃ',
  'ⵄ', 'ⵅ', 'ⵇ', 'ⵉ', 'ⵊ', 'ⵍ', 'ⵎ', 'ⵏ',
  'ⵓ', 'ⵔ', 'ⵕ', 'ⵖ', 'ⵙ', 'ⵚ', 'ⵛ', 'ⵜ', 'ⵟ', 'ⵡ',
  'ⵢ', 'ⵣ', 'ⵥ',
]

/** Every letter that appears in the reference vocabulary. */
const vocabularyLetters = Array.from(
  new Set(vocabularyWords.flatMap((word) => Array.from(word.tifinagh))),
)

/**
 * Each puzzle is an actual word from the reference material shown whole
 * except for its last letter: the player picks the missing last letter.
 * `words` limits which words become puzzles (a teacher-chosen set).
 */
export function buildLetterPuzzles(words: VocabularyWord[] = vocabularyWords): LetterPuzzle[] {
  const puzzles: LetterPuzzle[] = []

  for (const word of words) {
    const chars = Array.from(word.tifinagh)
    if (chars.length < 2) continue

    const correctAnswer = chars[chars.length - 1]
    const distractors = shuffleArray(
      vocabularyLetters.filter((letter) => letter !== correctAnswer),
    ).slice(0, 3)

    puzzles.push({
      sequence: chars.slice(0, -1),
      correctAnswer,
      options: [correctAnswer, ...distractors],
      hint: `الكلمة تعني «${word.arabic}»`,
      wordTifinagh: word.tifinagh,
      meaning: word.arabic,
      emoji: word.emoji,
    })
  }

  return puzzles
}

function buildWordPuzzles(): WordPuzzle[] {
  return vocabularyWords.map((word) => ({
    id: word.id,
    wordTifinagh: word.tifinagh,
    wordArabic: word.arabic,
    wordLatin: word.latin,
    emoji: word.emoji,
  }))
}

function buildMemoryPairs() {
  return vocabularyWords.map((word) => ({
    pairId: `memory-${word.id}`,
    label: word.tifinagh,
    emoji: word.emoji,
  }))
}

function buildRiddleItems(): RiddleOption[] {
  return vocabularyWords.map((word) => ({
    id: word.id,
    tifinaghText: word.tifinagh,
    phoneticText: word.latin,
    meaning: word.arabic,
    category: word.category,
    emoji: word.emoji,
  }))
}

export const riddleItems: RiddleOption[] = buildRiddleItems()
export const letterPuzzles: LetterPuzzle[] = buildLetterPuzzles()
export const wordPuzzles: WordPuzzle[] = buildWordPuzzles()
export const memoryPairs = buildMemoryPairs()

