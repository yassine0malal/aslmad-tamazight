/**
 * Fixed word sets the teacher can pick before playing «مباراة الكلمات».
 * Each word is matched against `vocabularyWords` by its Tifinagh spelling,
 * so the Arabic meaning, Latin spelling and picture come from one source.
 */
export type WordSet = {
  id: string
  title: string
  description: string
  emoji: string
  /** Tifinagh spellings, in the order the teacher defined them. */
  words: string[]
}

export const wordSets: WordSet[] = [
  {
    id: 'basic-words',
    title: 'المجموعة الأولى',
    description: 'قائمة المفردات الأساسية كاملةً (33 كلمة)',
    emoji: '📚',
    words: [
      'ⴰⵏⵍⵎⴰⴷ',
      'ⴰⵙⵉⵔⴰ',
      'ⵜⴰⴷⴰⵍⴰ',
      'ⵜⴰⵙⵍⵎⴰⴷⵜ',
      'ⴰⵙⵍⵎⴰⴷ',
      'ⵜⵉⵏⵎⵍ',
      'ⵜⵉⵟⵟⴰⵡⵉⵏ',
      'ⴰⴹⴰⴹ',
      'ⴰⴷⵍⵉⵙ',
      'ⴰⵍⵓⴳ',
      'ⵜⴰⴷⵍⵉⵙⵜ',
      'ⴰⵏⴳⵎⵉⵔⵙ',
      'ⵜⴰⴷⴰⴱⵓⵜ',
      'ⵜⴰⵙⵏⴰ',
      'ⴰⵡⵔⴰⵖ',
      'ⴰⵣⴳⴳⵯⴰⵖ',
      'ⴰⵣⴳⵣⴰⵡ',
      'ⴰⴱⵔⴽⴰⵏ',
      'ⴰⵎⵍⵍⴰⵍ',
      'ⴰⵥⵕⵡⴰⵍ',
      'ⵜⴰⴼⵔⵉⵙⵜ',
      'ⵉⴽⵯⵍⴰⵏ',
      'ⴰⵎⵣⴳⵓⵏ',
      'ⵜⵓⵙⵏⴰⴽⵜ',
      'ⵜⵉⵎⴰⵙⵙⴰⵏⵉⵏ',
      'ⵜⵓⵏⵏⵓⵏⵜ',
      'ⴰⵚⵎⵎⵉⴹ',
      'ⴰⵔⴳⴰⵣ',
      'ⴰⵏⵥⴰⵕ',
      'ⵜⵉⵣⵍⵉⵜ',
      'ⵜⵉⵏⵣⴰⵔ',
      'ⵜⵉⴼⵉⵍⵜ',
      'ⵜⵉⴼⵍⵡⵉⵜ',
    ],
  },
  {
    id: 'animals',
    title: 'الحيوانات',
    description: 'حيوانات البيت والحقل والغابة المألوفة',
    emoji: '🐐',
    words: [
      'ⴰⵢⴷⵉ',
      'ⵉⴳⵣⵉⵏ',
      'ⴰⵎⵓⵛⵛ',
      'ⵜⴰⵎⵓⵛⵛⴰⵜ',
      'ⴰⵖⵢⵓⵍ',
      'ⴰⵢⵢⵉⵙ',
      'ⵜⴰⴳⵎⴰⵔⵜ',
      'ⵜⴰⴼⵓⵏⴰⵙⵜ',
      'ⵉⵣⵉⵎⵔ',
      'ⵜⴰⵖⴰⵟⵜ',
      'ⴰⴼⵓⵍⵍⵓⵙ',
      'ⵜⴰⴼⵓⵍⵍⵓⵙⵜ',
      'ⴰⵙⵍⵎ',
      'ⴰⴳⴹⵉⴹ',
      'ⵜⵉⵣⵉⵣⵡⵉⵜ',
      'ⴰⴱⴰⵖⵓⵖ',
      'ⴰⴳⵓⵍⵣ',
      'ⵉⵣⵎ',
      'ⴰⵖⵉⵍⴰⵙ',
      'ⵉⵍⵓ',
      'ⴰⵎⴷⵖ',
      'ⴰⵔⵄⴰⵎ',
      'ⴰⵇⵏⵉⵏ',
    ],
  },
]

export function getWordSet(id: string) {
  return wordSets.find((set) => set.id === id)
}
