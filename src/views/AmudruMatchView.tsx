import { useGame } from '@/context/GameContext'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import ParticleBurst from '@/components/ParticleBurst'
import FloatingScore from '@/components/FloatingScore'
import { Check, X, ArrowRight, Volume2, Delete } from 'lucide-react'
import { routes } from '@/lib/routes'
import { TIFINAGH_LETTERS } from '@/data/gameData'

export default function AmudruMatchView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [showParticles, setShowParticles] = useState(false)
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 })
  const [showFloatingScore, setShowFloatingScore] = useState(false)
  const [shakeCard, setShakeCard] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  const [typedLetters, setTypedLetters] = useState('')

  // ─── Word construction state ───
  const [filledSlots, setFilledSlots] = useState<string[]>([])
  const [currentSlot, setCurrentSlot] = useState(0)
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> >()

  const puzzle = state.game2Deck[state.currentPuzzleIndex]
  const animalImageSrc = puzzle ? puzzle.animalImage : ''
  const isLastPuzzle = state.currentPuzzleIndex >= state.game2Deck.length - 1
  const totalPuzzles = state.game2Deck.length
  const wordLength = puzzle?.fullWordTifinagh.length || 0
  const allSlotsFilled = filledSlots.length > 0 && filledSlots.every((s) => s !== '')

  // ─── Curated letter pool (12-16 letters) ───
  const letterPool = useMemo(() => {
    if (!puzzle) return []
    const wordLetters = Array.from(new Set(puzzle.fullWordTifinagh.split('')))
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
    for (const char of puzzle.fullWordTifinagh) {
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
      setFilledSlots(new Array(puzzle.fullWordTifinagh.length).fill(''))
      setCurrentSlot(0)
    }
  }, [state.currentPuzzleIndex])

  // ─── Typewriter reveal on correct answer ───
  useEffect(() => {
    if (showReveal && puzzle) {
      const letters = puzzle.fullWordTifinagh.split('')
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
    if (userWord === puzzle.fullWordTifinagh) {
      const cardEl = document.getElementById('animal-card')
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
    <div className="min-h-screen w-full pb-12">
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
          مباراة الحيوانات
        </h2>
        <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
          🐾 قم ببناء كلمة ⵜⵉⴼⵉⵏⴰⵖ للحيوان!
        </p>
      </div>

      {/* ───────── Animal card ───────── */}
      <div className="flex justify-center mb-6">
        <div
          id="animal-card"
          className="clay-card w-64 md:w-72 flex flex-col items-center justify-center overflow-hidden transition-all duration-600 py-5 px-4"
          style={{
            borderRadius: '24px',
            animation: shakeCard ? 'shake 0.4s ease' : showReveal ? 'float 3s ease-in-out infinite' : undefined,
            border: showReveal ? '2px solid var(--clay-success)' : undefined,
          }}
        >
          <img
            src={animalImageSrc}
            alt={puzzle.animalName}
            className="h-28 md:h-36 object-contain transition-all duration-500 mb-3"
            style={showReveal ? { filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.2))' } : {}}
          />
          <p className="clay-title-md" style={{ color: 'var(--clay-ink)' }}>
            {puzzle.animalName}
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
              {puzzle.fullWordLatin}
            </p>
            <button
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ background: 'var(--clay-surface-soft)', color: 'var(--clay-lavender)' }}
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(puzzle.animalName)
                utterance.lang = 'ar-SA'
                speechSynthesis.speak(utterance)
              }}
            >
              <Volume2 className="w-4 h-4" />
              استمع ({puzzle.pronunciation})
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
                  width: 'clamp(36px, 9vw, 52px)',
                  height: 'clamp(44px, 11vw, 60px)',
                  borderRadius: '14px',
                  border: isActive
                    ? '2.5px solid var(--clay-peach)'
                    : isFilled
                      ? '2px solid var(--clay-lavender)'
                      : '2px dashed var(--clay-hairline)',
                  background: isFilled ? 'var(--clay-surface-soft)' : 'var(--clay-canvas)',
                  boxShadow: isActive ? '0 0 0 3px rgba(232, 185, 74, 0.2)' : 'none',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
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
            {letterPool.map((letter) => {
              const exhausted = isLetterExhausted(letter)

              return (
                <button
                  key={letter}
                  onClick={() => handleLetterTap(letter)}
                  disabled={exhausted || state.lastAnswerCorrect !== null}
                  className="tifinagh-text flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-90"
                  style={{
                    width: 'clamp(42px, 10vw, 54px)',
                    height: 'clamp(46px, 11vw, 58px)',
                    borderRadius: '14px',
                    border: exhausted
                      ? '1px solid var(--clay-hairline)'
                      : '2px solid var(--clay-lavender)',
                    background: exhausted
                      ? 'var(--clay-surface-strong)'
                      : 'var(--clay-surface-soft)',
                    color: exhausted
                      ? 'var(--clay-muted-soft)'
                      : 'var(--clay-ink)',
                    opacity: exhausted ? 0.3 : 1,
                    cursor: exhausted || state.lastAnswerCorrect !== null ? 'default' : 'pointer',
                    fontSize: 'clamp(16px, 4vw, 22px)',
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
