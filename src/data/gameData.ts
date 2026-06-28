import { shuffleArray } from '@/lib/utils'
import type { LetterPuzzle, AnimalPuzzle, RiddleOption, ShopItem } from '@/types/game'

const TIFINAGH_LETTERS = [
  'ⴰ', 'ⴱ', 'ⴳ', 'ⴷ', 'ⴹ', 'ⴻ', 'ⴼ', 'ⴽ', 'ⵀ', 'ⵃ',
  'ⵄ', 'ⵅ', 'ⵇ', 'ⵉ', 'ⵊ', 'ⵍ', 'ⵎ', 'ⵏ', 'ⵐ', 'ⵒ',
  'ⵓ', 'ⵔ', 'ⵕ', 'ⵖ', 'ⵙ', 'ⵚ', 'ⵛ', 'ⵜ', 'ⵟ', 'ⵡ',
  'ⵢ', 'ⵣ', 'ⵥ', 'ⵯ',
]

const letterHints = [
  'اختر الحرف المناسب',
  'انظر إلى التتابع',
  'أين يقع الحرف التالي؟',
  'اختر الحرف الناقص',
  'تابع النمط',
  'لاحظ الفرق بين الحروف',
  'الحرف الصحيح منطقي هنا',
  'القاعدة واضحة، اختر الصحيح',
  'احذف الخيارات الخاطئة أولاً',
  'ابحث عن الحرف التالي في السلسلة',
]

const animalImagePaths = [
  '/animal-eagle.png',
  '/animal-monkey.png',
  '/animal-lion.png',
  '/animal-bear.png',
  '/animal-elephant.png',
  '/animal-fox.png',
  '/animal-butterfly.png',
  '/animal-fish.png',
]

const animalNameRoots = [
  'Ammar', 'Bougzem', 'Giter', 'Derna', 'Yeffer', 'Zerdas', 'Tafdalt', 'Cermen',
  'Aqerru', 'Ighlan', 'Ayyar', 'Timsar', 'Ammdan', 'Azwir',
]

/**
 * Known riddle SVG assets that exist in public/assets/riddle/
 * Each entry maps the asset name to its category, Arabic meaning, Tifinagh text, and phonetic text.
 */
export const riddleAssetDefinitions = [
  { id: 'ayrad', category: 'animal' as const, meaning: 'أسد', tifinaghText: 'ⴰⵢⵔⴰⴷ', phoneticText: 'ayrad' },
  { id: 'amuch', category: 'animal' as const, meaning: 'قط', tifinaghText: 'ⴰⵎⵓⵛ', phoneticText: 'amuch' },
  { id: 'aydi', category: 'animal' as const, meaning: 'كلب', tifinaghText: 'ⴰⵢⴷⵉ', phoneticText: 'aydi' },
  { id: 'amnal', category: 'animal' as const, meaning: 'جمل', tifinaghText: 'ⴰⵎⵏⴰⵍ', phoneticText: 'amnal' },
  { id: 'tadeffuyt', category: 'animal' as const, meaning: 'فراشة', tifinaghText: 'ⵜⴰⴷⴻⴼⴼⵓⵢⵜ', phoneticText: 'tadeffuyt' },
  { id: 'asklu', category: 'nature' as const, meaning: 'شجرة', tifinaghText: 'ⴰⵙⴽⵍⵓ', phoneticText: 'asklu' },
  { id: 'afra', category: 'nature' as const, meaning: 'غيمة', tifinaghText: 'ⴰⴼⵔⴰ', phoneticText: 'afra' },
  { id: 'adrar', category: 'nature' as const, meaning: 'جبل', tifinaghText: 'ⴰⴷⵔⴰⵔ', phoneticText: 'adrar' },
  { id: 'itri', category: 'nature' as const, meaning: 'نجم', tifinaghText: 'ⵉⵜⵔⵉ', phoneticText: 'itri' },
  { id: 'aghrum', category: 'food' as const, meaning: 'خبز', tifinaghText: 'ⴰⵖⵔⵓⵎ', phoneticText: 'aghrum' },
  { id: 'tafzelt', category: 'food' as const, meaning: 'جزر', tifinaghText: 'ⵜⴰⴼⵣⴻⵍⵜ', phoneticText: 'tafzelt' },
  { id: 'tamemt', category: 'food' as const, meaning: 'عسل', tifinaghText: 'ⵜⴰⵎⴻⵎⵜ', phoneticText: 'tamemt' },
]

