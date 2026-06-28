import { useEffect } from 'react'
import { useGame } from '@/context/GameContext'
import { useNavigate } from 'react-router'
import { ArrowLeft, Sparkles, Brain, Trophy } from 'lucide-react'
import { playSound } from '@/lib/utils'
import { routes } from '@/lib/routes'
import { MEMORY_DIFFICULTY } from '@/data/constants'
import type { MemoryDifficultyLevel } from '@/data/constants'

export default function MemoryMatchView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()

  // Redirect to hub if no active game session
  useEffect(() => {
    if (state.teams.length === 0) {
      navigate(routes.gameHub, { replace: true })
    }
  }, [state.teams.length, navigate])

  const activeTeam = state.teams[state.activeTeamIndex] || {
    id: 'team-1',
    name: 'الفريق 1',
    score: 0,
    avatar: '/team-atlas-lions.png',
    coins: 0,
    color: '#1A54F4',
    accessories: [],
  }

  useEffect(() => {
    if (state.memorySelection.length !== 2 || state.memoryCompleted) return

    const [firstId, secondId] = state.memorySelection
    const firstCard = state.memoryDeck.find((card) => card.id === firstId)
    const secondCard = state.memoryDeck.find((card) => card.id === secondId)
    if (!firstCard || !secondCard) return

    const timeout = window.setTimeout(() => {
      if (firstCard.pairId === secondCard.pairId) {
        playSound('correct')
        dispatch({ type: 'RESET_MEMORY_SELECTION' })
      } else {
        playSound('wrong')
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
    if (state.memoryCompleted) return
    if (state.memorySelection.length >= 2) return
    const card = state.memoryDeck.find((item) => item.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return
    dispatch({ type: 'SELECT_MEMORY_CARD', payload: { cardId } })
  }

  const handleDifficultySelect = (level: MemoryDifficultyLevel) => {
    playSound('click')
    dispatch({ type: 'SET_MEMORY_DIFFICULTY', payload: { cardCount: MEMORY_DIFFICULTY[level].cardCount } })
  }

  // Determine grid columns based on card count
  const getGridCols = () => {
    if (cardCount <= 10) return 'grid-cols-5'
    if (cardCount <= 16) return 'grid-cols-4'
    return 'grid-cols-5'
  }

  // Determine card size based on card count
  const getCardImageSize = () => {
    if (cardCount <= 10) return 'h-20 w-20 md:h-24 md:w-24'
    if (cardCount <= 16) return 'h-16 w-16 md:h-20 md:w-20'
    return 'h-12 w-12 md:h-16 md:w-16'
  }

  const getCardLabelSize = () => {
    if (cardCount <= 10) return 'text-xl md:text-2xl'
    if (cardCount <= 16) return 'text-lg md:text-xl'
    return 'text-sm md:text-base'
  }

  const getCardBackSize = () => {
    if (cardCount <= 10) return 'text-4xl md:text-5xl'
    if (cardCount <= 16) return 'text-3xl md:text-4xl'
    return 'text-xl md:text-3xl'
  }

  const getCardAspectRatio = () => {
    if (cardCount <= 10) return 'aspect-[4/5]'
    if (cardCount <= 16) return 'aspect-[3/4]'
    return 'aspect-[2/3]'
  }

  // If no difficulty selected yet, show the difficulty picker
  if (!state.memoryDifficulty) {
    return (
      <div className="min-h-screen w-full pb-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
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

          <div className="grid gap-4 md:grid-cols-3">
            {(Object.entries(MEMORY_DIFFICULTY) as [MemoryDifficultyLevel, typeof MEMORY_DIFFICULTY[MemoryDifficultyLevel]][]).map(([level, config]) => (
              <button
                key={level}
                onClick={() => handleDifficultySelect(level)}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-clay-hover active:scale-[0.98]"
                style={{
                  borderRadius: '24px',
                  border: '1px solid var(--clay-hairline)',
                  background: 'var(--clay-canvas)',
                }}
              >
                <div
                  className="h-2 w-full"
                  style={{
                    background:
                      level === 'BEGINNER'
                        ? 'var(--clay-mint)'
                        : level === 'MEDIUM'
                          ? 'var(--clay-ochre)'
                          : 'var(--clay-lavender)',
                  }}
                />
                <div className="p-6 text-center">
                  <span className="text-5xl block mb-4">{config.emoji}</span>
                  <h3
                    className="clay-title-md mb-2"
                    style={{ color: 'var(--clay-ink)' }}
                  >
                    {config.label}
                  </h3>
                  <p className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
                    {config.description}
                  </p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all group-hover:bg-clay-ink group-hover:text-white"
                    style={{
                      borderRadius: '9999px',
                      background: 'var(--clay-surface-soft)',
                      color: 'var(--clay-ink)',
                    }}
                  >
                    <Trophy className="w-4 h-4" />
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
    <div className="min-h-screen w-full pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
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
              background: 'var(--clay-mint)',
            }}
          />
        </div>

        {/* Game grid */}
        <div className={`grid gap-3 md:gap-4 mb-6 ${getGridCols()}`}>
          {state.memoryDeck.map((card, index) => {
            const isSelected = state.memorySelection.includes(card.id)
            const showFace = card.isFlipped || card.isMatched
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={
                  card.isMatched ||
                  (state.memorySelection.length >= 2 && !isSelected) ||
                  state.memoryCompleted
                }
                className={`relative ${getCardAspectRatio()} flex flex-col items-center justify-center transition-all duration-300 focus:outline-none active:scale-[0.97]`}
                style={{
                  borderRadius: '20px',
                  border: card.isMatched
                    ? '3px solid var(--clay-success)'
                    : isSelected
                      ? '3px solid var(--clay-lavender)'
                      : '2px solid var(--clay-hairline)',
                  background: card.isMatched
                    ? 'var(--clay-surface-soft)'
                    : isSelected
                      ? 'white'
                      : 'var(--clay-canvas)',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
                  {showFace ? (
                    <>
                      <img
                        src={card.image}
                        alt={card.label}
                        className={`${getCardImageSize()} object-contain mb-2`}
                      />
                      <div
                        className={`${getCardLabelSize()} font-bold tracking-widest leading-tight`}
                        style={{ color: 'var(--clay-ink)' }}
                      >
                        {card.label}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`${getCardBackSize()} font-bold`}
                        style={{ color: 'var(--clay-muted-soft)' }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="text-xs mt-1 leading-tight"
                        style={{ color: 'var(--clay-muted)' }}
                      >
                        اختر
                      </div>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Stats and controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex gap-3">
            <div
              className="clay-card px-4 py-3 flex-1 md:flex-none"
              style={{ borderRadius: '16px' }}
            >
              <div
                className="clay-caption mb-1"
                style={{ color: 'var(--clay-muted)', fontSize: '11px' }}
              >
                الاختيارات
              </div>
              <div className="font-bold" style={{ color: 'var(--clay-ink)' }}>
                {state.memorySelection.length} / 2
              </div>
            </div>
            <div
              className="clay-card px-4 py-3 flex-1 md:flex-none"
              style={{ borderRadius: '16px' }}
            >
              <div
                className="clay-caption mb-1"
                style={{ color: 'var(--clay-muted)', fontSize: '11px' }}
              >
                الأزواج
              </div>
              <div className="font-bold" style={{ color: 'var(--clay-mint)' }}>
                {matchedCount / 2} / {cardCount / 2}
              </div>
            </div>
          </div>
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
