import { useGame } from '@/context/GameContext'
import { Check, X, SkipForward, ArrowLeft, ArrowRight, Lightbulb, Home, RotateCcw } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { routes } from '@/lib/routes'

export default function TeacherPanel() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const location = useLocation()

  const isGame1 = location.pathname === routes.nextLetter
  const isGame2 = location.pathname === routes.animalMatch

  const activeTeam = state.teams[state.activeTeamIndex]
  const currentPuzzle = isGame1
    ? state.game1Deck[state.currentPuzzleIndex]
    : isGame2
      ? state.game2Deck[state.currentPuzzleIndex]
      : null
  const groupLabel = `مجموعة ${state.currentGroupIndex + 1} من ${state.groupCount}`
  const halfLabel = state.matchHalf === 1 ? 'الشوط الأول' : 'الشوط الثاني'

  // Hooks must be called in the same order on every render — define ALL hooks before any early return
  const handleCorrect = useCallback(() => {
    if (state.selectedAnswer) {
      dispatch({ type: 'ANSWER_CORRECT' })
      setTimeout(() => {
        dispatch({ type: 'NEXT_PUZZLE' })
        dispatch({ type: 'SWITCH_TEAM' })
      }, 2000)
    }
  }, [state.selectedAnswer, dispatch])

  const handleIncorrect = useCallback(() => {
    dispatch({ type: 'ANSWER_INCORRECT' })
    setTimeout(() => {
      dispatch({ type: 'SWITCH_TEAM' })
      dispatch({ type: 'NEXT_PUZZLE' })
    }, 2000)
  }, [dispatch])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.teacherPanelOpen) return

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          dispatch({ type: 'SWITCH_TEAM' })
          break
        case '1':
        case '2':
        case '3':
        case '4':
          {
            const index = Number(e.key) - 1
            if (currentPuzzle?.options[index]) {
              dispatch({
                type: 'ANSWER_SELECTED',
                payload: { answer: currentPuzzle.options[index] },
              })
            }
          }
          break
        case 'Enter':
          if (state.selectedAnswer) handleCorrect()
          break
        case 'h':
        case 'H':
          dispatch({ type: 'SHOW_HINT' })
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.teacherPanelOpen, state.selectedAnswer, currentPuzzle, dispatch, handleCorrect])

  // Guard: don't render panel content until teams exist (prevents crashes on setup page)
  if (!activeTeam) return null

  return (
    <div
      className="fixed right-0 top-0 h-full w-[380px] z-[100] overflow-y-auto transition-transform duration-300 ease-out"
      style={{
        borderRadius: '24px 0 0 24px',
        background: 'var(--clay-canvas)',
        borderLeft: '1px solid var(--clay-hairline)',
        transform: state.teacherPanelOpen ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      <div
        className="p-6 text-center"
        style={{ background: `${activeTeam.color}15` }}
      >
        <div className="w-20 h-20 mx-auto mb-3">
          <img
            src={activeTeam.avatar}
            alt={activeTeam.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--clay-ink)' }}>
          {activeTeam.name}
        </h3>
        <p className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
          {halfLabel} · {groupLabel}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => {
              dispatch({ type: 'SWITCH_TEAM' })
            }}
            className="w-10 h-10 flex items-center justify-center"
            style={{
              borderRadius: '9999px',
              background: 'var(--clay-surface-soft)',
              color: 'var(--clay-ink)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
            تبديل الفريق
          </span>
          <button
            onClick={() => {
              dispatch({ type: 'SWITCH_TEAM' })
            }}
            className="w-10 h-10 flex items-center justify-center"
            style={{
              borderRadius: '9999px',
              background: 'var(--clay-surface-soft)',
              color: 'var(--clay-ink)',
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {(isGame1 || isGame2) && currentPuzzle && (
        <div className="p-6">
          <h4
            className="clay-caption-uppercase mb-4"
            style={{ color: 'var(--clay-muted)', letterSpacing: '1.5px' }}
          >
            {isGame1 ? 'الحروف المتاحة' : 'اختر الحرف'}
          </h4>

          <div className={`grid gap-3 ${isGame1 ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {currentPuzzle.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  dispatch({
                    type: 'ANSWER_SELECTED',
                    payload: { answer: option },
                  })
                }}
                className="p-4 flex flex-col items-center justify-center transition-all duration-200"
                style={{
                  borderRadius: '16px',
                  border:
                    state.selectedAnswer === option
                      ? '2px solid var(--clay-lavender)'
                      : '1px solid var(--clay-hairline)',
                  background:
                    state.selectedAnswer === option
                      ? 'var(--clay-surface-soft)'
                      : 'white',
                  minHeight: isGame1 ? 100 : 80,
                }}
              >
                <span
                  className="tifinagh-text text-4xl font-bold"
                  style={{ color: 'var(--clay-ink)' }}
                >
                  {option}
                </span>
                {isGame1 && (
                  <span
                    className="text-xs mt-1"
                    style={{ color: 'var(--clay-muted-soft)' }}
                  >
                    خيار {idx + 1}
                  </span>
                )}
              </button>
            ))}
          </div>

          {'hint' in currentPuzzle && (
            <button
              onClick={() => {
                dispatch({ type: 'SHOW_HINT' })
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm hover:underline"
              style={{ color: 'var(--clay-ochre)' }}
            >
              <Lightbulb className="w-4 h-4" />
              {state.showHint
                ? (currentPuzzle as { hint: string }).hint
                : 'عرض التلميح (H)'}
            </button>
          )}
        </div>
      )}

      {(isGame1 || isGame2) && (
        <div className="px-6 pb-4 space-y-3">
          <button
            onClick={handleCorrect}
            disabled={!state.selectedAnswer}
            className="w-full h-14 flex items-center justify-center gap-2 text-lg font-bold text-white transition-all"
            style={{
              borderRadius: '16px',
              background: state.selectedAnswer
                ? 'var(--clay-success)'
                : 'var(--clay-surface-strong)',
              cursor: state.selectedAnswer ? 'pointer' : 'not-allowed',
            }}
          >
            <Check className="w-6 h-6" />
            صحيح
          </button>

          <button
            onClick={handleIncorrect}
            className="w-full h-12 flex items-center justify-center gap-2 font-semibold text-white transition-all"
            style={{ borderRadius: '16px', background: 'var(--clay-error)' }}
          >
            <X className="w-5 h-5" />
            خطأ
          </button>

          <button              onClick={() => {
                dispatch({ type: 'SWITCH_TEAM' })
                dispatch({ type: 'NEXT_PUZZLE' })
              }}
            className="w-full h-10 flex items-center justify-center gap-2 text-sm font-medium"
            style={{
              borderRadius: '16px',
              background: 'var(--clay-surface-soft)',
              color: 'var(--clay-muted)',
            }}
          >
            <SkipForward className="w-4 h-4" />
            تخطي
          </button>
        </div>
      )}

      <div
        className="px-6 pb-6 pt-4"
        style={{ borderTop: '1px solid var(--clay-hairline)' }}
      >
        <div className="flex gap-2">
          <button
            onClick={() => {
              dispatch({ type: 'RETURN_TO_HUB' })
              navigate(routes.gameHub)
            }}
            className="flex-1 h-10 flex items-center justify-center gap-1 text-sm font-medium"
            style={{
              borderRadius: '12px',
              background: 'var(--clay-surface-soft)',
              color: 'var(--clay-ink)',
            }}
          >
            <Home className="w-4 h-4" />
            العودة إلى المركز
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'NEXT_PUZZLE' })
              dispatch({ type: 'ANSWER_SELECTED', payload: { answer: '' } })
            }}
            className="flex-1 h-10 flex items-center justify-center gap-1 text-sm font-medium"
            style={{
              borderRadius: '12px',
              background: 'var(--clay-surface-soft)',
              color: 'var(--clay-ink)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
            التالي
          </button>
        </div>
      </div>
    </div>
  )
}
