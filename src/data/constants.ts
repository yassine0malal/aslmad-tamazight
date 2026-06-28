/**
 * Centralized UI constants and configuration data.
 * All view-level constants are centralized here for maintainability.
 */

// ─── Landing View ─────────────────────────────────────────────

export const floatingLetters = [
  { char: 'ⴰ', x: '8%', y: '12%', size: 'text-4xl', delay: 0 },
  { char: 'ⴱ', x: '85%', y: '18%', size: 'text-3xl', delay: 0.5 },
  { char: 'ⴳ', x: '15%', y: '75%', size: 'text-5xl', delay: 1 },
  { char: 'ⴷ', x: '78%', y: '70%', size: 'text-3xl', delay: 1.5 },
  { char: 'ⴻ', x: '92%', y: '45%', size: 'text-4xl', delay: 0.8 },
  { char: 'ⴼ', x: '5%', y: '48%', size: 'text-3xl', delay: 1.2 },
  { char: 'ⴽ', x: '50%', y: '8%', size: 'text-2xl', delay: 0.3 },
  { char: 'ⵀ', x: '35%', y: '85%', size: 'text-4xl', delay: 0.7 },
] as const



// ─── Setup View ───────────────────────────────────────────────

export const colorOptions = [
  { hex: '#1A54F4', label: 'أزرق' },
  { hex: '#FFC72C', label: 'أصفر' },
  { hex: '#00A86B', label: 'أخضر' },
  { hex: '#D96B43', label: 'برتقالي' },
  { hex: '#8B5CF6', label: 'بنفسجي' },
  { hex: '#E8453C', label: 'أحمر' },
]

export const defaultAvatars = [
  '/team-atlas-lions.png',
  '/team-barbary-monkeys.png',
] as const

export function createTeamConfig(index: number) {
  return {
    name: `فريق ${index + 1}`,
    color: colorOptions[index % colorOptions.length].hex,
    avatar: defaultAvatars[index % defaultAvatars.length],
  }
}

// ─── Souk View ────────────────────────────────────────────────

export const categoryColors: Record<string, string> = {
  background: 'var(--clay-lavender)',
  accessory: 'var(--clay-coral)',
  emote: 'var(--clay-mint)',
}

export const categoryLabels: Record<string, string> = {
  background: 'خلفية',
  accessory: 'إكسسوار',
  emote: 'إيموت',
}

// ─── Riddle View ──────────────────────────────────────────────

export const choiceLabels = ['أ', 'ب', 'ت', 'ث'] as const

// ─── Memory Match Difficulty ──────────────────────────────────

export const MEMORY_DIFFICULTY = {
  BEGINNER: { label: 'مبتدئ', description: '١٠ بطاقات — ٥ أزواج', cardCount: 10, emoji: '🌱' },
  MEDIUM: { label: 'متوسط', description: '١٦ بطاقة — ٨ أزواج', cardCount: 16, emoji: '🔥' },
  ADVANCED: { label: 'متقدم', description: '٣٠ بطاقة — ١٥ زوجًا', cardCount: 30, emoji: '💎' },
} as const

export type MemoryDifficultyLevel = keyof typeof MEMORY_DIFFICULTY

// ─── Particle / Confetti ──────────────────────────────────────

export const CLAY_PARTICLE_COLORS = [
  'var(--clay-ochre)',
  'var(--clay-lavender)',
  'var(--clay-mint)',
  'var(--clay-coral)',
  'var(--clay-peach)',
] as const

export const CONFETTI_COLORS = [
  'var(--clay-ochre)',
  'var(--clay-lavender)',
  'var(--clay-peach)',
  'var(--clay-mint)',
  'var(--clay-coral)',
] as const

export const CONFETTI_SHAPES = ['circle', 'square', 'triangle'] as const
