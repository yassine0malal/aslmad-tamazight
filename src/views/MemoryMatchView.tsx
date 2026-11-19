import { useEffect, useState, useRef } from 'react'
import { useGame } from '@/context/GameContext'
import WordImage from '@/components/WordImage'
import { useNavigate } from 'react-router'
import { ArrowLeft, Sparkles, Brain, Trophy, Eye, Clock } from 'lucide-react'
import { routes } from '@/lib/routes'
import { MEMORY_DIFFICULTY } from '@/data/constants'
import type { MemoryDifficultyLevel } from '@/data/constants'
import { teamImages } from '@/assets/images/teams'

const levelTints: Record<string, string> = {
  BEGINNER: '#e7f8ef',
  MEDIUM: '#fff3cf',
  ADVANCED: '#eee7ff',
}

export default function MemoryMatchView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [previewActive, setPreviewActive] = useState(false)
  const [previewCountdown, setPreviewCountdown] = useState(0)
  const prevDifficulty = useRef<number | null>(state.memoryDifficulty)

  const activeTeam = state.teams[state.activeTeamIndex] || {
    id: 'team-1',
    name: 'الفريق 1',
    score: 0,
    avatar: teamImages['atlas-lions'],
    color: '#1A54F4',
  }

  // ─── Preview phase: show all cards briefly when game starts ───
  useEffect(() => {
    if (state.memoryDeck.length > 0 && state.memoryDifficulty !== prevDifficulty.current) {
      prevDifficulty.current = state.memoryDifficulty
      // Show preview for 4 seconds + 1 extra second per 10 cards beyond 10
      const extraTime = Math.max(0, Math.floor((state.memoryDeck.length - 10) / 10))
      const previewSeconds = Math.min(4 + extraTime, 6) // max 6 seconds
      setPreviewCountdown(previewSeconds)
      setPreviewActive(true)
    }
  }, [state.memoryDifficulty, state.memoryDeck.length])

  // ─── Countdown tick ───
  useEffect(() => {
    if (!previewActive) return
    if (previewCountdown <= 0) {
      setPreviewActive(false)
      return
    }
    const timer = setTimeout(() => {
      setPreviewCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [previewActive, previewCountdown])

  // ─── Match logic (existing) ───
  useEffect(() => {
    if (state.memorySelection.length !== 2 || state.memoryCompleted) return

    const [firstId, secondId] = state.memorySelection
    const firstCard = state.memoryDeck.find((card) => card.id === firstId)
    const secondCard = state.memoryDeck.find((card) => card.id === secondId)
    if (!firstCard || !secondCard) return

    const timeout = window.setTimeout(() => {
      if (firstCard.pairId === secondCard.pairId) {
        dispatch({ type: 'RESET_MEMORY_SELECTION' })
      } else {
        dispatch({ type: 'RESET_MEMORY_SELECTION' })
        dispatch({ type: 'SWITCH_TEAM' })
      }
    }, 1200)

    return () => window.clearTimeout(timeout)
  }, [state.memorySelection, state.memoryCompleted, state.memoryDeck, dispatch])

  const cardCount = state.memoryDeck.length
  const matchedCount = state.memoryDeck.filter((card) => card.isMatched).length
  const isFinished = state.memoryCompleted || (cardCount > 0 && matchedCount === cardCount)

  const handleCardClick = (cardId: string) => {
    if (previewActive || state.memoryCompleted) return
    if (state.memorySelection.length >= 2) return
    const card = state.memoryDeck.find((item) => item.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return
    dispatch({ type: 'SELECT_MEMORY_CARD', payload: { cardId } })
  }

  const handleDifficultySelect = (level: MemoryDifficultyLevel) => {
    dispatch({ type: 'SET_MEMORY_DIFFICULTY', payload: { cardCount: MEMORY_DIFFICULTY[level].cardCount } })
  }

  // ─── Responsive grid & sizing — more aggressive for larger decks ───
  const getGridGap = () => {
    if (cardCount <= 10) return 'gap-3 md:gap-4'
    if (cardCount <= 16) return 'gap-2 md:gap-3'
    return 'gap-1.5 md:gap-2'
  }

  const getGridCols = () => {
    if (cardCount <= 10) return 'grid-cols-5'
    if (cardCount <= 16) return 'grid-cols-4'
    if (cardCount <= 20) return 'grid-cols-5'
    return 'grid-cols-5 sm:grid-cols-6'
  }

  const getCardEmojiSize = () => {
    if (cardCount <= 10) return 72
    if (cardCount <= 16) return 56
    if (cardCount <= 20) return 44
    return 34
  }

  const getCardLabelSize = () => {
    if (cardCount <= 10) return 'text-sm md:text-xl'
    if (cardCount <= 16) return 'text-xs md:text-base'
    if (cardCount <= 20) return 'text-[10px] md:text-sm'
    return 'text-[9px] md:text-xs'
  }

  const getCardBackSize = () => {
    if (cardCount <= 10) return 'text-2xl md:text-4xl'
    if (cardCount <= 16) return 'text-xl md:text-3xl'
    if (cardCount <= 20) return 'text-base md:text-2xl'
    return 'text-sm md:text-lg'
  }

  const getCardAspectRatio = () => {
    if (cardCount <= 10) return 'aspect-[4/5]'
    if (cardCount <= 16) return 'aspect-[3/4]'
    if (cardCount <= 20) return 'aspect-[3/4]'
    return 'aspect-[2/3]'
  }

  const getCardRadius = () => {
    if (cardCount <= 10) return '22px'
    if (cardCount <= 16) return '18px'
    return '14px'
  }

  const getCardPadding = () => {
    if (cardCount <= 10) return 'px-2 py-1'
    if (cardCount <= 16) return 'px-1.5 py-1'
    return 'px-1 py-0.5'
  }

  // If no difficulty selected yet, show the difficulty picker
  if (!state.memoryDifficulty) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
              style={{
                borderRadius: '9999px',
                background: 'var(--clay-surface-soft)',
              }}
            >
              <Brain className="w-10 h-10" style={{ color: 'var(--clay-lavender)' }} />
            </div>
            <h1 className="clay-display-sm mb-3" style={{ color: 'var(--clay-ink)' }}>
              ⵓⵔⴰⵔⵏ ⵏ ⵜⴽⴰⵜⵓⵜ
            </h1>
            <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
              لعبة الذاكرة — اختر مستوى الصعوبة
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {(Object.entries(MEMORY_DIFFICULTY) as [MemoryDifficultyLevel, typeof MEMORY_DIFFICULTY[MemoryDifficultyLevel]][]).map(([level, config]) => (
              <button
                key={level}
                onClick={() => handleDifficultySelect(level)}
                className="group relative overflow-hidden kid-card-hover"
                style={{
                  borderRadius: '28px',
                  border: '3px solid #ffffff',
                  background: `linear-gradient(165deg, ${levelTints[level]} 0%, #fffdf8 82%)`,
                  boxShadow: '0 10px 24px rgba(61, 44, 20, 0.08)',
                }}
              >
                <div className="p-7 sm:p-8 text-center">
                  <span
                    className="w-20 h-20 mx-auto mb-4 flex items-center justify-center text-5xl rounded-full bg-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ boxShadow: '0 8px 18px rgba(61, 44, 20, 0.09)' }}
                    aria-hidden
                  >
                    {config.emoji}
                  </span>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: 'var(--clay-ink)' }}
                  >
                    {config.label}
                  </h3>
                  <p className="clay-body-sm" style={{ color: 'var(--clay-body)' }}>
                    {config.description}
                  </p>
                  <div
                    className="mt-5 inline-flex items-center gap-2 px-6 py-3 text-base font-extrabold text-white transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:scale-[1.03]"
                    style={{
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg,#ffb36b,#ff7a59)',
                      boxShadow: '0 6px 0 #e0683a',
                    }}
                  >
                    <Trophy className="w-5 h-5" />
                    ابدأ اللعبة
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => {
                dispatch({ type: 'RETURN_TO_HUB' })
                navigate(routes.gameHub)
              }}
              className="clay-btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              رجوع
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        {/* ─── Preview Banner ─── */}
        {previewActive && (
          <div
            className="mb-4 p-3 md:p-5 text-center animate-pop-in"
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Eye className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#e8b94a' }} />
              <span
                className="font-bold text-lg md:text-xl"
                style={{ color: '#ffffff' }}
              >
                تذكَّر البطاقات!
              </span>
              <Clock className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#e8b94a' }} />
            </div>
            <p className="text-sm md:text-base mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              البطاقات مكشوفة الآن — ركّز واحفظ مواقعها قبل أن تغلق.
            </p>
            {/* Countdown ring */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse"
                style={{
                  background:
                    previewCountdown <= 2 ? '#ef4444' : previewCountdown <= 4 ? '#e8b94a' : '#22c55e',
                }}
              >
                {previewCountdown}
              </div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                ثانية متبقية
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="clay-title-md mb-1" style={{ color: 'var(--clay-ink)' }}>
              ⵓⵔⴰⵔⵏ ⵏ ⵜⴽⴰⵜⵓⵜ
            </h2>
            <p className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
              لعبة الذاكرة — {cardCount} بطاقة / {cardCount / 2} زوج
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="clay-card px-4 py-3 flex items-center gap-3"
              style={{ borderRadius: '16px' }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  borderRadius: '9999px',
                  background: 'var(--clay-surface-soft)',
                  border: `2px solid ${activeTeam.color}`,
                }}
              >
                <img
                  src={activeTeam.avatar}
                  alt={activeTeam.name}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="text-right">
                <div
                  className="text-sm font-semibold leading-tight"
                  style={{ color: 'var(--clay-ink)' }}
                >
                  {activeTeam.name}
                </div>
                <div className="text-xs font-bold" style={{ color: 'var(--clay-success)' }}>
                  {activeTeam.score} نقطة
                </div>
              </div>
            </div>

            {/* Change difficulty button */}
            <button
              onClick={() => {
                dispatch({ type: 'SET_MEMORY_DIFFICULTY', payload: { cardCount: 0 } })
              }}
              className="clay-btn-secondary text-xs px-3 py-2"
              style={{ borderRadius: '12px', height: 'auto' }}
            >
              تغيير المستوى
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-2 mb-6"
          style={{
            borderRadius: '9999px',
            background: 'var(--clay-hairline)',
          }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              borderRadius: '9999px',
              width: cardCount > 0 ? `${(matchedCount / cardCount) * 100}%` : '0%',
              background: 'linear-gradient(to right, var(--clay-mint), var(--clay-ochre))',
            }}
          />
        </div>

        {/* Game grid */}
        <div className={`grid ${getGridGap()} mb-4 ${getGridCols()}`}>
          {state.memoryDeck.map((card) => {
            const isSelected = state.memorySelection.includes(card.id)
            const showFace = card.isFlipped || card.isMatched
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={
                  previewActive ||
                  card.isMatched ||
                  (state.memorySelection.length >= 2 && !isSelected) ||
                  state.memoryCompleted
                }
                className={`relative ${getCardAspectRatio()} flex flex-col items-center justify-center transition-all duration-300 focus:outline-none ${
                  previewActive ? 'cursor-default' : 'active:scale-[0.97]'
                } ${previewActive ? 'shadow-lg scale-[1.02]' : ''}`}
                style={{
                  borderRadius: getCardRadius(),
                  border: previewActive
                    ? '3px solid #e8b94a'
                    : card.isMatched
                      ? '3px solid var(--clay-success)'
                      : isSelected
                        ? '3px solid var(--clay-lavender)'
                        : '3px solid #ffffff',
                  background: previewActive
                    ? '#ffffff'
                    : card.isMatched
                      ? '#eafbf1'
                      : isSelected
                        ? '#ffffff'
                        : showFace
                          ? 'linear-gradient(160deg, #ffffff 0%, #fff7dd 100%)'
                          : 'linear-gradient(145deg, #c4b1f3 0%, #8f78d2 100%)',
                  boxShadow: previewActive
                    ? '0 8px 24px rgba(232, 185, 74, 0.32)'
                    : card.isMatched
                      ? '0 0 0 4px rgba(34, 197, 94, 0.1), 0 8px 18px rgba(61, 44, 20, 0.08)'
                      : isSelected
                        ? '0 0 0 4px rgba(184, 164, 237, 0.16), 0 10px 20px rgba(61, 44, 20, 0.1)'
                        : showFace
                          ? '0 8px 18px rgba(61, 44, 20, 0.08)'
                          : '0 10px 20px rgba(90, 70, 140, 0.22)',
                }}
              >
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-center ${getCardPadding()}`}>
                  {(showFace || previewActive) ? (
                    <>
                      <WordImage
                        emoji={card.emoji}
                        size={getCardEmojiSize()}
                        className="mb-2"
                      />
                              {cardCount <= 20 && (
                        <div
                          className={`${getCardLabelSize()} font-bold tracking-widest leading-tight mt-1`}
                          style={{ color: 'var(--clay-ink)' }}
                        >
                          {card.label}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className={`${getCardBackSize()} font-bold`}
                        style={{ color: 'rgba(255,255,255,0.92)' }}
                      >
                        ⵣ
                      </div>
                      <div
                        className="text-[10px] md:text-xs mt-1 leading-tight font-semibold"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                      >
                        اقلب البطاقة
                      </div>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Stats and controls */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          <div
            className="clay-card px-3 py-2 md:px-4 md:py-3"
            style={{ borderRadius: '14px' }}
          >
            <div
              className="clay-caption mb-0.5"
              style={{ color: 'var(--clay-muted)', fontSize: '10px' }}
            >
              الاختيارات
            </div>
            <div className="font-bold text-sm md:text-base" style={{ color: 'var(--clay-ink)' }}>
              {state.memorySelection.length} / 2
            </div>
          </div>
          <div
            className="clay-card px-3 py-2 md:px-4 md:py-3"
            style={{ borderRadius: '14px' }}
          >
            <div
              className="clay-caption mb-0.5"
              style={{ color: 'var(--clay-muted)', fontSize: '10px' }}
            >
              الأزواج
            </div>
            <div className="font-bold text-sm md:text-base" style={{ color: 'var(--clay-mint)' }}>
              {matchedCount / 2} / {cardCount / 2}
            </div>
          </div>
          {previewActive && (
            <div
              className="clay-card px-3 py-2 md:px-4 md:py-3"
              style={{
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid rgba(232, 185, 74, 0.3)',
              }}
            >
              <div className="text-[10px] mb-0.5" style={{ color: '#e8b94a' }}>
                التذكُّر
              </div>
              <div className="font-bold text-sm md:text-base flex items-center gap-1" style={{ color: '#ffffff' }}>
                <Clock className="w-3 h-3" />
                {previewCountdown}ث
              </div>
            </div>
          )}
        </div>

        {/* Finished state */}
        {isFinished && (
          <div
            className="mb-6 p-6 text-center animate-pop-in"
            style={{
              borderRadius: '24px',
              border: '1px solid var(--clay-ochre)',
              background: 'var(--clay-surface-soft)',
            }}
          >
            <div
              className="flex items-center justify-center gap-2 mb-2 font-bold text-lg"
              style={{ color: 'var(--clay-ochre)' }}
            >
              <Sparkles className="w-5 h-5" />
              لقد أكملتم جميع الأزواج!
            </div>
            <p className="clay-body-sm mb-4" style={{ color: 'var(--clay-muted)' }}>
              انتهت اللعبة. يمكنك العودة إلى المركز أو إنهاء الجلسة.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  dispatch({ type: 'RETURN_TO_HUB' })
                  navigate(routes.gameHub)
                }}
                className="clay-btn-secondary"
              >
                العودة إلى المركز
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'END_GAME' })
                  navigate(routes.gameOver)
                }}
                className="clay-btn-primary"
              >
                إنهاء الجلسة
              </button>
            </div>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              dispatch({ type: 'RETURN_TO_HUB' })
              navigate(routes.gameHub)
            }}
            className="clay-btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            رجوع
          </button>
          <div className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
            اضغط البطاقات بالترتيب الذي يسمعه المعلم من الفريق.
          </div>
        </div>
      </div>
    </div>
  )
}
