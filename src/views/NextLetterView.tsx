import { useGame } from '@/context/GameContext'
import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import ParticleBurst from '@/components/ParticleBurst'
import FloatingScore from '@/components/FloatingScore'
import { Check, X, ArrowRight } from 'lucide-react'
import { routes } from '@/lib/routes'

export default function NextLetterView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [showParticles, setShowParticles] = useState(false)
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 })
  const [showFloatingScore, setShowFloatingScore] = useState(false)
  const [shakeCards, setShakeCards] = useState(false)
  const [revealedCard, setRevealedCard] = useState(false)

  const puzzle = state.game1Deck[state.currentPuzzleIndex]
  const isLastPuzzle = state.currentPuzzleIndex >= state.game1Deck.length - 1
  const totalPuzzles = state.game1Deck.length

  const progressPct = useMemo(() => {
    if (totalPuzzles === 0) return 0
    return Math.round((state.currentPuzzleIndex / totalPuzzles) * 100)
  }, [state.currentPuzzleIndex, totalPuzzles])

  const handleAnswerClick = useCallback(
    (answer: string) => {
      if (state.lastAnswerCorrect !== null) return
      dispatch({ type: 'ANSWER_SELECTED', payload: { answer } })
    },
    [state.lastAnswerCorrect, dispatch],
  )

  const handleCheckAnswer = useCallback(() => {
    if (!state.selectedAnswer || state.lastAnswerCorrect !== null || !puzzle) return

    if (state.selectedAnswer === puzzle.correctAnswer) {
      const cardEl = document.getElementById('question-card')
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect()
        setParticleOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }
      dispatch({ type: 'ANSWER_CORRECT' })
      setShowParticles(true)
      setShowFloatingScore(true)
      setRevealedCard(true)
    } else {
      setShakeCards(true)
      dispatch({ type: 'ANSWER_INCORRECT' })
      setTimeout(() => setShakeCards(false), 400)
    }
  }, [state.selectedAnswer, state.lastAnswerCorrect, puzzle, dispatch])

  const handleNext = useCallback(() => {
    setRevealedCard(false)
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
            🔤 {state.currentPuzzleIndex + 1} / {totalPuzzles}
          </span>
          <span className="clay-caption" style={{ color: 'var(--clay-lavender)' }}>
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
              background: `linear-gradient(to right, var(--clay-lavender), var(--clay-mint))`,
            }}
          />
        </div>
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {state.game1Deck.map((_, idx) => {
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
                        ? 'var(--clay-lavender)'
                        : 'var(--clay-surface-strong)',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="clay-title-lg mb-1" style={{ color: 'var(--clay-ink)' }}>
          تحدي الحرف التالي
        </h2>          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            🤔 ما هو الحرف التالي في التسلسل؟
          </p>
      </div>

      {/* Sequence cards */}
      <div
        className={`flex items-center justify-center gap-3 md:gap-5 mb-8 flex-wrap ${shakeCards ? 'animate-shake' : ''}`}
      >
        {puzzle.sequence.map((letter, idx) => (
          <div
            key={`shown-${idx}`}
            className="clay-card w-24 h-32 md:w-32 md:h-40 flex flex-col items-center justify-center"
          >
            <span
              className="tifinagh-text text-3xl md:text-5xl font-bold"
              style={{ color: 'var(--clay-ink)' }}
            >
              {letter}
            </span>
          </div>
        ))}

        <ArrowRight className="w-5 h-5 hidden md:block" style={{ color: 'var(--clay-coral)' }} />

        <div
          id="question-card"
          className="clay-card w-24 h-32 md:w-32 md:h-40 flex flex-col items-center justify-center"
          style={{
            background: revealedCard ? 'var(--clay-surface-soft)' : undefined,
            border: revealedCard
              ? '2px solid var(--clay-success)'
              : '1px solid var(--clay-hairline)',
          }}
        >
          {revealedCard ? (
            <span
              className="tifinagh-text text-3xl md:text-5xl font-bold animate-pop-in"
              style={{ color: 'var(--clay-success)' }}
            >
              {puzzle.correctAnswer}
            </span>
          ) : (
            <span className="text-3xl md:text-5xl font-bold" style={{ color: 'var(--clay-lavender)' }}>
              ?
            </span>
          )}
        </div>
      </div>

      {/* Hint */}
      {state.showHint && (
        <div className="text-center mb-6 animate-fade-in-up">
          <p className="clay-body-lg italic" style={{ color: 'var(--clay-ochre)' }}>
            {puzzle.hint}
          </p>
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
              ⭐ جيد! +10 نقاط ⭐
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
              😊 لا تستسلم! حاول مرة أخرى!
            </span>
          </div>
        </div>
      )}

      {/* Answer options */}
      <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap mb-8 max-w-lg mx-auto">
        {puzzle.options.map((option, idx) => {
          const isSelected = state.selectedAnswer === option
          const isCorrect = option === puzzle.correctAnswer
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
                      ? '2px solid var(--clay-lavender)'
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
                خيار {idx + 1}
              </span>
            </button>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleCheckAnswer}
          disabled={!state.selectedAnswer || state.lastAnswerCorrect !== null}
          className={`clay-btn-primary ${!state.selectedAnswer || state.lastAnswerCorrect !== null ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Check className="w-5 h-5 inline mr-2" />
          تحقق
        </button>

        {state.lastAnswerCorrect !== null && (
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
          count={14}
          onComplete={() => setShowParticles(false)}
        />
      )}

      {showFloatingScore && (
        <FloatingScore
          points={10}
          startX={particleOrigin.x}
          startY={particleOrigin.y}
          onComplete={() => setShowFloatingScore(false)}
        />
      )}
    </div>
  )
}
