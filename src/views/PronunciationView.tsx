import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'
import WordImage from '@/components/WordImage'
import { vocabularyWords, type VocabularyWord } from '@/data/vocabularyData'
import type { VocabularyCategory } from '@/types/game'

const CATEGORY_LABELS: Record<VocabularyCategory | 'all', string> = {
  all: 'الكل',
  school: 'القسم والمدرسة',
  people: 'الأشخاص',
  body: 'الجسم',
  colors: 'الألوان',
  subjects: 'المواد والأنشطة',
  season: 'الفصول والطقس',
  animals: 'الحيوانات',
}

const CATEGORY_ORDER: (VocabularyCategory | 'all')[] = [
  'all',
  'school',
  'people',
  'body',
  'colors',
  'subjects',
  'season',
  'animals',
]

const PAGE_SIZE = 24

/**
 * The romanization uses letters the browser voices cannot read (ḍ, ɣ, š…),
 * so it is folded to plain Latin before being spoken.
 */
const SPEECH_LATIN: Record<string, string> = {
  ḍ: 'd',
  ṭ: 't',
  ẓ: 'z',
  ṣ: 's',
  ṛ: 'r',
  ḥ: 'h',
  š: 'sh',
  ɣ: 'gh',
  ʷ: 'w',
  ɛ: 'a',
}

function toSpeakableLatin(latin: string) {
  return latin.replace(/[ḍṭẓṣṛḥšɣʷɛ]/g, (char) => SPEECH_LATIN[char] ?? char)
}

const SPEECH_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window

