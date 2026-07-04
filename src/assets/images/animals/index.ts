import eagle from './eagle.png'
import monkey from './monkey.png'
import lion from './lion.png'
import bear from './bear.png'
import elephant from './elephant.png'
import fox from './fox.png'
import butterfly from './butterfly.png'
import fish from './fish.png'

export const animalImages = {
  eagle,
  monkey,
  lion,
  bear,
  elephant,
  fox,
  butterfly,
  fish,
} as const

export const animalImageList = Object.values(animalImages)
