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
    tifinaghName: 'ⴰⵣⵔⵡⴰⵍ',
    latinName: 'Azrwal',
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
  {
    id: 'orange',
    colorName: 'Orange',
    colorHex: '#FF9800',
    tifinaghName: 'ⴰⵍⵉⵎⵓⵏⵉ',
    latinName: 'Alimuni',
    arabicName: 'برتقالي',
    objectName: 'Orange',
    objectEmoji: '🍊',
    objectImage: '/assets/colors/orange.svg',
  },
  {
    id: 'brown',
    colorName: 'Brown',
    colorHex: '#795548',
    tifinaghName: 'ⴰⵎⵔⵡⴰⵖ',
    latinName: 'Amrwaɣ',
    arabicName: 'بني',
    objectName: 'Bear',
    objectEmoji: '🧸',
    objectImage: '/assets/colors/bear.svg',
  },
  {
    id: 'purple',
    colorName: 'Purple',
    colorHex: '#9C27B0',
    tifinaghName: 'ⴰⵎⴷⵓⴷⵉ',
    latinName: 'Amdudi',
    arabicName: 'بنفسجي',
    objectName: 'Grapes',
    objectEmoji: '🍇',
    objectImage: '/assets/colors/grapes.svg',
  },
  {
    id: 'pink',
    colorName: 'Pink',
    colorHex: '#E91E63',
    tifinaghName: 'ⴰⵣⵔⵖⴰⵏ',
    latinName: 'Azrɣan',
    arabicName: 'وردي',
    objectName: 'Flower',
    objectEmoji: '🌸',
    objectImage: '/assets/colors/flower.svg',
  },
]

/** The 10 static color circles always displayed in the palette */
export const paletteColors: { colorHex: string; label: string }[] = [
  { colorHex: '#F44336', label: 'ⴰⵣⴳⴳⵯⴰⵖ' },   // Red
  { colorHex: '#2196F3', label: 'ⴰⵣⵔⵡⴰⵍ' },   // Blue
  { colorHex: '#4CAF50', label: 'ⴰⵣⴳⵣⴰⵡ' },   // Green
  { colorHex: '#E91E63', label: 'ⴰⵣⵔⵖⴰⵏ' },   // Pink
  { colorHex: '#FFD700', label: 'ⴰⵡⵔⴰⵖ' },   // Yellow
  { colorHex: '#795548', label: 'ⴰⵎⵔⵡⴰⵖ' },   // Brown
  { colorHex: '#9C27B0', label: 'ⴰⵎⴷⵓⴷⵉ' },   // Purple
  { colorHex: '#FF9800', label: 'ⴰⵍⵉⵎⵓⵏⵉ' },   // Orange
  { colorHex: '#212121', label: 'ⴰⴱⵔⴽⴰⵏ' },   // Black
  { colorHex: '#F5F5F5', label: 'ⴰⵎⵍⵍⴰⵍ' },   // White
]
