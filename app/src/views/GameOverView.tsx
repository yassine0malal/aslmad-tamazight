import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { RotateCcw, Home, Crown, Star, Trophy } from 'lucide-react'
import { routes } from '@/lib/routes'
import { CONFETTI_COLORS, CONFETTI_SHAPES } from '@/data/constants'

export default function GameOverView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; delay: number; color: string; size: number; shape: string }>
  >([])

  const maxScore = Math.max(...state.teams.map((team) => team.score))
  const winners = state.teams.filter((team) => team.score === maxScore)
  const isDraw = winners.length > 1
  const winnerTeam = winners[0]

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)

    const shapes = [...CONFETTI_SHAPES]
    const pieces = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 12,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }))
    setConfetti(pieces)

    return () => clearTimeout(timer)
  }, [])

  const getShapeStyle = (
    shape: string,
    color: string,
    size: number,
  ): React.CSSProperties => {
    const base: React.CSSProperties = { width: size, height: size, backgroundColor: color }
    if (shape === 'circle') return { ...base, borderRadius: '50%' }
    if (shape === 'triangle') {
      return {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
      }
    }
    return { ...base, borderRadius: '2px' }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--clay-canvas)' }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute"
            style={{
              left: `${piece.x}%`,
              top: '-30px',
              ...getShapeStyle(piece.shape, piece.color, piece.size),
              animation: `confetti-fall ${3 + Math.random() * 3}s linear infinite`,
              animationDelay: `${piece.delay}s`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Trophy Icon */}
        <div
          className={`mb-6 transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div
            className="w-32 h-32 mx-auto flex items-center justify-center"
            style={{
              borderRadius: '9999px',
              background: 'var(--clay-surface-soft)',
              border: '1px solid var(--clay-hairline)',
            }}
          >
            {isDraw ? (
              <Star className="w-18 h-18" style={{ width: 72, height: 72, color: 'var(--clay-ochre)' }} />
            ) : (
              <Crown className="w-18 h-18" style={{ width: 72, height: 72, color: 'var(--clay-ochre)' }} />
            )}
          </div>
        </div>

        {/* Winner Text */}
        <div
          className={`mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <h1 className="clay-display-sm mb-3" style={{ color: 'var(--clay-ink)' }}>
            {isDraw ? 'الجميع فاز!' : `مبروك ${winnerTeam?.name}!`}
          </h1>
          <p className="clay-body-lg" style={{ color: 'var(--clay-body)' }}>
            {isDraw ? 'تهانينا لجميع الفرق!' : 'تهانينا للفريق الفائز!'}
          </p>
        </div>

        {/* Final Scores */}
        <div
          className="clay-card p-8 mb-8 transition-all duration-700"
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-5 h-5" style={{ color: 'var(--clay-ochre)' }} />
            <span
              className="clay-caption uppercase tracking-wider"
              style={{ color: 'var(--clay-muted)', letterSpacing: '1.5px' }}
            >
              النتائج النهائية
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {state.teams.map((team, idx) => {
              const isWinner = winners.some((w) => w.id === team.id) && !isDraw
              return (
                <div
                  key={team.id}
                  className={`text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${700 + idx * 100}ms` }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-2 flex items-center justify-center"
                    style={{
                      borderRadius: '9999px',
                      background: isWinner
                        ? 'var(--clay-surface-card)'
                        : 'var(--clay-surface-soft)',
                      border: isWinner
                        ? '2px solid var(--clay-ochre)'
                        : '1px solid var(--clay-hairline)',
                    }}
                  >
                    <img src={team.avatar} alt={team.name} className="w-12 h-12 object-contain" />
                  </div>
                  <p className="text-sm mb-1 font-medium" style={{ color: 'var(--clay-body)' }}>
                    {team.name}
                  </p>
                  <p className="text-4xl font-extrabold" style={{ color: 'var(--clay-ink)' }}>
                    {team.score}
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--clay-ochre)' }}>
                    {Math.floor(team.score / 5)} قطعة ذهبية
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex items-center justify-center gap-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '900ms' }}
        >
          <button
            onClick={() => {
              dispatch({ type: 'RESET_GAME' })
              navigate(routes.landing)
            }}
            className="clay-btn-primary inline-flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة اللعب
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'RESET_GAME' })
              navigate(routes.landing)
            }}
            className="clay-btn-secondary inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  )
}
