import { useGame } from '@/context/GameContext'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import ParticleBurst from '@/components/ParticleBurst'
import WordImage from '@/components/WordImage'
import FloatingScore from '@/components/FloatingScore'
import { Check, X, ArrowRight, Volume2, Delete } from 'lucide-react'
import { routes } from '@/lib/routes'
import { TIFINAGH_LETTERS } from '@/data/gameData'
import { wordSets } from '@/data/wordSets'

const keyTints = ['#fff7d6', '#e7f8ef', '#eee7ff', '#ffede4', '#d9edff']

export default function AmudruMatchView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [showParticles, setShowParticles] = useState(false)
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 })
  const [showFloatingScore, setShowFloatingScore] = useState(false)
  const [shakeCard, setShakeCard] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  const [typedLetters, setTypedLetters] = useState('')

  // ─── Chosen word set (teacher picks before the round starts) ───
  const [choosing, setChoosing] = useState(true)
  const [activeSetId, setActiveSetId] = useState<string | null>(null)

  const startRound = (wordSetId?: string) => {
    setActiveSetId(wordSetId ?? null)
    dispatch({ type: 'SET_WORD_DECK', payload: { wordSetId } })
    setChoosing(false)
  }

  // ─── Word construction state ───
  const [filledSlots, setFilledSlots] = useState<string[]>([])
  const [currentSlot, setCurrentSlot] = useState(0)
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const puzzle = state.game2Deck[state.currentPuzzleIndex]
  const isLastPuzzle = state.currentPuzzleIndex >= state.game2Deck.length - 1
  const totalPuzzles = state.game2Deck.length
  const wordLength = puzzle?.wordTifinagh.length || 0
  const allSlotsFilled = filledSlots.length > 0 && filledSlots.every((s) => s !== '')

  // ─── Curated letter pool (12-16 letters) ───
  const letterPool = useMemo(() => {
    if (!puzzle) return []
    const wordLetters = Array.from(new Set(puzzle.wordTifinagh.split('')))
    const distractors = TIFINAGH_LETTERS.filter((l) => !wordLetters.includes(l))
    const shuffled = [...distractors].sort(() => Math.random() - 0.5)
    const targetCount = Math.max(12, Math.min(16, wordLetters.length + 6))
    const needed = targetCount - wordLetters.length
    const pool = [...wordLetters, ...shuffled.slice(0, Math.max(needed, 0))]
    return pool.sort(() => Math.random() - 0.5)
  }, [puzzle])

  // How many times each letter appears in the target word
  const letterCounts = useMemo(() => {
    if (!puzzle) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    for (const char of puzzle.wordTifinagh) {
      counts[char] = (counts[char] || 0) + 1
    }
    return counts
  }, [puzzle])

  // How many times each letter has been placed so far
  const placedCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const letter of filledSlots) {
      if (letter) counts[letter] = (counts[letter] || 0) + 1
    }
    return counts
  }, [filledSlots])

  const isLetterExhausted = (letter: string) => {
    const required = letterCounts[letter] || 0
    const placed = placedCounts[letter] || 0
    if (required === 0) return placed >= 1 // distractor — can be used once as a decoy
    return placed >= required
  }

  const progressPct = useMemo(() => {
    if (totalPuzzles === 0) return 0
    return Math.round((state.currentPuzzleIndex / totalPuzzles) * 100)
  }, [state.currentPuzzleIndex, totalPuzzles])

  // ─── Cleanup auto-advance timer on unmount ───
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    }
  }, [])

  // ─── Reset on new puzzle ───
  useEffect(() => {
    setShowReveal(false)
    setTypedLetters('')
    if (puzzle) {
      setFilledSlots(new Array(puzzle.wordTifinagh.length).fill(''))
      setCurrentSlot(0)
    }
  }, [state.currentPuzzleIndex])

  // ─── Typewriter reveal on correct answer ───
  useEffect(() => {
    if (showReveal && puzzle) {
      const letters = puzzle.wordTifinagh.split('')
      let idx = 0
      const interval = setInterval(() => {
        if (idx <= letters.length) {
          setTypedLetters(letters.slice(0, idx).join(''))
          idx += 1
        } else {
          clearInterval(interval)
        }
      }, 200)
      return () => clearInterval(interval)
    }
  }, [showReveal, puzzle])

  // ─── Handlers ───

  const handleLetterTap = useCallback(
    (letter: string) => {
      if (state.lastAnswerCorrect !== null || showReveal || !puzzle) return
      if (currentSlot >= wordLength) return

      // Don't allow if this letter is already exhausted
      if (isLetterExhausted(letter)) return

      const newSlots = [...filledSlots]
      newSlots[currentSlot] = letter
      setFilledSlots(newSlots)

      // Auto-advance to next slot
      if (currentSlot + 1 < wordLength) {
        setCurrentSlot(currentSlot + 1)
      }
    },
    [state.lastAnswerCorrect, showReveal, puzzle, currentSlot, wordLength, filledSlots],
  )

  const handleBackspace = useCallback(() => {
    if (state.lastAnswerCorrect !== null || showReveal) return

    if (filledSlots[currentSlot]) {
      // Clear current slot
      const newSlots = [...filledSlots]
      newSlots[currentSlot] = ''
      setFilledSlots(newSlots)
    } else if (currentSlot > 0) {
      // Move back and clear that slot
      const prevSlot = currentSlot - 1
      const newSlots = [...filledSlots]
      newSlots[prevSlot] = ''
      setFilledSlots(newSlots)
      setCurrentSlot(prevSlot)
    }
  }, [state.lastAnswerCorrect, showReveal, filledSlots, currentSlot])

  const handleSlotClick = useCallback(
    (idx: number) => {
      if (state.lastAnswerCorrect !== null || showReveal) return
      setCurrentSlot(idx)
    },
    [state.lastAnswerCorrect, showReveal],
  )

  const handleNext = useCallback(() => {
    setShowReveal(false)
    setShowFloatingScore(false)
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    dispatch({ type: 'NEXT_PUZZLE' })
    dispatch({ type: 'SWITCH_TEAM' })
    if (isLastPuzzle) navigate(routes.gameHub)
  }, [dispatch, isLastPuzzle, navigate])

  const handleCheckAnswer = useCallback(() => {
    if (!puzzle || state.lastAnswerCorrect !== null || !allSlotsFilled) return

    const userWord = filledSlots.join('')
    if (userWord === puzzle.wordTifinagh) {
      const cardEl = document.getElementById('word-card')
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect()
        setParticleOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }
      dispatch({ type: 'ANSWER_CORRECT' })
      setShowParticles(true)
      setShowFloatingScore(true)
      setShowReveal(true)

      // Auto-advance to next player after brief celebration
      autoAdvanceTimer.current = setTimeout(() => {
        handleNext()
      }, 2200)
    } else {
      setShakeCard(true)
      dispatch({ type: 'ANSWER_INCORRECT' })
      setTimeout(() => setShakeCard(false), 400)
    }
  }, [puzzle, state.lastAnswerCorrect, allSlotsFilled, filledSlots, dispatch, handleNext])

  const hasAnswered = state.lastAnswerCorrect !== null

  if (choosing) {
    return (
      <div className="w-full" dir="rtl">
        <div className="text-center mb-6">
          <h2 className="clay-title-lg mb-1" style={{ color: 'var(--clay-ink)' }}>
            مباراة الكلمات
          </h2>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            اختر مجموعة كلمات جاهزة، أو ابدأ بكلمات عشوائية من كل المفردات.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {wordSets.map((set) => {
            const isActive = activeSetId === set.id
            return (
              <button
                key={set.id}
                onClick={() => startRound(set.id)}
                className="clay-card kid-card-hover p-5 text-start"
                style={{
                  borderRadius: '24px',
                  border: isActive ? '3px solid var(--clay-success)' : '3px solid #ffffff',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <WordImage emoji={set.emoji} size={48} />
                  <div className="min-w-0">
                    <div className="clay-title-sm truncate" style={{ color: 'var(--clay-ink)' }}>
                      {set.title}
                    </div>
                    <div className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                      {set.words.length} كلمة
                    </div>
                  </div>
                </div>
                <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-body)' }}>
                  {set.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {set.words.slice(0, 5).map((tifinagh) => (
                    <span
                      key={tifinagh}
                      className="tifinagh-text text-sm px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--clay-surface-soft)', color: 'var(--clay-ink)' }}
                    >
                      {tifinagh}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}

          <button
            onClick={() => startRound()}
            className="clay-card kid-card-hover p-5 text-start"
            style={{
              borderRadius: '24px',
              border: activeSetId === null ? '3px solid var(--clay-lavender)' : '3px solid #ffffff',
              background: 'linear-gradient(160deg, #efe8ff 0%, #ffffff 78%)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl leading-none" aria-hidden>
                🎲
              </span>
              <div className="min-w-0">
                <div className="clay-title-sm" style={{ color: 'var(--clay-ink)' }}>
                  كلمات عشوائية
                </div>
                <div className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                  من كل مفردات التطبيق
                </div>
              </div>
            </div>
            <p className="clay-body-sm" style={{ color: 'var(--clay-body)' }}>
              اختر هذا الخيار إذا أردت أن تكون الكلمات متنوعة كل مرة.
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="clay-body-lg" style={{ color: 'var(--clay-ink)' }}>
          جارٍ تحضير اللعبة...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* ───────── Progress bar ───────── */}
      <div className="max-w-3xl mx-auto mb-6 px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
            🎯 {state.currentPuzzleIndex + 1} / {totalPuzzles}
          </span>
          <span className="clay-caption" style={{ color: 'var(--clay-peach)' }}>
            {progressPct}%
          </span>
        </div>
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{ background: 'var(--clay-surface-strong)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(to right, var(--clay-peach), var(--clay-mint))',
            }}
          />
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {state.game2Deck.map((_, idx) => {
            const distance = Math.abs(idx - state.currentPuzzleIndex)
            if (distance > 5 && idx !== 0 && idx !== totalPuzzles - 1) {
              if (idx === 6 || idx === totalPuzzles - 6)
                return (
                  <span key={idx} className="text-xs" style={{ color: 'var(--clay-muted-soft)' }}>
                    …
                  </span>
                )
              return null
            }
            return (
              <div
                key={idx}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === state.currentPuzzleIndex ? '20px' : '8px',
                  height: idx === state.currentPuzzleIndex ? '10px' : '8px',
                  background:
                    idx < state.currentPuzzleIndex
                      ? 'var(--clay-success)'
                      : idx === state.currentPuzzleIndex
                        ? 'var(--clay-peach)'
                        : 'var(--clay-surface-strong)',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* ───────── Title ───────── */}
      <div className="text-center mb-4">
        <h2 className="clay-title-lg mb-1" style={{ color: 'var(--clay-ink)' }}>
          مباراة الكلمات
        </h2>
        <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
          🧩 ابنِ الكلمة الأمازيغية الصحيحة من الحروف!
        </p>
      </div>

      {/* ───────── Word card ───────── */}
      <div className="flex justify-center mb-6">
        <div
          id="word-card"
          className="w-64 md:w-72 flex flex-col items-center justify-center overflow-hidden transition-all duration-600 py-6 px-4"
          style={{
            background: 'linear-gradient(170deg, #fff3cf 0%, #ffffff 78%)',
            borderRadius: '30px',
            border: showReveal ? '3px solid var(--clay-success)' : '3px solid #ffffff',
            boxShadow: showReveal
              ? '0 0 0 7px rgba(34, 197, 94, 0.1), 0 14px 30px rgba(61, 44, 20, 0.1)'
              : '0 14px 30px rgba(61, 44, 20, 0.1)',
            animation: shakeCard ? 'shake 0.4s ease' : showReveal ? 'float 3s ease-in-out infinite' : undefined,
          }}
        >
          <WordImage
            emoji={puzzle.emoji}
            size={132}
            className="mb-3 animate-kid-bob transition-all duration-500"
          />
          <p className="clay-title-md" style={{ color: 'var(--clay-ink)' }}>
            {puzzle.wordArabic}
          </p>
          {!showReveal && (
            <p className="clay-body-sm mt-1" style={{ color: 'var(--clay-ochre)' }}>
              املأ الحروف أدناه
            </p>
          )}
        </div>
      </div>

      {/* ───────── Tifinagh reveal (on correct) ───────── */}
      {showReveal && (
        <div className="text-center mb-6 animate-pop-in">
          <div className="inline-block">
            <p
              className="tifinagh-text text-3xl md:text-4xl font-bold mb-2"
              style={{ color: 'var(--clay-lavender)' }}
            >
              {typedLetters}
              <span className="animate-pulse">|</span>
            </p>
            <p className="clay-body-lg" style={{ color: 'var(--clay-muted)' }}>
              {puzzle.wordLatin}
            </p>
            <button
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ background: 'var(--clay-surface-soft)', color: 'var(--clay-lavender)' }}
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(puzzle.wordArabic)
                utterance.lang = 'ar-SA'
                speechSynthesis.speak(utterance)
              }}
            >
              <Volume2 className="w-4 h-4" />
              استمع ({puzzle.wordLatin})
            </button>
          </div>
        </div>
      )}

      {/* ───────── Result feedback ───────── */}
      {state.lastAnswerCorrect === true && (
        <div className="text-center mb-4 animate-pop-in">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl"
            style={{ background: 'var(--clay-surface-soft)', border: '1px solid var(--clay-success)' }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ borderRadius: '9999px', background: 'var(--clay-success)' }}
            >
              <Check className="w-6 h-6 text-white" />
            </div>
            <span className="clay-title-md" style={{ color: 'var(--clay-success)' }}>
              🎉 رائع! +15 نقطة 🎉
            </span>
          </div>
        </div>
      )}

      {state.lastAnswerCorrect === false && (
        <div className="text-center mb-4 animate-pop-in">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl"
            style={{ background: 'var(--clay-surface-soft)', border: '1px solid var(--clay-error)' }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ borderRadius: '9999px', background: 'var(--clay-error)' }}
            >
              <X className="w-6 h-6 text-white" />
            </div>
            <span className="clay-title-md" style={{ color: 'var(--clay-error)' }}>
              😅 لا بأس! حاول في المرة القادمة
            </span>
          </div>
        </div>
      )}

      {/* ───────── Word slots (exact word length) ───────── */}
      {!showReveal && (
        <div
          className="flex items-center justify-center gap-2 md:gap-3 mb-6 px-4 py-2"
          style={{ direction: 'ltr' }}
        >
          {Array.from({ length: wordLength }).map((_, idx) => {
            const isActive = idx === currentSlot
            const isFilled = !!filledSlots[idx]

            return (
              <button
                key={idx}
                ref={(el) => {
                  slotRefs.current[idx] = el
                }}
                onClick={() => handleSlotClick(idx)}
                className="relative flex items-center justify-center transition-all duration-200 focus:outline-none"
                style={{
                  width: 'clamp(38px, 9vw, 54px)',
                  height: 'clamp(46px, 11vw, 62px)',
                  borderRadius: '18px',
                  border: isActive
                    ? '3px solid var(--clay-peach)'
                    : isFilled
                      ? '3px solid var(--clay-lavender)'
                      : '3px dashed #ded7c8',
                  background: isFilled ? '#f3edff' : '#ffffff',
                  boxShadow: isActive
                    ? '0 0 0 5px rgba(255, 176, 132, 0.18), 0 8px 16px rgba(61, 44, 20, 0.1)'
                    : '0 5px 12px rgba(61, 44, 20, 0.06)',
                  transform: isActive ? 'scale(1.07)' : 'scale(1)',
                  cursor: state.lastAnswerCorrect !== null ? 'default' : 'pointer',
                }}
              >
                {/* Position number badge */}
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{
                    background: isActive ? 'var(--clay-peach)' : 'var(--clay-surface-strong)',
                    color: isActive ? 'white' : 'var(--clay-muted)',
                  }}
                >
                  {idx + 1}
                </span>

                {/* Filled letter */}
                <span
                  className="tifinagh-text text-xl md:text-2xl font-bold"
                  style={{
                    color: isFilled ? 'var(--clay-ink)' : 'rgba(0,0,0,0.06)',
                    opacity: isFilled ? 1 : 0,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {filledSlots[idx] || ''}
                </span>

                {/* Active slot blinking cursor */}
                {isActive && !isFilled && (
                  <span
                    className="absolute bottom-1.5 w-3 h-0.5 rounded-full animate-pulse"
                    style={{ background: 'var(--clay-peach)' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ───────── Letter pool keyboard (12-16 letters) ───────── */}
      {!showReveal && (
        <div className="max-w-lg mx-auto px-2 mb-6">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {letterPool.map((letter, idx) => {
              const exhausted = isLetterExhausted(letter)

              return (
                <button
                  key={letter}
                  onClick={() => handleLetterTap(letter)}
                  disabled={exhausted || state.lastAnswerCorrect !== null}
                  className="tifinagh-text flex items-center justify-center transition-all duration-150 hover:-translate-y-1 hover:rotate-2 active:scale-90"
                  style={{
                    width: 'clamp(44px, 10vw, 56px)',
                    height: 'clamp(48px, 11vw, 60px)',
                    borderRadius: '18px',
                    border: exhausted ? '2px solid transparent' : '3px solid #ffffff',
                    background: exhausted
                      ? 'var(--clay-surface-strong)'
                      : keyTints[idx % keyTints.length],
                    color: exhausted
                      ? 'var(--clay-muted-soft)'
                      : 'var(--clay-ink)',
                    opacity: exhausted ? 0.3 : 1,
                    boxShadow: exhausted ? 'none' : '0 6px 14px rgba(61, 44, 20, 0.09)',
                    cursor: exhausted || state.lastAnswerCorrect !== null ? 'default' : 'pointer',
                    fontSize: 'clamp(16px, 4vw, 24px)',
                    fontWeight: 700,
                  }}
                  title={letter}
                >
                  {letter}
                </button>
              )
            })}
          </div>
          <p className="text-center mt-3 text-xs" style={{ color: 'var(--clay-muted-soft)' }}>
            اختر الحروف المناسبة — {letterPool.length} حرف متاح
          </p>
        </div>
      )}

      {/* ───────── Action buttons ───────── */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {!showReveal && (
          <>
            {/* Backspace */}
            <button
              onClick={handleBackspace}
              disabled={state.lastAnswerCorrect !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                borderRadius: '12px',
                border: '1px solid var(--clay-hairline)',
                background: 'var(--clay-canvas)',
                color: 'var(--clay-ink)',
                opacity: state.lastAnswerCorrect !== null ? 0.4 : 1,
                cursor: state.lastAnswerCorrect !== null ? 'not-allowed' : 'pointer',
              }}
            >
              <Delete className="w-4 h-4" />
              مسح
            </button>

            {/* Check answer */}
            <button
              onClick={handleCheckAnswer}
              disabled={!allSlotsFilled || state.lastAnswerCorrect !== null}
              className={`clay-btn-primary inline-flex items-center gap-1.5 ${
                !allSlotsFilled || state.lastAnswerCorrect !== null ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <Check className="w-5 h-5" />
              تحقق
            </button>
          </>
        )}

        {(showReveal || hasAnswered) && (
          <button onClick={handleNext} className="clay-btn-primary animate-pop-in">
            {isLastPuzzle ? 'انهاء' : 'التالي'}
            <ArrowRight className="w-5 h-5 inline mr-2" />
          </button>
        )}
      </div>

      {showParticles && (
        <ParticleBurst
          originX={particleOrigin.x}
          originY={particleOrigin.y}
          count={16}
          onComplete={() => setShowParticles(false)}
        />
      )}

      {showFloatingScore && (
        <FloatingScore
          points={15}
          startX={particleOrigin.x}
          startY={particleOrigin.y}
          onComplete={() => setShowFloatingScore(false)}
        />
      )}
    </div>
  )
}
