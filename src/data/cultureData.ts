export interface CultureItem {
  id: string
  titleAr: string
  titleAm: string
  descriptionAm: string
  emoji: string
}

export const cultureItems: CultureItem[] = [
  {
    id: 'tazrbit',
    titleAr: 'زربية أمازيغية',
    titleAm: 'ⵜⴰⵣⵔⴱⵉⵜ',
    descriptionAm: 'ⵜⴰⵣⵔⴱⵉⵜ ⵜⴳⴰ ⵢⴰⵜ ⵙⴳ ⵜⵓⵙⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ ⵉⵇⴱⵓⵔⵏ. ⵜⵜⵓⵙⵎⵔⴰⵙ ⵙ ⵓⴼⵓⵙ ⵙ ⵓⵎⵢⴰⵏⴰⵔ ⴷ ⵉⴽⵯⵍⴰⵏ ⵉⵎⵢⴰⵏⴰⵔⵏ.',
    emoji: '🟠',
  },
  {
    id: 'tazrbit-2',
    titleAr: 'نقوش الزربية التقليدية',
    titleAm: 'ⵜⵉⵏⵎⵉⵢⵉⵏ ⵏ ⵜⵣⵔⴱⵉⵜ',
    descriptionAm: 'ⵜⵉⵏⵎⵉⵢⵉⵏ ⴰⴳⵉ ⵙⵏⵓⵍⴼⵓⵏⵜ ⴰⵎⵣⵔⵓⵢ ⴷ ⵜⵎⵓⵔⵜ ⵏ ⵉⵎⴰⵣⵉⵖⵏ.',
    emoji: '🔶',
  },
  {
    id: 'elhaik-berber',
    titleAr: 'الحايك البربري',
    titleAm: 'ⴰⵃⴰⵢⴽ ⴰⵎⴰⵣⵉⵖ',
    descriptionAm: 'ⴰⵃⴰⵢⴽ ⵉⴳⴰ ⵢⴰⵏ ⵓⵍⴱⵓⵙ ⴰⵎⴰⵣⵉⵖ ⴰⵇⴱⵓⵔ. ⵜⴻⵍⵍⴰ ⴷⵉⵙ ⵜⵉⵏⵎⵉⵢⵉⵏ ⵏ ⵜⵓⵙⵙⵏⴰ.',
    emoji: '👘',
  },
  {
    id: 'women-clothes',
    titleAr: 'ملابس النساء التقليدية',
    titleAm: 'ⴰⵍⴱⵓⵙ ⵏ ⵜⵎⵖⴰⵔⵉⵏ',
    descriptionAm: 'ⴰⵍⴱⵓⵙ ⴰⵎⴰⵣⵉⵖ ⵏ ⵜⵎⵖⴰⵔⵉⵏ ⵉⴳⴰ ⵢⴰⵏ ⵓⵣⵎⵣ ⵏ ⵜⵓⵙⵙⵏⴰ ⴷ ⵜⵖⴰⵔⴰⵙⵜ.',
    emoji: '👗',
  },
  {
    id: 'women-hijab',
    titleAr: 'الحجاب الأمازيغي',
    titleAm: 'ⴰⵃⵉⵊⴰⴱ ⴰⵎⴰⵣⵉⵖ',
    descriptionAm: 'ⵜⵉⵎⵖⴰⵔⵉⵏ ⵜⵉⵎⴰⵣⵉⵖⵉⵏ ⵍⵍⴰⵏⵜ ⵙ ⵓⵍⴱⵓⵙ ⵉⵥⵍⵉⵏ ⴷ ⵜⵓⵙⵙⵏⴰ.',
    emoji: '🧕',
  },
  {
    id: 'old-women-culture',
    titleAr: 'الحكمة عند النساء المسنات',
    titleAm: 'ⵜⵓⵎⵙⵜ ⵏ ⵜⵎⵖⴰⵔⵉⵏ',
    descriptionAm: 'ⵜⵉⵎⵖⴰⵔⵉⵏ ⵜⵉⵇⴱⵓⵔⵉⵏ ⴳⴰⵏⵜ ⵜⴰⵖⴰⵔⴰⵙⵜ ⵏ ⵜⵓⵙⵙⵏⴰ. ⴰⵔ ⵜⵜⵔⴰⵔⵏⵜ ⵉⵙⵙⵏⴼⵍⵓⵍⵏ ⵉ ⵜⵎⵢⵓⵔⵉⵏ.',
    emoji: '👵',
  },
  {
    id: 'free-people',
    titleAr: 'أحرار - ⵉⵎⴰⵣⵉⵖⵏ',
    titleAm: 'ⵉⵎⴰⵣⵉⵖⵏ',
    descriptionAm: 'ⵉⵎⴰⵣⵉⵖⵏ ⴷ ⵉⵎⵣⴷⴰⵖⵏ ⵉⵣⴰⵜⵔⵏ ⵏ ⵜⴼⵔⵉⵇⵜ ⵏ ⵓⴳⴰⴼⴰ. ⵉⵙⵎ ⵏⵏⵙⵏ ⵉⵍⴽⵎ ⵙⴳ ⵜⵍⴻⵍⵍⵉ.',
    emoji: '🤝',
  },
  {
    id: 'home',
    titleAr: 'البيت التقليدي',
    titleAm: 'ⵜⴰⴷⴷⴰⵔⵜ ⵜⴰⵇⴱⵓⵔⵜ',
    descriptionAm: 'ⵜⴰⴷⴷⴰⵔⵜ ⵜⴰⵇⴱⵓⵔⵜ ⵜⴳⴰ ⵢⴰⵏ ⵓⵏⴰⵡ ⵏ ⵜⵎⴰⴷⴷⴰⵙⵜ ⵉⵥⵍⵉⵏ ⵏ ⵉⵎⴰⵣⵉⵖⵏ.',
    emoji: '🏠',
  },
  {
    id: 'homes',
    titleAr: 'القرى الأمازيغية',
    titleAm: 'ⵜⵉⵎⵣⴰⵔ ⵜⵉⵎⴰⵣⵉⵖⵉⵏ',
    descriptionAm: 'ⵜⵉⵎⵣⴰⵔ ⵜⵉⵎⴰⵣⵉⵖⵉⵏ ⴳⴰⵏⵜ ⵉⵎⵣⴷⴰⵖⵏ ⵏ ⵉⵎⴰⵣⵉⵖⵏ ⵣⵉⴽⴽ. ⴰⵔ ⵙⵎⵔⴰⵙⵏ ⵜⵓⵙⵙⵏⴰ ⴷ ⵡⴰⵎⵎⵓⵙ.',
    emoji: '🏘️',
  },
  {
    id: 'argan',
    titleAr: 'شجرة الأركان',
    titleAm: 'ⴰⵔⴳⴰⵏ',
    descriptionAm: 'ⴰⵔⴳⴰⵏ ⵉⴳⴰ ⵢⴰⵏ ⵓⵙⴽⵍⵓ ⵉⵥⵍⵉⵏ ⵙ ⵜⵎⵓⵔⵜ ⵏ ⵍⵎⵖⵔⵉⴱ. ⵣⴳ ⵉⵖⵙⵙⴰⵏ ⵏⵏⵙ ⵜⵜⵢⴰⵡⵙⵎⵔⴰⵙ ⵓⴷⵉ ⵏ ⵓⵔⴳⴰⵏ.',
    emoji: '🌳',
  },
  {
    id: 'olive-oil',
    titleAr: 'زيت الزيتون',
    titleAm: 'ⵓⴷⵉ ⵏ ⵓⵣⵎⵎⵓⵔ',
    descriptionAm: 'ⵓⴷⵉ ⵏ ⵓⵣⵎⵎⵓⵔ ⵉⴳⴰ ⵢⴰⵏ ⵓⵙⵎⵔⵙ ⴰⵇⴱⵓⵔ ⴷⴰⵔ ⵉⵎⴰⵣⵉⵖⵏ. ⴰⵔ ⵜ ⵙⵎⵔⴰⵙⵏ ⴳ ⵡⴰⵢⵢⵓⵔ ⴷ ⵜⵔⵣⵉⵔⵜ.',
    emoji: '🫒',
  },
  {
    id: 'amlou',
    titleAr: 'أملو',
    titleAm: 'ⴰⵎⵍⵓ',
    descriptionAm: 'ⴰⵎⵍⵓ ⵉⴳⴰ ⵢⴰⵏ ⵓⵏⴰⵡ ⵏ ⵡⴰⵢⵢⵓⵔ ⴰⵎⴰⵣⵉⵖ. ⵉⵜⵜⵢⴰⵡⵙⵎⵔⴰⵙ ⵣⴳ ⵓⴷⵉ ⵏ ⵓⵔⴳⴰⵏ, ⵜⴰⵣⵎⵎⵓⵔⵜ, ⴷ ⵜⴰⵎⵏⵜ.',
    emoji: '🥜',
  },
  {
    id: 'bread',
    titleAr: 'الخبز التقليدي',
    titleAm: 'ⴰⵖⵔⵓⵎ ⴰⵎⴰⵣⵉⵖ',
    descriptionAm: 'ⴰⵖⵔⵓⵎ ⴰⵎⴰⵣⵉⵖ ⵉⴳⴰ ⵢⴰⵏ ⵓⵏⴰⵡ ⵏ ⵓⴳⵔⵓⵎ ⵉⵜⵜⵢⴰⵡⵙⵎⵔⴰⵙⵏ ⴳ ⵜⵓⵙⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ.',
    emoji: '🍞',
  },
  {
    id: 'ibrin',
    titleAr: 'إبرين (الكسكس)',
    titleAm: 'ⵉⴱⵔⵉⵏ',
    descriptionAm: 'ⵉⴱⵔⵉⵏ ⵉⴳⴰ ⵢⴰⵏ ⵓⵏⴰⵡ ⵏ ⵡⴰⵢⵢⵓⵔ ⴰⵎⴰⵣⵉⵖ ⵉⵇⴱⵓⵔⵏ. ⴰⵔ ⵜ ⵛⵛⴰⵔⵏ ⴳ ⵓⵙⵉⵎⵉⵜⵓⵔ ⴷ ⵜⵉⵎⵢⵓⵔⵉⵏ.',
    emoji: '🍚',
  },
  {
    id: 'tagla',
    titleAr: 'تاكلة',
    titleAm: 'ⵜⴰⴳⵍⴰ',
    descriptionAm: 'ⵜⴰⴳⵍⴰ ⵜⴳⴰ ⵢⴰⵏ ⵓⵏⴰⵡ ⵏ ⵡⴰⵢⵢⵓⵔ ⴰⵎⴰⵣⵉⵖ. ⴰⵔ ⵜⵜⵢⴰⵡⵙⵎⵔⴰⵙ ⵙ ⵓⴽⵯⵍⵓⵍ ⵏ ⵜⵎⵏⵜ ⴷ ⵡⴰⵏⵍⵉ.',
    emoji: '🥮',
  },
  {
    id: 'utensils',
    titleAr: 'أواني تقليدية',
    titleAm: 'ⵉⵎⴰⵔⵉⵔⵏ ⵉⵎⴰⵣⵉⵖⵏ',
    descriptionAm: 'ⵉⵎⴰⵔⵉⵔⵏ ⵉⵎⴰⵣⵉⵖⵏ ⴳⴰⵏ ⵣⴳ ⵜⴰⵇⵟⵟⴰⵕⵜ ⴷ ⵡⴰⵊⴷⵉⴷ. ⴰⵔ ⵜⵜⵢⴰⵡⵙⵎⵔⴰⵙⵏ ⴳ ⵜⵓⴷⵔⵜ ⵣⵉⴽⴽ.',
    emoji: '🍲',
  },
  {
    id: 'impressive',
    titleAr: 'جمال التراث الأمازيغي',
    titleAm: 'ⵜⴰⵖⴰⵔⴰⵙⵜ ⵏ ⵜⵓⵙⵙⵏⴰ',
    descriptionAm: 'ⵜⵓⵙⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴻⵍⵍⴰ ⵙ ⵡⴰⵎⵎⵓⵙ ⴷ ⵜⵖⴰⵔⴰⵙⵜ. ⴰⵔ ⵜⵙⵙⵏⵓⵍⴼⵓ ⴰⵎⵣⵔⵓⵢ ⴷ ⵓⵣⵎⵣ ⵏ ⵉⵎⴰⵣⵉⵖⵏ.',
    emoji: '✨',
  },
]
