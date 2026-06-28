/** Centralized route paths */
export const routes = {
  landing: '/',
  setup: '/setup',
  gameHub: '/game',
  nextLetter: '/game/next-letter',
  animalMatch: '/game/animal-match',
  memory: '/game/memory',
  riddle: '/game/riddle',
  souk: '/souk',
  gameOver: '/gameover',
} as const

/** Human-readable route labels for the Navbar */
export const navLinks = [
  { to: routes.gameHub, label: 'المركز', icon: 'home' as const },
  { to: routes.nextLetter, label: 'تحدي الحرف' },
  { to: routes.animalMatch, label: 'مباراة الحيوانات' },
  { to: routes.memory, label: 'لعبة الذاكرة' },
  { to: routes.riddle, label: 'أمساسا' },
  { to: routes.souk, label: 'السوق', icon: 'shopping-bag' as const },
] as const
