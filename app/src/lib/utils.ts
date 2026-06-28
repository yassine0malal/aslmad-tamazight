import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(items: T[]) {
  const array = [...items]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function playSound(effect: 'click' | 'correct' | 'wrong' = 'click') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.type = 'triangle'
    const frequencyMap = {
      click: 800,
      correct: 520,
      wrong: 260,
    }
    oscillator.frequency.value = frequencyMap[effect]
    gain.gain.value = 0.1
    oscillator.start()
    oscillator.stop(context.currentTime + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08)
  } catch (error) {
    // ignore browser audio restrictions
  }
}