export const riddleAssetIds = new Set(riddleAssetDefinitions.map((a) => a.id))

const riddleBaseMeanings = {
  animal: [
    'أسد', 'قط', 'كلب', 'جمل', 'نمر', 'فيل', 'ثعلب', 'دب', 'قرد', 'حصان', 'زرافة', 'سمك',
    'طاووس', 'عقاب', 'أرنب', 'بقرة', 'ماعز', 'خروف', 'دجاجة', 'بطة', 'نحلة', 'عصفور',
    'سنجاب', 'ضفدع', 'غزال', 'سلحفاة', 'تمساح', 'وحيد القرن', 'قرش', 'بطريق', 'بومة',
    'صقر', 'ديك', 'سلمندر',
  ],
  nature: [
    'شجرة', 'جبل', 'نهر', 'بحر', 'صحراء', 'سماء', 'نجم', 'قمر', 'قوس قزح', 'ورد', 'عشب',
    'صخرة', 'رمل', 'ندى', 'أمطار', 'ثلج', 'رعد', 'برق', 'قطرة', 'غيمة', 'شمس', 'طين',
    'بركان', 'شلال', 'غابة', 'سهل', 'وادي', 'غصن', 'أرض', 'أزهار', 'تربة', 'كثبان',
  ],
  food: [
    'خبز', 'تفاح', 'جزر', 'عسل', 'تمر', 'لحم', 'سمك', 'جبن', 'لبن', 'زيت', 'سكر',
    'قهوة', 'شاي', 'عنب', 'برتقال', 'ليمون', 'موز', 'رمان', 'فلفل', 'ملح', 'أرز',
    'حساء', 'عصير', 'بندورة', 'خيار', 'طحين', 'بيض', 'كعك', 'مرق', 'لبنة', 'مربى',
    'كرنب', 'زيتون', 'مكرونة', 'شوربة',
  ],
}



function buildLetterPuzzles(count: number): LetterPuzzle[] {
  const puzzles: LetterPuzzle[] = []

  for (let i = 0; i < count; i += 1) {
    const start = i % (TIFINAGH_LETTERS.length - 3)
    const sequence = TIFINAGH_LETTERS.slice(start, start + 3)
    const correctAnswer = TIFINAGH_LETTERS[(start + 3) % TIFINAGH_LETTERS.length]
    const wrongLetters = TIFINAGH_LETTERS.filter((item) => item !== correctAnswer)
    const options = shuffleArray([correctAnswer, ...wrongLetters.slice(0, 3)])

    puzzles.push({
      sequence,
      correctAnswer,
      options,
      hint: letterHints[i % letterHints.length],
    })
  }

  return puzzles
}

function buildAnimalPuzzles(count: number): AnimalPuzzle[] {
  const puzzles: AnimalPuzzle[] = []

  for (let i = 0; i < count; i += 1) {
    const root = animalNameRoots[i % animalNameRoots.length]
    const suffix = Math.floor(i / animalNameRoots.length) + 1
    const animalName = suffix > 1 ? `${root}${suffix}` : root
    const correctLetter = TIFINAGH_LETTERS[i % TIFINAGH_LETTERS.length]
    const wrongLetters = TIFINAGH_LETTERS.filter((item) => item !== correctLetter)
    const options = shuffleArray([correctLetter, ...wrongLetters.slice(0, 3)])
    const rest = wrongLetters.slice(0, 4 + (i % 3))
    const fullWordTifinagh = [correctLetter, ...rest].join('')

    puzzles.push({
      animalName,
      animalImage: animalImagePaths[i % animalImagePaths.length],
      correctLetter,
      fullWordTifinagh,
      fullWordLatin: animalName,
      options,
      pronunciation: animalName.toLowerCase(),
    })
  }

  return puzzles
}

function buildMemoryPairs(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    pairId: `memory-${index + 1}`,
    label: Array.from({ length: 5 }, (_, offset) => TIFINAGH_LETTERS[(index + offset) % TIFINAGH_LETTERS.length]).join(''),
    image: animalImagePaths[index % animalImagePaths.length],
  }))
}

