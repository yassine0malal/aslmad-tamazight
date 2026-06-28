import { useGame } from '@/context/GameContext'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import ParticleBurst from '@/components/ParticleBurst'
import FloatingScore from '@/components/FloatingScore'
import { Check, X, ArrowRight, Volume2 } from 'lucide-react'
import { routes } from '@/lib/routes'

export default function AmudruMatchView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [showParticles, setShowParticles] = useState(false)
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 })
  const [showFloatingScore, setShowFloatingScore] = useState(false)
  const [shakeCard, setShakeCard] = useState(false)
  const [showReveal, setShowReveal] = useState(false)
  const [cardEnter, setCardEnter] = useState(false)
  const [typedLetters, setTypedLetters] = useState('')

  // Redirect to hub if no active game session
  useEffect(() => {
    if (state.teams.length === 0) {
      navigate(routes.gameHub, { replace: true })
    }
  }, [state.teams.length, navigate])

  const puzzle = state.game2Deck[state.currentPuzzleIndex]
  const animalImageSrc = puzzle
    ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${puzzle.animalImage}`
    : ''
  const isLastPuzzle = state.currentPuzzleIndex >= state.game2Deck.length - 1
  const totalPuzzles = state.game2Deck.length

  const progressPct = useMemo(() => {
    if (totalPuzzles === 0) return 0
    return Math.round((state.currentPuzzleIndex / totalPuzzles) * 100)
  }, [state.currentPuzzleIndex, totalPuzzles])

  useEffect(() => {
    setCardEnter(false)
    setShowReveal(false)
    setTypedLetters('')
    const timer = setTimeout(() => setCardEnter(true), 100)
    return () => clearTimeout(timer)
  }, [state.currentPuzzleIndex])

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

  const handleAnswerClick = useCallback(
    (answer: string) => {
      if (state.lastAnswerCorrect !== null) return
      dispatch({ type: 'ANSWER_SELECTED', payload: { answer } })
    },
    [state.lastAnswerCorrect, dispatch],
  )

  const handleCheckAnswer = useCallback(() => {
    if (!state.selectedAnswer || state.lastAnswerCorrect !== null || !puzzle) return

    if (state.selectedAnswer === puzzle.correctLetter) {
      const cardEl = document.getElementById('animal-card')
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect()
        setParticleOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }
      dispatch({ type: 'ANSWER_CORRECT' })
      setShowParticles(true)
      setShowFloatingScore(true)
      setShowReveal(true)
    } else {
      setShakeCard(true)
      dispatch({ type: 'ANSWER_INCORRECT' })
      setTimeout(() => setShakeCard(false), 400)
    }
  }, [state.selectedAnswer, state.lastAnswerCorrect, puzzle, dispatch])

  const hasAnswered = state.lastAnswerCorrect !== null

  const handleNext = useCallback(() => {
    setShowReveal(false)
    setShowFloatingScore(false)
    dispatch({ type: 'NEXT_PUZZLE' })
    dispatch({ type: 'SWITCH_TEAM' })
    if (isLastPuzzle) navigate(routes.gameHub)
  }, [dispatch, isLastPuzzle, navigate])

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
      {/* Progress bar */}
      <div className="max-w-3xl mx-auto mb-8">
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
        {/* Dot indicators */}
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

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="clay-title-lg mb-1" style={{ color: 'var(--clay-ink)' }}>
          مباراة الحيوانات
        </h2>          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            🐾 ما هو الحرف الأول من اسم هذا الحيوان؟
          </p>
      </div>

      {/* Animal card */}
      <div className="flex justify-center mb-8">
        <div
          id="animal-card"
          className="clay-card w-72 h-80 md:w-80 md:h-96 flex flex-col items-center justify-center overflow-hidden transition-all duration-600"
          style={{
            opacity: cardEnter ? 1 : 0,
            transform: cardEnter ? 'scale(1)' : 'scale(0.75)',
            animation: shakeCard ? 'shake 0.4s ease' : showReveal ? 'float 3s ease-in-out infinite' : undefined,
            border: showReveal ? '2px solid var(--clay-success)' : undefined,
          }}
        >
          <div className="flex-1 w-full flex items-center justify-center p-6">
            <img
              src={animalImageSrc}
              alt={puzzle.animalName}
              className="max-w-full max-h-48 object-contain transition-all duration-500"
              style={showReveal ? { filter: 'drop-shadow(0 0 10px rgba(34,197,94,0.2))' } : {}}
            />
          </div>

          <div className="w-full text-center pb-6 px-4">
            <p className="clay-title-md" style={{ color: 'var(--clay-ink)' }}>
              {puzzle.animalName}
            </p>
            {!showReveal && (
              <p className="clay-body-sm mt-1" style={{ color: 'var(--clay-ochre)' }}>
                ما هو الحرف الاول؟
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tifinagh reveal */}
      {showReveal && (
        <div className="text-center mb-8 animate-pop-in">
          <div className="inline-block">
            <p
              className="tifinagh-text text-4xl md:text-5xl font-bold mb-2"
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

      {/* Result feedback */}
      {state.lastAnswerCorrect === true && (
        <div className="text-center mb-6 animate-pop-in">
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
        <div className="text-center mb-6 animate-pop-in">
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
              😅 لا بأس! حاول مرة أخرى!
            </span>
          </div>
        </div>
      )}

      {/* Answer options */}
      {!showReveal && (
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 max-w-md mx-auto">
          {puzzle.options.map((option, idx) => {
            const isSelected = state.selectedAnswer === option
            const isCorrect = option === puzzle.correctLetter
            const showResult = state.lastAnswerCorrect !== null

            return (
              <button
                key={idx}
                onClick={() => handleAnswerClick(option)}
                disabled={state.lastAnswerCorrect !== null}
                className="w-20 h-24 md:w-24 md:h-28 flex flex-col items-center justify-center gap-1 transition-all duration-300"
                style={{
                  borderRadius: '16px',
                  border: showResult && isCorrect
                    ? '2px solid var(--clay-success)'
                    : showResult && isSelected && !isCorrect
                      ? '2px solid var(--clay-error)'
                      : isSelected
                        ? '2px solid var(--clay-peach)'
                        : '1px solid var(--clay-hairline)',
                  background:
                    showResult && isCorrect
                      ? 'var(--clay-success)'
                      : showResult && isSelected && !isCorrect
                        ? 'var(--clay-error)'
                        : isSelected
                          ? 'var(--clay-surface-soft)'
                          : 'var(--clay-canvas)',
                  color:
                    showResult && (isCorrect || (isSelected && !isCorrect))
                      ? 'white'
                      : 'var(--clay-ink)',
                  opacity: state.lastAnswerCorrect !== null && !isCorrect && !isSelected ? 0.4 : 1,
                }}
              >
                <span className="tifinagh-text text-2xl md:text-3xl font-bold">{option}</span>
                <span className="clay-caption" style={{ opacity: 0.5 }}>
                  {['أ', 'ب', 'ج', 'د'][idx]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4">
        {!showReveal && (
          <button
            onClick={handleCheckAnswer}
            disabled={!state.selectedAnswer || state.lastAnswerCorrect !== null}
            className={`clay-btn-primary ${!state.selectedAnswer || state.lastAnswerCorrect !== null ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Check className="w-5 h-5 inline mr-2" />
            تحقق
          </button>
        )}

        {(showReveal || hasAnswered) && (
          <button onClick={handleNext} className="clay-btn-primary animate-pop-in">
            {isLastPuzzle ? 'انهاء' : 'التالي'}
            <ArrowRight className="w-5 h-5 inline ml-2" />
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
