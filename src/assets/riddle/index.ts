import afra from './afra.svg'
import tamemt from './tamemt.svg'
import amuch from './amuch.svg'
import ayrad from './ayrad.svg'
import tafzelt from './tafzelt.svg'
import adrar from './adrar.svg'
import aydi from './aydi.svg'
import asklu from './asklu.svg'
import itri from './itri.svg'
import amnal from './amnal.svg'
import tadeffuyt from './tadeffuyt.svg'
import aghrum from './aghrum.svg'

export const riddleImages: Record<string, string> = {
  afra,
  tamemt,
  amuch,
  ayrad,
  tafzelt,
  adrar,
  aydi,
  asklu,
  itri,
  amnal,
  tadeffuyt,
  aghrum,
}

import lionFallback from '@/assets/images/animals/lion.png'

/** Fallback image used when a riddle item has no known SVG asset */
export const riddleFallbackImage = lionFallback