function buildRiddleItems(count: number): RiddleOption[] {
  const categories: Array<'animal' | 'nature' | 'food'> = ['animal', 'nature', 'food']
  const items: RiddleOption[] = []

  // First, add the known assets with proper SVG images
  for (const asset of riddleAssetDefinitions) {
    items.push({
      id: asset.id,
      tifinaghText: asset.tifinaghText,
      phoneticText: asset.phoneticText,
      meaning: asset.meaning,
      category: asset.category,
    })
  }

  // Then generate additional items to reach the desired count
  for (let i = riddleAssetDefinitions.length; i < count; i += 1) {
    const category = categories[i % categories.length]
    const baseMeanings = riddleBaseMeanings[category]
    const baseIndex = Math.floor(i / categories.length) % baseMeanings.length
    const baseMeaning = baseMeanings[baseIndex]
    const suffix = Math.floor(i / (categories.length * baseMeanings.length)) + 1
    const meaning = suffix > 1 ? `${baseMeaning} ${suffix}` : baseMeaning
    const id = `${category}-${i + 1}`
    const tifinaghText = Array.from({ length: 4 }, (_, offset) => TIFINAGH_LETTERS[(i + offset) % TIFINAGH_LETTERS.length]).join('')
    const phoneticText = `${category.slice(0, 2)}-${i + 1}`

    items.push({
      id,
      tifinaghText,
      phoneticText,
      meaning,
      category,
    })
  }

  return items
}

export const riddleItems: RiddleOption[] = buildRiddleItems(120)
export const letterPuzzles: LetterPuzzle[] = buildLetterPuzzles(120)
export const animalPuzzles: AnimalPuzzle[] = buildAnimalPuzzles(120)
export const shopItemCosts: Record<string, number> = {
  'carpet-backdrop': 10,
  'silver-crown': 15,
  'djellaba-cape': 12,
  'drum-emote': 8,
  'tea-set': 10,
  'souk-lantern': 12,
}

export const shopItems: ShopItem[] = [
  { id: 'carpet-backdrop', name: 'Tapis Amazigh', description: 'Un fond traditionnel pour votre avatar', cost: 10, icon: '', category: 'background' },
  { id: 'silver-crown', name: 'Tazarshit', description: 'Couronne d\'argent traditionnelle', cost: 15, icon: '', category: 'accessory' },
  { id: 'djellaba-cape', name: 'Djellaba', description: 'Cape traditionnelle coloree', cost: 12, icon: '', category: 'accessory' },
  { id: 'drum-emote', name: 'Bendir', description: 'Emote avec tambour', cost: 8, icon: '', category: 'emote' },
  { id: 'tea-set', name: 'Atay', description: 'Service a the marocain', cost: 10, icon: '', category: 'accessory' },
  { id: 'souk-lantern', name: 'Fanous', description: 'Lanterne du souk', cost: 12, icon: '', category: 'background' },
]
export const memoryPairs = buildMemoryPairs(100)

export const tifinaghToLatin: Record<string, string> = {
  'ⴰ': 'ya', 'ⴱ': 'yab', 'ⴳ': 'yag', 'ⴷ': 'yad',
  'ⴹ': 'yaḍ', 'ⴻ': 'yey', 'ⴼ': 'yaf', 'ⴽ': 'yak',
  'ⵀ': 'yah', 'ⵃ': 'yaḥ', 'ⵄ': 'yae', 'ⵅ': 'yax',
  'ⵇ': 'yaq', 'ⵉ': 'yi', 'ⵊ': 'yaj', 'ⵍ': 'yal',
  'ⵎ': 'yam', 'ⵏ': 'yan', 'ⵐ': 'yu', 'ⵒ': 'yar',
  'ⵓ': 'yaw', 'ⵔ': 'yas', 'ⵕ': 'yas', 'ⵖ': 'yac',
  'ⵙ': 'yat', 'ⵚ': 'yav', 'ⵛ': 'yac', 'ⵜ': 'yat',
  'ⵟ': 'yat', 'ⵡ': 'yay', 'ⵢ': 'yay', 'ⵣ': 'yaz',
  'ⵥ': 'yaz', 'ⵯ': 'yar',
}
