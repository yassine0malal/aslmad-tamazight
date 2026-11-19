import atlasLions from './atlas-lions.png'
import barbaryMonkeys from './barbary-monkeys.png'
import bear from '../animals/bear.png'
import eagle from '../animals/eagle.png'
import elephant from '../animals/elephant.png'
import fish from '../animals/fish.png'
import fox from '../animals/fox.png'
import butterfly from '../animals/butterfly.png'

export const teamImages = {
  'atlas-lions': atlasLions,
  'barbary-monkeys': barbaryMonkeys,
  bear,
  eagle,
  elephant,
  fish,
  fox,
  butterfly,
} as const

/** One distinct avatar per team — the setup screen allows up to 8 teams. */
export const teamImageList = Object.values(teamImages)
