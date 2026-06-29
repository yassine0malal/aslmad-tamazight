import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '@/context/GameContext'
import { ArrowRight, Check, Clock, X } from 'lucide-react'
import { choiceLabels } from '@/data/constants'
import { assetUrl } from '@/lib/utils'

export default function AmsasaRiddleView() {
  const { state, dispatch } = useGame()

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [disabledOptionIds, setDisabledOptionIds] = useState<string[]>([])
  const [timerSeconds, setTimerSeconds] = useState(20)
  const [timerActive, setTimerActive] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)
  const [inputLocked, setInputLocked] = useState(false)
  const [passedOnce, setPassedOnce] = useState(false)
  const [announceMessage, setAnnounceMessage] = useState<string | null>(null)
  const passTimeoutRef = useRef<number | null>(null)

  const challenge = state.game4Deck[state.currentPuzzleIndex]
  const activeTeam = state.teams[state.activeTeamIndex]
  const totalRounds = state.game4Deck.length
  const roundNumber = Math.min(state.currentPuzzleIndex + 1, totalRounds)
  const correctOption = challenge?.options.find(
    (option) => option.id === challenge.correctAnswerId,
  )
  const imageSrc = challenge
    ? assetUrl(challenge.imageAsset)
    : ''

  const progressPct = useMemo(() => {
    if (totalRounds === 0) return 0
    return Math.round((state.currentPuzzleIndex / totalRounds) * 100)
  }, [state.currentPuzzleIndex, totalRounds])

  useEffect(() => {
    setSelectedOptionId(null)
    setDisabledOptionIds([])
    setTimerSeconds(20)
    setTimerActive(false)
    setTimerExpired(false)
    setInputLocked(false)
    setPassedOnce(false)
    setAnnounceMessage(null)
    if (passTimeoutRef.current !== null) {
      window.clearTimeout(passTimeoutRef.current)
      passTimeoutRef.current = null
    }
  }, [state.currentPuzzleIndex, challenge?.id])

  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) return

    const timer = window.setTimeout(() => {
      setTimerSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => clearTimeout(timer)
  }, [timerActive, timerSeconds])

  useEffect(() => {
    return () => {
      if (passTimeoutRef.current !== null) {
        window.clearTimeout(passTimeoutRef.current)
        passTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (timerSeconds !== 0 || !timerActive || timerExpired) return

    setTimerExpired(true)
    setTimerActive(false)
    setInputLocked(true)
    dispatch({ type: 'ANSWER_INCORRECT' })
    if (!passedOnce) {
      setPassedOnce(true)
      setAnnounceMessage('انتهى الوقت! +0 نقطة. تم تمرير السؤال للفريق الآخر.')
      passTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'SWITCH_TEAM' })
        setInputLocked(false)
        setSelectedOptionId(null)
        passTimeoutRef.current = null
      }, 1200)
      return
    }

    setAnnounceMessage('انتهى الوقت مرتين. الانتقال إلى السؤال التالي.')
    passTimeoutRef.current = window.setTimeout(() => {
      dispatch({ type: 'SWITCH_TEAM' })
      dispatch({ type: 'NEXT_PUZZLE' })
      passTimeoutRef.current = null
    }, 1200)
  }, [timerSeconds, timerActive, timerExpired, passedOnce, dispatch])

  const handleOptionClick = useCallback(
    (optionId: string) => {
      if (inputLocked || state.lastAnswerCorrect !== null) return
      if (disabledOptionIds.includes(optionId)) return
      setSelectedOptionId(optionId)
    },
    [disabledOptionIds, inputLocked, state.lastAnswerCorrect],
  )

  const handleSubmit = useCallback(() => {
    if (!challenge || !selectedOptionId || inputLocked || state.lastAnswerCorrect !== null)
      return

    const isCorrect = selectedOptionId === challenge.correctAnswerId
    if (isCorrect) {
      setInputLocked(true)
      const points = Math.max(20 - disabledOptionIds.length * 5, 0)
      dispatch({ type: 'ANSWER_CORRECT', payload: { points } })
      window.setTimeout(() => {
        dispatch({ type: 'SWITCH_TEAM' })
        dispatch({ type: 'NEXT_PUZZLE' })
      }, 1100)
      return
    }

    setInputLocked(true)
    dispatch({ type: 'ANSWER_INCORRECT' })
    if (!passedOnce) {
      setPassedOnce(true)
      setAnnounceMessage('إجابة غير صحيحة +0 نقطة. تم تمرير السؤال للفريق الآخر.')
      window.setTimeout(() => {
        dispatch({ type: 'SWITCH_TEAM' })
        setInputLocked(false)
        setSelectedOptionId(null)
      }, 1100)
      return
    }

    setAnnounceMessage('إجابة خاطئة مرة أخرى. الانتقال إلى السؤال التالي.')
    window.setTimeout(() => {
      dispatch({ type: 'SWITCH_TEAM' })
      dispatch({ type: 'NEXT_PUZZLE' })
    }, 1100)
  }, [
    challenge,
    dispatch,
    disabledOptionIds.length,
    inputLocked,
    passedOnce,
    selectedOptionId,
    state.lastAnswerCorrect,
  ])

  if (!challenge) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="clay-body-lg" style={{ color: 'var(--clay-ink)' }}>
          جارٍ تحضير اللعبة...
        </p>
      </div>
    )
  }

  const isCorrectAnswerRevealed = state.lastAnswerCorrect === true
  const timerPct = (timerSeconds / 20) * 100
  const timerColor =
    timerSeconds <= 5
      ? 'var(--clay-error)'
      : timerSeconds <= 10
        ? 'var(--clay-warning)'
        : 'var(--clay-lavender)'

  return (
    <div className="min-h-screen w-full pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-8">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="clay-title-lg mb-1" style={{ color: 'var(--clay-ink)' }}>
              أمساسا ن توالفت
            </h2>              <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
              🖼️ لعبة الصورة والتخمين الجماعي. اختر الاسم الصحيح من بين 4 خيارات.
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
          {/* Image + Timer */}
          <div>
            <div
              className="clay-card overflow-hidden"
            >
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
                  onClick={() => {
                    if (!timerActive) {
                      setTimerSeconds(20)
                      setTimerActive(true)
                    }
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: timerActive ? 'var(--clay-surface-soft)' : 'var(--clay-success)',
                    color: timerActive ? 'var(--clay-lavender)' : 'white',
                  }}
                >
                  {timerActive ? 'جارٍ العد' : 'بدء الوقت'}
                </button>
              </div>

              {/* Image */}
              <div className="p-6 flex flex-col items-center justify-center gap-5">
                <div
                  className="rounded-3xl p-6 shadow-inner w-full"
                  style={{
                    background: 'var(--clay-surface-soft)',
                    border: '1px solid var(--clay-hairline-soft)',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={correctOption?.meaning ?? 'Amsasa n Twlaft'}
                    className="h-64 w-full object-contain"
                  />
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
                <div className="text-center">
                  <p className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
                    الكلمة العربية
                  </p>
                  <p className="clay-title-lg mt-2" style={{ color: 'var(--clay-ink)' }}>
                    {correctOption?.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {challenge.options.map((option, idx) => {
              const isDisabled = disabledOptionIds.includes(option.id)
              const isSelected = selectedOptionId === option.id
              const isCorrect = option.id === challenge.correctAnswerId
              const showCorrect = isCorrectAnswerRevealed && isCorrect

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isDisabled || inputLocked || state.lastAnswerCorrect === true}
                  className="w-full rounded-2xl p-4 text-right transition-all duration-300 flex items-center justify-between gap-4"
                  style={{
                    border: showCorrect
                      ? '2px solid var(--clay-success)'
                      : isDisabled
                        ? '2px solid var(--clay-error)'
                        : isSelected
                          ? '2px solid var(--clay-lavender)'
                          : '2px solid var(--clay-hairline)',
                    background: showCorrect
                      ? 'var(--clay-surface-soft)'
                      : isDisabled
                        ? 'var(--clay-surface-soft)'
                        : isSelected
                          ? 'var(--clay-canvas)'
                          : 'white',
                    color: 'var(--clay-ink)',
                    opacity: isDisabled && !showCorrect ? 0.6 : 1,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold shrink-0"
                      style={{
                        background: 'var(--clay-surface-soft)',
                        color: 'var(--clay-ink)',
                      }}
                    >
                      {choiceLabels[idx]}
                    </span>
                    <div className="text-left">
                      <p className="tifinagh-text text-3xl font-bold">{option.tifinaghText}</p>
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
                  {isDisabled && !showCorrect && (
                    <div
                      className="w-8 h-8 flex items-center justify-center shrink-0"
                      style={{ borderRadius: '9999px', background: 'var(--clay-error)' }}
                    >
                      <X className="w-5 h-5 text-white" />
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
                    النقاط المحتملة
                  </p>
                  <p
                    className="text-xl font-bold mt-1"
                    style={{ color: 'var(--clay-success)' }}
                  >
                    {Math.max(20 - disabledOptionIds.length * 5, 0)}
                  </p>
                </div>
              </div>
              {disabledOptionIds.length > 0 && (
                <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--clay-hairline)' }}>
                  <p className="clay-body-sm" style={{ color: 'var(--clay-muted-soft)' }}>
                    خيارات مغلقة: {disabledOptionIds.length} / 4
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !selectedOptionId || inputLocked || state.lastAnswerCorrect === true
            }
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold text-white transition-all ${
              selectedOptionId && !inputLocked && state.lastAnswerCorrect !== true
                ? 'clay-btn-primary'
                : 'clay-btn-primary opacity-40 cursor-not-allowed'
            }`}
          >
            {state.lastAnswerCorrect === false ? 'صحح الاختيار' : 'تحقق'}
            <ArrowRight className="w-5 h-5" />
          </button>
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
                    ? 'انتهى الوقت! +0 نقطة. تم تمرير السؤال للفريق الآخر.'
                    : 'إجابة غير صحيحة +0 نقطة. تم تمرير السؤال للفريق الآخر.')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
