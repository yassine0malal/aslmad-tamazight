/** Centralized route paths */
export const routes = {
  landing: '/',
  setup: '/setup',
  gameHub: '/game',
  nextLetter: '/game/next-letter',
  animalMatch: '/game/animal-match',
  memory: '/game/memory',
  riddle: '/game/riddle',
  colors: '/game/colors',
  culture: '/culture',
  souk: '/souk',
  gameOver: '/gameover',
} as const

/** A nav group with a parent label and sub-items */
export interface NavGroupChild {
  to: string
  label: string
  icon: string
  description?: string
}

export interface NavGroup {
  id: string
  label: string
  icon: string
  children: NavGroupChild[]
}

/** Hierarchical nav groups for the dropdown navbar */
export const navGroups: NavGroup[] = [
  {
    id: 'team-games',
    label: 'الألعاب الجماعية',
    icon: 'groups',
    children: [
      { to: routes.nextLetter, label: 'تحدي الحرف التالي', icon: 'next-letter', description: 'أكمل تسلسل الحروف' },
      { to: routes.animalMatch, label: 'مباراة الحيوانات', icon: 'animal', description: 'اختر الحرف الصحيح للحيوان' },
      { to: routes.memory, label: 'لعبة الذاكرة', icon: 'mind', description: 'ابحث عن الأزواج المطابقة' },
      { to: routes.riddle, label: 'أمساسا ن توالفت', icon: 'picture-quiz', description: 'لعبة التخمين بالصور' },
    ],
  },
  {
    id: 'kids-games',
    label: 'ألعاب التلاميذ',
    icon: 'kids',
    children: [
      { to: routes.colors, label: 'ألوان', icon: 'kids', description: 'تعلّم أسماء الألوان' },
    ],
  },
  {
    id: 'culture',
    label: 'الثقافة',
    icon: 'culture',
    children: [
      { to: routes.culture, label: 'المعرض الثقافي', icon: 'culture', description: 'استكشف التراث الأمازيغي' },
    ],
  },
  {
    id: 'souk',
    label: 'السوق',
    icon: 'market',
    children: [
      { to: routes.souk, label: 'السوق الافتراضي', icon: 'market', description: 'أنفق نقاطك واشتري' },
    ],
  },
]

/** Human-readable route labels for the Navbar (kept for backward compat) */
export const navLinks = [
  { to: routes.gameHub, label: 'المركز', icon: 'home' as const },
  { to: routes.nextLetter, label: 'تحدي الحرف' },
  { to: routes.animalMatch, label: 'مباراة الحيوانات' },
  { to: routes.memory, label: 'لعبة الذاكرة' },
  { to: routes.riddle, label: 'أمساسا' },
  { to: routes.colors, label: 'ألوان' },
  { to: routes.culture, label: 'الثقافة' },
  { to: routes.souk, label: 'السوق', icon: 'shopping-bag' as const },
] as const
