export interface ColorAsset {
  id: string
  colorName: string
  colorHex: string
  tifinaghName: string
  latinName: string
  arabicName: string
  objectName: string
  objectEmoji: string
  objectImage: string
}

export const colorAssets: ColorAsset[] = [
  {
    id: 'yellow',
    colorName: 'Yellow',
    colorHex: '#FFD700',
    tifinaghName: 'ⴰⵡⵔⴰⵖ',
    latinName: 'Awraɣ',
    arabicName: 'أصفر',
    objectName: 'Chick',
    objectEmoji: '🐥',
    objectImage: '/assets/colors/chick.svg',
  },
  {
    id: 'blue',
    colorName: 'Blue',
    colorHex: '#2196F3',
    tifinaghName: 'ⴰⵥⵕⵡⴰⵍ',
    latinName: 'Aẓṛwal',
    arabicName: 'أزرق',
    objectName: 'Umbrella',
    objectEmoji: '☂️',
    objectImage: '/assets/colors/umbrella.svg',
  },
  {
    id: 'red',
    colorName: 'Red',
    colorHex: '#F44336',
    tifinaghName: 'ⴰⵣⴳⴳⵯⴰⵖ',
    latinName: 'Azggʷaɣ',
    arabicName: 'أحمر',
    objectName: 'Apple',
    objectEmoji: '🍎',
    objectImage: '/assets/colors/apple.svg',
  },
  {
    id: 'green',
    colorName: 'Green',
    colorHex: '#4CAF50',
    tifinaghName: 'ⴰⵣⴳⵣⴰⵡ',
    latinName: 'Azgzaw',
    arabicName: 'أخضر',
    objectName: 'Leaf',
    objectEmoji: '🌿',
    objectImage: '/assets/colors/leaf.svg',
  },
  {
    id: 'black',
    colorName: 'Black',
    colorHex: '#212121',
    tifinaghName: 'ⴰⴱⵔⴽⴰⵏ',
    latinName: 'Abrkan',
    arabicName: 'أسود',
    objectName: 'Cat',
    objectEmoji: '🐈‍⬛',
    objectImage: '/assets/colors/cat.svg',
  },
  {
    id: 'white',
    colorName: 'White',
    colorHex: '#F5F5F5',
    tifinaghName: 'ⴰⵎⵍⵍⴰⵍ',
    latinName: 'Amllal',
    arabicName: 'أبيض',
    objectName: 'Cloud',
    objectEmoji: '☁️',
    objectImage: '/assets/colors/cloud.svg',
  },
]

/** The six color circles from the reference lessons */
export const paletteColors: { colorHex: string; label: string }[] = [
  { colorHex: '#F44336', label: 'ⴰⵣⴳⴳⵯⴰⵖ' },   // Red
  { colorHex: '#2196F3', label: 'ⴰⵥⵕⵡⴰⵍ' },   // Blue
  { colorHex: '#4CAF50', label: 'ⴰⵣⴳⵣⴰⵡ' },   // Green
  { colorHex: '#FFD700', label: 'ⴰⵡⵔⴰⵖ' },   // Yellow
  { colorHex: '#212121', label: 'ⴰⴱⵔⴽⴰⵏ' },   // Black
  { colorHex: '#F5F5F5', label: 'ⴰⵎⵍⵍⴰⵍ' },   // White
]
