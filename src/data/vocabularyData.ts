import type { VocabularyCategory } from '@/types/game'

export interface VocabularyWord {
  id: string
  tifinagh: string
  arabic: string
  latin: string
  emoji: string
  category: VocabularyCategory
}

/**
 * Canonical vocabulary for all games.
 * Source: refferences_informations/wrodsForGames.md, extracted from the
 * official Tifinagh lessons in refferences_informations/important-ref.
 * Do not add words that are not in those resources.
 */
export const vocabularyWords: VocabularyWord[] = [
  // ─── People ───────────────────────────────────────────────
  { id: 'anlmad', tifinagh: 'ⴰⵏⵍⵎⴰⴷ', arabic: 'التلميذ', latin: 'anlmad', emoji: '🧑‍🎓', category: 'people' },
  { id: 'taslmadt', tifinagh: 'ⵜⴰⵙⵍⵎⴰⴷⵜ', arabic: 'الأستاذة', latin: 'taslmadt', emoji: '👩‍🏫', category: 'people' },
  { id: 'aslmad', tifinagh: 'ⴰⵙⵍⵎⴰⴷ', arabic: 'الأستاذ', latin: 'aslmad', emoji: '👨‍🏫', category: 'people' },
  { id: 'argaz', tifinagh: 'ⴰⵔⴳⴰⵣ', arabic: 'رجل', latin: 'argaz', emoji: '👨', category: 'people' },

  // ─── School ───────────────────────────────────────────────
  { id: 'asira', tifinagh: 'ⴰⵙⵉⵔⴰ', arabic: 'المكتب', latin: 'asira', emoji: '🗄️', category: 'school' },
  { id: 'tadala', tifinagh: 'ⵜⴰⴷⴰⵍⴰ', arabic: 'القسم', latin: 'tadala', emoji: '🚪', category: 'school' },
  { id: 'tinml', tifinagh: 'ⵜⵉⵏⵎⵍ', arabic: 'المدرسة', latin: 'tinml', emoji: '🏫', category: 'school' },
  { id: 'adlis', tifinagh: 'ⴰⴷⵍⵉⵙ', arabic: 'كتاب', latin: 'adlis', emoji: '📕', category: 'school' },
  { id: 'alug', tifinagh: 'ⴰⵍⵓⴳ', arabic: 'دفتر', latin: 'alug', emoji: '📒', category: 'school' },
  { id: 'tadlist', tifinagh: 'ⵜⴰⴷⵍⵉⵙⵜ', arabic: 'كراسة', latin: 'tadlist', emoji: '📓', category: 'school' },
  { id: 'angmirs', tifinagh: 'ⴰⵏⴳⵎⵉⵔⵙ', arabic: 'طبشور', latin: 'angmirs', emoji: '🖍️', category: 'school' },
  { id: 'tadabut', tifinagh: 'ⵜⴰⴷⴰⴱⵓⵜ', arabic: 'طاولة', latin: 'tadabut', emoji: '🪑', category: 'school' },
  { id: 'tasna', tifinagh: 'ⵜⴰⵙⵏⴰ', arabic: 'صفحة', latin: 'tasna', emoji: '📄', category: 'school' },
  { id: 'tifilt', tifinagh: 'ⵜⵉⴼⵉⵍⵜ', arabic: 'لوحة', latin: 'tifilt', emoji: '🖼️', category: 'school' },
  { id: 'tiflwit', tifinagh: 'ⵜⵉⴼⵍⵡⵉⵜ', arabic: 'السبورة', latin: 'tiflwit', emoji: '🟩', category: 'school' },
  { id: 'amzgun', tifinagh: 'ⴰⵎⵣⴳⵓⵏ', arabic: 'مسرح', latin: 'amzgun', emoji: '🎭', category: 'school' },

  // ─── Body ─────────────────────────────────────────────────
  { id: 'tittawin', tifinagh: 'ⵜⵉⵟⵟⴰⵡⵉⵏ', arabic: 'عيون', latin: 'tiṭṭawin', emoji: '👀', category: 'body' },
  { id: 'adad', tifinagh: 'ⴰⴹⴰⴹ', arabic: 'إصبع', latin: 'aḍaḍ', emoji: '👆', category: 'body' },
  { id: 'tinzar', tifinagh: 'ⵜⵉⵏⵣⴰⵔ', arabic: 'أنف', latin: 'tinzar', emoji: '👃', category: 'body' },

  // ─── Colors ───────────────────────────────────────────────
  { id: 'awragh', tifinagh: 'ⴰⵡⵔⴰⵖ', arabic: 'أصفر', latin: 'awraɣ', emoji: '🟡', category: 'colors' },
  { id: 'azggwagh', tifinagh: 'ⴰⵣⴳⴳⵯⴰⵖ', arabic: 'أحمر', latin: 'azggʷaɣ', emoji: '🔴', category: 'colors' },
  { id: 'azgzaw', tifinagh: 'ⴰⵣⴳⵣⴰⵡ', arabic: 'أخضر', latin: 'azgzaw', emoji: '🟢', category: 'colors' },
  { id: 'aberkan', tifinagh: 'ⴰⴱⵔⴽⴰⵏ', arabic: 'أسود', latin: 'aberkan', emoji: '⚫', category: 'colors' },
  { id: 'amllal', tifinagh: 'ⴰⵎⵍⵍⴰⵍ', arabic: 'أبيض', latin: 'amllal', emoji: '⚪', category: 'colors' },
  { id: 'azrwal', tifinagh: 'ⴰⵥⵕⵡⴰⵍ', arabic: 'أزرق', latin: 'aẓṛwal', emoji: '🔵', category: 'colors' },
  { id: 'iklan', tifinagh: 'ⵉⴽⵯⵍⴰⵏ', arabic: 'الألوان', latin: 'iklan', emoji: '🌈', category: 'colors' },

  // ─── Subjects & activities ────────────────────────────────
  { id: 'tafrist', tifinagh: 'ⵜⴰⴼⵔⵉⵙⵜ', arabic: 'رسم', latin: 'tafrist', emoji: '🎨', category: 'subjects' },
  { id: 'tusnakt', tifinagh: 'ⵜⵓⵙⵏⴰⴽⵜ', arabic: 'رياضيات', latin: 'tusnakt', emoji: '➗', category: 'subjects' },
  { id: 'timassanin', tifinagh: 'ⵜⵉⵎⴰⵙⵙⴰⵏⵉⵏ', arabic: 'علوم', latin: 'timassanin', emoji: '🔬', category: 'subjects' },
  { id: 'tunnunt', tifinagh: 'ⵜⵓⵏⵏⵓⵏⵜ', arabic: 'رياضة', latin: 'tunnunt', emoji: '⚽', category: 'subjects' },
  { id: 'tizlit', tifinagh: 'ⵜⵉⵣⵍⵉⵜ', arabic: 'أنشودة', latin: 'tizlit', emoji: '🎵', category: 'subjects' },

  // ─── Season & weather ─────────────────────────────────────
  { id: 'asemmid', tifinagh: 'ⴰⵚⵎⵎⵉⴹ', arabic: 'البرد', latin: 'aṣemmiḍ', emoji: '🥶', category: 'season' },
  { id: 'anzar', tifinagh: 'ⴰⵏⵥⴰⵕ', arabic: 'شتاء', latin: 'anẓaṛ', emoji: '❄️', category: 'season' },

  // ─── Animals ─────────────────────────────────────────────
  // Source: refferences_informations/animals_vocabulary.xlsx (first Tifinagh
  // form of each entry; corrupt and missing Tifinagh entries skipped).
  { id: 'dog', tifinagh: 'ⴰⵢⴷⵉ', arabic: 'كلب', latin: 'aydi', emoji: '🐕', category: 'animals' },
  { id: 'puppy', tifinagh: 'ⵉⴳⵣⵉⵏ', arabic: 'جرو', latin: 'igzin', emoji: '🐶', category: 'animals' },
  { id: 'cat-m', tifinagh: 'ⴰⵎⵓⵛⵛ', arabic: 'قط', latin: 'amucc', emoji: '🐈', category: 'animals' },
  { id: 'cat-f', tifinagh: 'ⵜⴰⵎⵓⵛⵛⴰⵜ', arabic: 'قطة', latin: 'tamuššat', emoji: '🐈', category: 'animals' },
  { id: 'rat', tifinagh: 'ⴰⵖⵔⴷⴰ', arabic: 'جرذ', latin: 'aɣerda', emoji: '🐀', category: 'animals' },
  { id: 'mouse', tifinagh: 'ⴰⵖⵔⴷⴰ', arabic: 'فأر', latin: 'aɣerda', emoji: '🐁', category: 'animals' },
  { id: 'hamster', tifinagh: 'ⴰⵎⴰⴽⵍⴰⵙ', arabic: 'همستر', latin: 'amaklas', emoji: '🐹', category: 'animals' },
  { id: 'donkey', tifinagh: 'ⴰⵖⵢⵓⵍ', arabic: 'حمار', latin: 'aɣyul', emoji: '🫏', category: 'animals' },
  { id: 'donkey-f', tifinagh: 'ⵜⴰⵖⵢⵓⵍⵜ', arabic: 'أتان / حمارة', latin: 'taɣyult', emoji: '🫏', category: 'animals' },
  { id: 'donkey-foal', tifinagh: 'ⴰⵙⵏⵓⵙ', arabic: 'جحش', latin: 'asnus', emoji: '🐴', category: 'animals' },
  { id: 'horse', tifinagh: 'ⴰⵢⵢⵉⵙ', arabic: 'حصان', latin: 'ayyis', emoji: '🐎', category: 'animals' },
  { id: 'mare', tifinagh: 'ⵜⴰⴳⵎⴰⵔⵜ', arabic: 'فرس', latin: 'tagmart', emoji: '🐎', category: 'animals' },
  { id: 'foal-colt', tifinagh: 'ⴰⴳⵓⴷⵉ', arabic: 'مهر', latin: 'agudi', emoji: '🐴', category: 'animals' },
  { id: 'filly', tifinagh: 'ⵜⴰⴳⵓⴷⵉⵜ', arabic: 'مهرة', latin: 'tagudit', emoji: '🐴', category: 'animals' },
  { id: 'buffalo', tifinagh: 'ⴰⵎⵓⴽⴰⵢ', arabic: 'جاموس', latin: 'amukay', emoji: '🐃', category: 'animals' },
  { id: 'bull', tifinagh: 'ⴰⵣⴳⵔ', arabic: 'ثور', latin: 'azger', emoji: '🐂', category: 'animals' },
  { id: 'ox', tifinagh: 'ⴰⴼⵓⵏⴰⵙ', arabic: 'ثور مخصي', latin: 'afunas', emoji: '🐂', category: 'animals' },
  { id: 'cow', tifinagh: 'ⵜⴰⴼⵓⵏⴰⵙⵜ', arabic: 'بقرة', latin: 'tafunast', emoji: '🐄', category: 'animals' },
  { id: 'cows', tifinagh: 'ⵜⵉⵙⵉⵜⴰⵏ', arabic: 'أبقار', latin: 'tisitan', emoji: '🐄', category: 'animals' },
  { id: 'calf', tifinagh: 'ⴰⵖⵉⵢ', arabic: 'عجل', latin: 'aɣiy', emoji: '🐮', category: 'animals' },
  { id: 'shepherd', tifinagh: 'ⴰⵎⴽⵙⴰ', arabic: 'راعي', latin: 'amksa', emoji: '🧑‍🌾', category: 'animals' },
  { id: 'sheep', tifinagh: 'ⵉⵣⵉⵎⵔ', arabic: 'خروف / غنم', latin: 'izimr', emoji: '🐑', category: 'animals' },
  { id: 'lamb', tifinagh: 'ⴰⵍⵇⵇⴰⵖ', arabic: 'حمل', latin: 'aleqqaɣ', emoji: '🐑', category: 'animals' },
  { id: 'goat-m', tifinagh: 'ⴰⵣⴰⵍⴰⵖ', arabic: 'تيس', latin: 'azalaɣ', emoji: '🐐', category: 'animals' },
  { id: 'goat-f', tifinagh: 'ⵜⴰⵖⴰⵟⵜ', arabic: 'ماعز / عنزة', latin: 'taɣaṭt', emoji: '🐐', category: 'animals' },
  { id: 'kid', tifinagh: 'ⴰⵖⴰⵢⴷ', arabic: 'جدي', latin: 'aɣayd', emoji: '🐐', category: 'animals' },
  { id: 'pig', tifinagh: 'ⴰⵍⴰⴷⴰⵢ', arabic: 'خنزير', latin: 'aladay', emoji: '🐖', category: 'animals' },
  { id: 'sow', tifinagh: 'ⵜⴰⵍⴰⴷⴰⵢⵜ', arabic: 'خنزيرة', latin: 'taladayt', emoji: '🐖', category: 'animals' },
  { id: 'wild-boar', tifinagh: 'ⵉⵍⴼ', arabic: 'خنزير بري', latin: 'ilf', emoji: '🐗', category: 'animals' },
  { id: 'rabbit', tifinagh: 'ⴰⵇⵏⵉⵏ', arabic: 'أرنب', latin: 'aqnin', emoji: '🐇', category: 'animals' },
  { id: 'hare', tifinagh: 'ⴰⵡⵜⵉⵍ', arabic: 'أرنب بري', latin: 'awtil', emoji: '🐇', category: 'animals' },
  { id: 'mole', tifinagh: 'ⴰⵖⵣⴽⴰⵍ', arabic: 'خلد', latin: 'aɣzkal', emoji: '🐾', category: 'animals' },
  { id: 'hedgehog', tifinagh: 'ⵉⵏⵉⴽⴼ', arabic: 'قنفذ', latin: 'inikf', emoji: '🦔', category: 'animals' },
  { id: 'squirrel', tifinagh: 'ⴰⴳⴱⵓⵔ', arabic: 'سنجاب', latin: 'agbur', emoji: '🐿️', category: 'animals' },
  { id: 'fox', tifinagh: 'ⴰⴱⴰⵖⵓⵖ', arabic: 'ثعلب', latin: 'abaɣuɣ', emoji: '🦊', category: 'animals' },
  { id: 'wolf', tifinagh: 'ⴰⴳⵓⵍⵣ', arabic: 'ذئب', latin: 'agulz', emoji: '🐺', category: 'animals' },
  { id: 'bear', tifinagh: 'ⴰⴱⵓⴱⴱⴰⵥ', arabic: 'دب', latin: 'abubbaẓ', emoji: '🐻', category: 'animals' },
  { id: 'she-bear', tifinagh: 'ⵜⴰⴱⵓⴱⴱⴰⵥⵜ', arabic: 'دبة', latin: 'tabubbaẓt', emoji: '🐻', category: 'animals' },
  { id: 'bird', tifinagh: 'ⴰⴳⴹⵉⴹ', arabic: 'طائر', latin: 'agḍiḍ', emoji: '🐦', category: 'animals' },
  { id: 'chick-baby-bird', tifinagh: 'ⴰⵚⴹⵓ', arabic: 'فرخ', latin: 'aṣḍu', emoji: '🐤', category: 'animals' },
  { id: 'eagle', tifinagh: 'ⵉⵙⵖⵉ', arabic: 'عقاب', latin: 'isɣi', emoji: '🦅', category: 'animals' },
  { id: 'hawk-falcon', tifinagh: 'ⵜⴰⵎⴷⴷⴰ', arabic: 'صقر', latin: 'tamedda', emoji: '🦅', category: 'animals' },
  { id: 'vulture', tifinagh: 'ⵉⴳⵉⴷⵔ', arabic: 'نسر', latin: 'igider', emoji: '🦅', category: 'animals' },
  { id: 'raven-crow', tifinagh: 'ⴰⵄⴰⵇⵉ', arabic: 'غراب', latin: 'aɛaqi', emoji: '🐦‍⬛', category: 'animals' },
  { id: 'owl', tifinagh: 'ⵜⴰⵎⵓⴽⵜ', arabic: 'بومة', latin: 'tamukt', emoji: '🦉', category: 'animals' },
  { id: 'pigeon', tifinagh: 'ⴰⵜⴱⵉⵔ', arabic: 'حمامة', latin: 'atbir', emoji: '🕊️', category: 'animals' },
  { id: 'partridge', tifinagh: 'ⵜⴰⵙⴽⴽⵓⵔⵜ', arabic: 'حجل', latin: 'tasekkurt', emoji: '🐦', category: 'animals' },
  { id: 'turkey', tifinagh: 'ⴰⴱⵉⴱⵉ', arabic: 'ديك رومي', latin: 'abibi', emoji: '🦃', category: 'animals' },
  { id: 'rooster', tifinagh: 'ⴰⴼⵓⵍⵍⵓⵙ', arabic: 'ديك', latin: 'afullus', emoji: '🐓', category: 'animals' },
  { id: 'hen', tifinagh: 'ⵜⴰⴼⵓⵍⵍⵓⵙⵜ', arabic: 'دجاجة', latin: 'tafullust', emoji: '🐔', category: 'animals' },
  { id: 'chick', tifinagh: 'ⴰⴽⵢⵢⴰⵡ', arabic: 'كتكوت', latin: 'akeyyaw', emoji: '🐥', category: 'animals' },
  { id: 'drake', tifinagh: 'ⴰⴱⵔⵉⴽ', arabic: 'ذكر البط', latin: 'abrik', emoji: '🦆', category: 'animals' },
  { id: 'duck', tifinagh: 'ⵜⴰⴱⵔⵉⴽⵜ', arabic: 'بطة', latin: 'tabrikt', emoji: '🦆', category: 'animals' },
  { id: 'goose', tifinagh: 'ⴰⵡⵣⵣⵉⵡ', arabic: 'إوزة', latin: 'awzziw', emoji: '🪿', category: 'animals' },
  { id: 'swan', tifinagh: 'ⵜⵉⴽⵉⴽⵍⴰ', arabic: 'بجعة', latin: 'tikikla', emoji: '🦢', category: 'animals' },
  { id: 'fish', tifinagh: 'ⴰⵙⵍⵎ', arabic: 'سمكة', latin: 'aslm', emoji: '🐟', category: 'animals' },
  { id: 'shark', tifinagh: 'ⴰⵡⵇⵇⴰⵙ', arabic: 'قرش', latin: 'awqqas', emoji: '🦈', category: 'animals' },
  { id: 'dolphin', tifinagh: 'ⴰⵣⵢⴰⵎ', arabic: 'دلفين', latin: 'azyam', emoji: '🐬', category: 'animals' },
  { id: 'whale', tifinagh: 'ⵜⵉⵣⵎⴽⵜ', arabic: 'حوت', latin: 'tizmkt', emoji: '🐋', category: 'animals' },
  { id: 'octopus', tifinagh: 'ⴰⵣⴰⵢⵣ', arabic: 'أخطبوط', latin: 'azayz', emoji: '🐙', category: 'animals' },
  { id: 'seal', tifinagh: 'ⵉⵙⵉⴼⵔ', arabic: 'فقمة', latin: 'isifr', emoji: '🦭', category: 'animals' },
  { id: 'snail', tifinagh: 'ⴰⵖⵍⴰⵍ', arabic: 'حلزون', latin: 'aɣlal', emoji: '🐌', category: 'animals' },
  { id: 'turtle-tortoise', tifinagh: 'ⵉⴼⴽⵔ', arabic: 'سلحفاة', latin: 'ifker', emoji: '🐢', category: 'animals' },
  { id: 'crocodile', tifinagh: 'ⴰⵖⵓⵛⴰⴼ', arabic: 'تمساح', latin: 'aɣucaf', emoji: '🐊', category: 'animals' },
  { id: 'snake', tifinagh: 'ⴰⴱⵏⴽⴰⵍ', arabic: 'ثعبان', latin: 'abenkal', emoji: '🐍', category: 'animals' },
  { id: 'viper', tifinagh: 'ⵜⴰⵍⴼⵙⴰ', arabic: 'أفعى', latin: 'talefsa', emoji: '🐍', category: 'animals' },
  { id: 'chameleon', tifinagh: 'ⵜⴰⵢⵢⵓ', arabic: 'حرباء', latin: 'tayyu', emoji: '🦎', category: 'animals' },
  { id: 'toad', tifinagh: 'ⴰⵇⵔⵇⵓⵔ', arabic: 'علجوم / ضفدع الطين', latin: 'aqrqur', emoji: '🐸', category: 'animals' },
  { id: 'frog', tifinagh: 'ⴰⴳⵔⵓ', arabic: 'ضفدع', latin: 'agru', emoji: '🐸', category: 'animals' },
  { id: 'ant', tifinagh: 'ⵜⵓⵏⵖⵉⵜ', arabic: 'نملة', latin: 'tunɣit', emoji: '🐜', category: 'animals' },
  { id: 'cricket-locust', tifinagh: 'ⵜⴰⵎⵓⵔⵖⵉⵜ', arabic: 'جرادة', latin: 'tamurɣit', emoji: '🦗', category: 'animals' },
  { id: 'gnat-midge', tifinagh: 'ⵜⵉⵣⵉⵜ', arabic: 'بعوضة صغيرة', latin: 'tizit', emoji: '🦟', category: 'animals' },
  { id: 'fly', tifinagh: 'ⵉⵣⵉ', arabic: 'ذبابة', latin: 'izi', emoji: '🪰', category: 'animals' },
  { id: 'flies', tifinagh: 'ⵉⵣⴰⵏ', arabic: 'ذباب', latin: 'izan', emoji: '🪰', category: 'animals' },
  { id: 'caterpillar', tifinagh: 'ⵉⵍⴰⵍ', arabic: 'يرقة', latin: 'ilal', emoji: '🐛', category: 'animals' },
  { id: 'butterfly', tifinagh: 'ⴰⴼⵕⵟⵓⵟⵟⵓ', arabic: 'فراشة', latin: 'afṛṭuṭṭu', emoji: '🦋', category: 'animals' },
  { id: 'dragonfly', tifinagh: 'ⵜⴰⵜⵍⵓⵍⵍⵖⵜ', arabic: 'يعسوب', latin: 'tatlullɣt', emoji: '🪰', category: 'animals' },
  { id: 'ladybug', tifinagh: 'ⵜⵉⴽⵓⵏⴷⴰ', arabic: 'دعسوقة', latin: 'tikunda', emoji: '🐞', category: 'animals' },
  { id: 'bee', tifinagh: 'ⵜⵉⵣⵉⵣⵡⵉⵜ', arabic: 'نحلة', latin: 'tizizwit', emoji: '🐝', category: 'animals' },
  { id: 'wasp', tifinagh: 'ⵡⴰⵔⵣⵣⴰⵏ', arabic: 'دبور', latin: 'warezzan', emoji: '🐝', category: 'animals' },
  { id: 'mosquito', tifinagh: 'ⴰⴱⵉⴱⴰ', arabic: 'بعوضة', latin: 'abiba', emoji: '🦟', category: 'animals' },
  { id: 'louse', tifinagh: 'ⵜⵉⵍⴽⵉⵜ', arabic: 'قملة', latin: 'tilkit', emoji: '🪳', category: 'animals' },
  { id: 'fleas', tifinagh: 'ⵉⴽⵓⵔⴷⴰⵏ', arabic: 'براغيث', latin: 'ikurdan', emoji: '🐜', category: 'animals' },
  { id: 'bug', tifinagh: 'ⵇⵎⵛⵉⵛ', arabic: 'بقة', latin: 'qemcic', emoji: '🐛', category: 'animals' },
  { id: 'moth', tifinagh: 'ⴼⵔⵜⵍⵍⵉⵙ', arabic: 'عثة', latin: 'frtllis', emoji: '🦋', category: 'animals' },
  { id: 'cockroach', tifinagh: 'ⴰⵣⴳⵍⴰⵍⵍⵓ', arabic: 'صرصور', latin: 'azglallu', emoji: '🪳', category: 'animals' },
  { id: 'spider', tifinagh: 'ⵜⴰⵢⵙⵉⵙⵓⵜ', arabic: 'عنكبوت', latin: 'taysisut', emoji: '🕷️', category: 'animals' },
  { id: 'scorpion', tifinagh: 'ⵉⵖⵉⵔⴹⵎ', arabic: 'عقرب', latin: 'iɣirḍem', emoji: '🦂', category: 'animals' },
  { id: 'monkey', tifinagh: 'ⴰⴱⴰⵖⵓⵙ', arabic: 'قرد', latin: 'abaɣus', emoji: '🐒', category: 'animals' },
  { id: 'monkeys', tifinagh: 'ⵉⴱⵓⵖⴰⵙ', arabic: 'قرود', latin: 'ibuɣas', emoji: '🐒', category: 'animals' },
  { id: 'bat', tifinagh: 'ⴰⴼⵕⵟⴻⵟⵟⵓ', arabic: 'خفاش', latin: 'afṛṭeṭṭu', emoji: '🦇', category: 'animals' },
  { id: 'parrot', tifinagh: 'ⴰⴽⵓ', arabic: 'ببغاء', latin: 'aku', emoji: '🦜', category: 'animals' },
  { id: 'flamingo', tifinagh: 'ⴰⵛⴰⴱⵔⵓⵛ', arabic: 'نحام (فلامينغو)', latin: 'ašabruš', emoji: '🦩', category: 'animals' },
  { id: 'ostrich', tifinagh: 'ⵜⴰⵏⵀⴰⵍⵜ', arabic: 'نعامة', latin: 'tanhalt', emoji: '🦤', category: 'animals' },
  { id: 'gazelle', tifinagh: 'ⴰⵣⵏⴽⵯⴹ', arabic: 'غزال', latin: 'azenkwḍ', emoji: '🦌', category: 'animals' },
  { id: 'camel', tifinagh: 'ⴰⵔⵄⴰⵎ', arabic: 'جمل', latin: 'arɛam', emoji: '🐪', category: 'animals' },
  { id: 'dromedary', tifinagh: 'ⴰⵍⵖⵎ', arabic: 'جمل (عربي)', latin: 'alɣem', emoji: '🐫', category: 'animals' },
  { id: 'giraffe', tifinagh: 'ⴰⵎⴷⵖ', arabic: 'زرافة', latin: 'amdeɣ', emoji: '🦒', category: 'animals' },
  { id: 'elephant', tifinagh: 'ⵉⵍⵓ', arabic: 'فيل', latin: 'ilu', emoji: '🐘', category: 'animals' },
  { id: 'rhinoceros', tifinagh: 'ⴰⵣⴰⵔⴰ', arabic: 'وحيد القرن', latin: 'azara', emoji: '🦏', category: 'animals' },
  { id: 'hippopotamus', tifinagh: 'ⴰⵣⴰⵎⵓⵔ', arabic: 'فرس النهر', latin: 'azamur', emoji: '🦛', category: 'animals' },
  { id: 'kangaroo', tifinagh: 'ⴰⴽⵏⴳⵓⵔⵓ', arabic: 'كنغر', latin: 'aknguru', emoji: '🦘', category: 'animals' },
  { id: 'lion', tifinagh: 'ⵉⵣⵎ', arabic: 'أسد', latin: 'izem', emoji: '🦁', category: 'animals' },
  { id: 'leopard', tifinagh: 'ⴰⵖⵉⵍⴰⵙ', arabic: 'نمر', latin: 'aɣilas', emoji: '🐆', category: 'animals' },
  { id: 'panther', tifinagh: 'ⴰⴳⵔⵣⴰⵎ', arabic: 'فهد', latin: 'agrzam', emoji: '🐆', category: 'animals' },
  { id: 'jackal', tifinagh: 'ⵓⵛⵛⵏ', arabic: 'ابن آوى', latin: 'uccen', emoji: '🐺', category: 'animals' },
]

export const vocabularyById = new Map(vocabularyWords.map((word) => [word.id, word]))
