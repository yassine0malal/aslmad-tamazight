import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '@/context/GameContext'
import WordImage from '@/components/WordImage'
import { ArrowRight, Check, Clock, X } from 'lucide-react'
import { choiceLabels } from '@/data/constants'
import type { RiddleChallenge } from '@/types/game'

const ROUND_SECONDS = 20
const POINTS_CORRECT = 20
const ADVANCE_DELAY_MS = 1100
const TIMEOUT_ADVANCE_DELAY_MS = 1600

const optionTints = ['#fff7d6', '#e7f8ef', '#eee7ff', '#ffede4']

export default function AmsasaRiddleView() {
  const { state } = useGame()
  const challenge = state.game4Deck[state.currentPuzzleIndex]

  if (!challenge) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="clay-body-lg" style={{ color: 'var(--clay-ink)' }}>
          جارٍ تحضير اللعبة...
        </p>
      </div>
    )
  }

  // A new question remounts the round, so its answers and clock start fresh.
  return (
    <RiddleRound
      key={`${state.currentPuzzleIndex}-${challenge.id}`}
      challenge={challenge}
    />
  )
}

function RiddleRound({ challenge }: { challenge: RiddleChallenge }) {
  const { state, dispatch } = useGame()

  const activeTeam = state.teams[state.activeTeamIndex]
  const totalRounds = state.game4Deck.length
  const roundNumber = Math.min(state.currentPuzzleIndex + 1, totalRounds)
  const correctOption = challenge.options.find(
    (option) => option.id === challenge.correctAnswerId,
  )

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(ROUND_SECONDS)
  const [timerActive, setTimerActive] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)
  const [inputLocked, setInputLocked] = useState(false)
  const [announceMessage, setAnnounceMessage] = useState<string | null>(null)

  const secondsRef = useRef(ROUND_SECONDS)
  const advanceTimeoutRef = useRef<number | null>(null)

  const progressPct = useMemo(() => {
    if (totalRounds === 0) return 0
    return Math.round((state.currentPuzzleIndex / totalRounds) * 100)
  }, [state.currentPuzzleIndex, totalRounds])

  /** Hand the turn to the next team and load a new question. */
  const handOverTurn = useCallback(
    (delay: number) => {
      advanceTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'SWITCH_TEAM' })
        dispatch({ type: 'NEXT_PUZZLE' })
        advanceTimeoutRef.current = null
      }, delay)
    },
    [dispatch],
  )

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current)
        advanceTimeoutRef.current = null
      }
    }
  }, [])

  const finishRoundByTimeout = useCallback(() => {
    setTimerExpired(true)
    setTimerActive(false)
    setInputLocked(true)
    setSelectedOptionId(null)
    dispatch({ type: 'ANSWER_INCORRECT' })
    setAnnounceMessage('انتهى الوقت! +0 نقطة. سؤال جديد للفريق الآخر.')
    handOverTurn(TIMEOUT_ADVANCE_DELAY_MS)
  }, [dispatch, handOverTurn])

  useEffect(() => {
    if (!timerActive) return

    const interval = window.setInterval(() => {
      secondsRef.current = Math.max(secondsRef.current - 1, 0)
      setTimerSeconds(secondsRef.current)
      if (secondsRef.current === 0) {
        window.clearInterval(interval)
        finishRoundByTimeout()
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [timerActive, finishRoundByTimeout])

  const startTimer = () => {
    if (timerActive) return
    secondsRef.current = ROUND_SECONDS
    setTimerSeconds(ROUND_SECONDS)
    setTimerExpired(false)
    setTimerActive(true)
  }

  const handleOptionClick = (optionId: string) => {
    if (inputLocked || state.lastAnswerCorrect !== null) return
    setSelectedOptionId(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOptionId || inputLocked || state.lastAnswerCorrect !== null) return

    // The team answered in time — stop the clock so it cannot fire afterwards.
    setTimerActive(false)
    setInputLocked(true)

    if (selectedOptionId === challenge.correctAnswerId) {
      dispatch({ type: 'ANSWER_CORRECT', payload: { points: POINTS_CORRECT } })
      handOverTurn(ADVANCE_DELAY_MS)
      return
    }

    // A wrong choice hands the turn to the next team together with a *new*
    // question — the next team never gets the question the last team failed.
    dispatch({ type: 'ANSWER_INCORRECT' })
    setAnnounceMessage('إجابة غير صحيحة +0 نقطة. سؤال جديد للفريق الآخر.')
    handOverTurn(ADVANCE_DELAY_MS)
  }

  const isAnswerRevealed = state.lastAnswerCorrect === true
  const timerPct = (timerSeconds / ROUND_SECONDS) * 100
  const timerColor =
    timerSeconds <= 5
      ? 'var(--clay-error)'
      : timerSeconds <= 10
        ? 'var(--clay-warning)'
        : 'var(--clay-lavender)'

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
              الجولة {roundNumber} / {totalRounds}
            </span>
            <span className="clay-caption" style={{ color: 'var(--clay-coral)' }}>
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
                background: 'linear-gradient(to right, var(--clay-coral), var(--clay-ochre))',
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--clay-ink)' }}>
              🎭 ⵜⵓⵙⵙⵏⴰ ⵏ ⵜⵡⵍⴰⴼⵜ
            </h2>
            <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
              خمّن الكلمة الأمازيغية من معناها ورمزها. اختر الجواب الصحيح من بين 4 خيارات.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-medium"
              style={{
                background: 'var(--clay-surface-soft)',
                color: 'var(--clay-success)',
              }}
            >
              فريق {activeTeam?.name ?? '---'}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Clue + Timer */}
          <div>
            <div className="clay-card overflow-hidden">
              {/* Header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--clay-hairline)' }}
              >
                <div>
                  <p
                    className="clay-caption-uppercase"
                    style={{ color: 'var(--clay-muted)', letterSpacing: '1.5px' }}
                  >
                    السؤال
                  </p>
                  <p className="clay-title-sm mt-1" style={{ color: 'var(--clay-ink)' }}>
                    اختر الجواب الصحيح
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startTimer}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: timerActive ? 'var(--clay-surface-soft)' : 'var(--clay-success)',
                    color: timerActive ? 'var(--clay-lavender)' : 'white',
                  }}
                >
                  {timerActive ? 'جارٍ العد' : 'بدء الوقت'}
                </button>
              </div>

              {/* Emoji clue */}
              <div className="p-6 flex flex-col items-center justify-center gap-5">
                <div
                  className="rounded-[32px] p-6 w-full"
                  style={{
                    background: 'linear-gradient(160deg, #fff3cf 0%, #ffffff 75%)',
                    border: '3px solid #ffffff',
                    boxShadow: '0 12px 28px rgba(61, 44, 20, 0.09)',
                  }}
                >
                  <div className="h-60 w-full flex items-center justify-center">
                    {correctOption && (
                      <WordImage
                        emoji={correctOption.emoji}
                        size={220}
                        className="animate-kid-bob"
                      />
                    )}
                  </div>
                </div>

                {/* Timer ring */}
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="var(--clay-hairline)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke={timerColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - timerPct / 100)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="w-4 h-4 mx-auto mb-0.5" style={{ color: timerColor }} />
                      <span className="text-lg font-bold" style={{ color: timerColor }}>
                        {timerSeconds}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arabic meaning */}
                <div
                  className="text-center px-6 py-3"
                  style={{
                    background: '#ffffff',
                    borderRadius: '999px',
                    boxShadow: '0 8px 18px rgba(61, 44, 20, 0.08)',
                  }}
                >
                  <p className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
                    الكلمة العربية
                  </p>
                  <p className="clay-title-lg mt-0.5" style={{ color: 'var(--clay-ink)' }}>
                    {correctOption?.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {challenge.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id
              const showCorrect = isAnswerRevealed && option.id === challenge.correctAnswerId

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  disabled={inputLocked || isAnswerRevealed}
                  className="kid-choice w-full p-4 text-right flex items-center justify-between gap-4"
                  style={{
                    border: showCorrect
                      ? '3px solid var(--clay-success)'
                      : isSelected
                        ? '3px solid var(--clay-lavender)'
                        : '3px solid #ffffff',
                    background: showCorrect
                      ? '#eafbf1'
                      : isSelected
                        ? '#ffffff'
                        : optionTints[idx % optionTints.length],
                    color: 'var(--clay-ink)',
                    transform: isSelected && !showCorrect ? 'translateY(-3px)' : undefined,
                    boxShadow: isSelected
                      ? '0 12px 24px rgba(124, 92, 214, 0.16)'
                      : '0 6px 16px rgba(61, 44, 20, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold shrink-0"
                      style={{
                        background: '#ffffff',
                        color: 'var(--clay-muted)',
                        boxShadow: '0 4px 10px rgba(61, 44, 20, 0.07)',
                      }}
                    >
                      {choiceLabels[idx]}
                    </span>
                    <div className="text-left">
                      <p className="tifinagh-text text-3xl md:text-4xl font-bold">
                        {option.tifinaghText}
                      </p>
                      <p className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
                        {option.phoneticText}
                      </p>
                    </div>
                  </div>
                  {showCorrect && (
                    <div
                      className="w-8 h-8 flex items-center justify-center shrink-0"
                      style={{ borderRadius: '9999px', background: 'var(--clay-success)' }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              )
            })}

            {/* Status card */}
            <div className="clay-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                    الحالة الحالية
                  </p>
                  <p className="font-semibold mt-1" style={{ color: 'var(--clay-ink)' }}>
                    {activeTeam?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                    النقاط
                  </p>
                  <p className="text-xl font-bold mt-1" style={{ color: 'var(--clay-success)' }}>
                    {POINTS_CORRECT}
                  </p>
                </div>
              </div>

              {/* Check answer — sits under the current-turn panel */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedOptionId || inputLocked || isAnswerRevealed}
                className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white transition-all ${
                  selectedOptionId && !inputLocked && !isAnswerRevealed
                    ? 'clay-btn-primary'
                    : 'clay-btn-primary opacity-40 cursor-not-allowed'
                }`}
              >
                تحقق
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Result feedback */}
        {state.lastAnswerCorrect === true && (
          <div className="mt-8 animate-pop-in">
            <div
              className="p-5 flex items-center justify-center gap-3 rounded-2xl"
              style={{
                background: 'var(--clay-surface-soft)',
                border: '1px solid var(--clay-success)',
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{ borderRadius: '9999px', background: 'var(--clay-success)' }}
              >
                <Check className="w-6 h-6 text-white" />
              </div>
              <span className="clay-title-sm" style={{ color: 'var(--clay-success)' }}>
                🎉 أحسنت! إجابة صحيحة! سيتم الانتقال للسؤال التالي.
              </span>
            </div>
          </div>
        )}

        {state.lastAnswerCorrect === false && (
          <div className="mt-8 animate-pop-in">
            <div
              className="p-5 flex items-center justify-center gap-3 rounded-2xl"
              style={{
                background: 'var(--clay-surface-soft)',
                border: '1px solid var(--clay-error)',
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{ borderRadius: '9999px', background: 'var(--clay-error)' }}
              >
                <X className="w-6 h-6 text-white" />
              </div>
              <span className="clay-title-sm" style={{ color: 'var(--clay-error)' }}>
                {announceMessage ??
                  (timerExpired
                    ? 'انتهى الوقت! +0 نقطة. سؤال جديد للفريق الآخر.'
                    : 'إجابة غير صحيحة +0 نقطة. سؤال جديد للفريق الآخر.')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
