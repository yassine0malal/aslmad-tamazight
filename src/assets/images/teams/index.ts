import atlasLions from './atlas-lions.png'
import barbaryMonkeys from './barbary-monkeys.png'

export const teamImages = {
  'atlas-lions': atlasLions,
  'barbary-monkeys': barbaryMonkeys,
} as const

export const teamImageList = Object.values(teamImages)