export default function PronunciationView() {
  const [category, setCategory] = useState<VocabularyCategory | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const tokenRef = useRef(0)

  // Voices are loaded asynchronously in most browsers; keep the latest list.
  useEffect(() => {
    if (!SPEECH_SUPPORTED) return
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      tokenRef.current += 1
      window.speechSynthesis.cancel()
    }
  }, [])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const word of vocabularyWords) {
      map.set(word.category, (map.get(word.category) ?? 0) + 1)
    }
    return map
  }, [])

  const words = useMemo(
    () =>
      category === 'all'
        ? vocabularyWords
        : vocabularyWords.filter((word) => word.category === category),
    [category],
  )

  const visibleWords = words.slice(0, visibleCount)

  const selectCategory = (next: VocabularyCategory | 'all') => {
    setCategory(next)
    setVisibleCount(PAGE_SIZE)
  }

  const speak = useCallback((word: VocabularyWord, rate: number) => {
    if (!SPEECH_SUPPORTED) return

    window.speechSynthesis.cancel()
    tokenRef.current += 1
    const token = tokenRef.current

    const utterance = new SpeechSynthesisUtterance(toSpeakableLatin(word.latin))
    const voice =
      voicesRef.current.find((item) => item.lang.toLowerCase().startsWith('en')) ??
      voicesRef.current.find((item) => item.lang.toLowerCase().startsWith('fr'))
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = 'en-US'
    }
    utterance.rate = rate
    utterance.onstart = () => {
      if (token === tokenRef.current) setSpeakingId(word.id)
    }
    utterance.onend = () => {
      if (token === tokenRef.current) setSpeakingId(null)
    }
    utterance.onerror = () => {
      if (token === tokenRef.current) setSpeakingId(null)
    }
    window.speechSynthesis.speak(utterance)
  }, [])

  return (
    <div className="w-full" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* ───────── Title ───────── */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ borderRadius: '16px', background: 'var(--clay-surface-card)' }}
            >
              <Volume2 className="w-6 h-6" style={{ color: 'var(--clay-lavender)' }} />
            </div>
            <h1 className="clay-display-sm" style={{ color: 'var(--clay-ink)' }}>
              النطق والاستماع
            </h1>
          </div>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            استمع إلى الكلمة الأمازيغية، ثم ردّدها بصوت عالٍ مع أستاذك.
          </p>
        </div>

        {/* ───────── How to practise ───────── */}
        <div
          className="clay-card mb-6 px-5 py-4"
          style={{ borderRadius: '22px', background: 'linear-gradient(160deg, #f6f0ff 0%, #fffdf8 80%)' }}
        >
          <p className="clay-caption-uppercase mb-2" style={{ color: 'var(--clay-muted)', letterSpacing: '1.5px' }}>
            طريقة التدريب
          </p>
          <ol className="clay-body-sm space-y-1" style={{ color: 'var(--clay-body)' }}>
            <li>🔊 اضغط «استمع» لتسمع الكلمة كاملة.</li>
            <li>🐢 اضغط «ببطء» لتسمعها بهدوء وتقلّد النطق.</li>
            <li>🗣️ ردّد الكلمة ثلاث مرات، ثم انتقل إلى الكلمة التالية.</li>
          </ol>
          <p className="clay-caption mt-3" style={{ color: 'var(--clay-muted-soft)' }}>
            الحروف اللاتينية تحت كل كلمة توضّح طريقة النطق. الصوت آلي، فاجعل الأستاذ قدوتك في الترديد.
          </p>
        </div>

        {/* ───────── Category filters ───────── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {CATEGORY_ORDER.map((item) => (
            <button
              key={item}
              onClick={() => selectCategory(item)}
              className={`clay-tab px-4 py-2 ${category === item ? 'clay-tab-active' : ''}`}
            >
              {CATEGORY_LABELS[item]}
              <span
                className="text-xs mr-1.5"
                style={{ color: 'var(--clay-muted-soft)' }}
              >
                {item === 'all' ? vocabularyWords.length : counts.get(item) ?? 0}
              </span>
            </button>
          ))}
        </div>

        {!SPEECH_SUPPORTED && (
          <p className="text-center clay-caption mb-4" style={{ color: 'var(--clay-error)' }}>
            <VolumeX className="w-4 h-4 inline-block ml-1 -mt-0.5" />
            متصفحك لا يدعم الاستماع الصوتي — يمكنك قراءة الحروف اللاتينية وترديدها.
          </p>
        )}

        {/* ───────── Word list ───────── */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {visibleWords.map((word) => {
            const isSpeaking = speakingId === word.id

            return (
              <article
                key={word.id}
                className="clay-card p-3.5 flex items-center gap-3 transition-all duration-200"
                style={{
                  borderRadius: '22px',
                  border: isSpeaking ? '3px solid var(--clay-lavender)' : '3px solid #ffffff',
                  boxShadow: isSpeaking
                    ? '0 0 0 5px rgba(137, 115, 191, 0.12), 0 8px 20px rgba(61, 44, 20, 0.08)'
                    : '0 8px 20px rgba(61, 44, 20, 0.07)',
                }}
              >
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{ width: 72, height: 72, borderRadius: '18px', background: '#fff6e6' }}
                >
                  <WordImage emoji={word.emoji} size={56} alt={word.arabic} />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="tifinagh-text text-2xl font-bold leading-tight"
                    style={{ color: 'var(--clay-ink)' }}
                  >
                    {word.tifinagh}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    dir="ltr"
                    style={{ color: 'var(--clay-lavender)', textAlign: 'right' }}
                  >
                    {word.latin}
                  </p>
                  <p className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                    {word.arabic}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => speak(word, 0.85)}
                    aria-label={`استمع إلى ${word.arabic}`}
                    title="استمع"
                    className="w-11 h-11 flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5 active:scale-90"
                    style={{
                      borderRadius: '14px',
                      background: isSpeaking ? 'var(--clay-lavender)' : 'var(--clay-surface-soft)',
                      color: isSpeaking ? '#ffffff' : 'var(--clay-lavender)',
                    }}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => speak(word, 0.5)}
                    aria-label={`استمع ببطء إلى ${word.arabic}`}
                    title="استمع ببطء"
                    className="w-11 h-11 flex items-center justify-center text-xs font-bold transition-transform duration-150 hover:-translate-y-0.5 active:scale-90"
                    style={{
                      borderRadius: '14px',
                      background: 'var(--clay-surface-soft)',
                      color: 'var(--clay-ochre)',
                    }}
                  >
                    <Volume1 className="w-5 h-5" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {visibleCount < words.length && (
          <div className="text-center mb-8">
            <button
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="clay-btn-secondary inline-flex items-center gap-2"
            >
              عرض المزيد ({words.length - visibleCount} كلمة متبقية)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
