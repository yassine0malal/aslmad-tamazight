import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Settings,
  LetterText,
  Rabbit,
  Image,
  Trophy,
} from 'lucide-react'
import { routes } from '@/lib/routes'

export default function GameHubView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const teamGames = [
    {
      id: 'game1' as const,
      title: 'تحدي الحرف التالي',
      description: 'اختر الحرف الذي يكمل التسلسل',
      icon: <LetterText className="w-5 h-5" />,
      accent: 'var(--clay-lavender)',
      completed: state.game1Completed,
      count: state.game1Deck.length,
      emoji: '🔤',
      visual: (
        <div className="flex items-center gap-3">
          <span className="tifinagh-text text-5xl" style={{ color: 'var(--clay-ink)' }}>
            &#x2D30;
          </span>
          <ArrowRight className="w-6 h-6" style={{ color: 'var(--clay-coral)' }} />
          <span className="tifinagh-text text-5xl" style={{ color: 'var(--clay-ink)' }}>
            &#x2D31;
          </span>
          <ArrowRight className="w-6 h-6" style={{ color: 'var(--clay-coral)' }} />
          <span className="tifinagh-text text-4xl" style={{ color: 'var(--clay-muted-soft)' }}>
            ?
          </span>
        </div>
      ),
    },
    {
      id: 'game2' as const,
      title: 'مباراة الحيوانات',
      description: 'اختر الحرف الصحيح لاسم الحيوان',
      icon: <Rabbit className="w-5 h-5" />,
      accent: 'var(--clay-peach)',
      completed: state.game2Completed,
      count: state.game2Deck.length,
      emoji: '🐾',
      visual: <Rabbit className="w-20 h-20" style={{ color: 'var(--clay-ink)' }} />,
    },
    {
      id: 'game3' as const,
      title: 'لعبة الذاكرة',
      description: 'ابحث عن الأزواج المطابقة داخل الشبكة',
      icon: null,
      accent: 'var(--clay-ochre)',
      completed: false,
      count: state.memoryDeck.length || 12,
      emoji: '🧠',
      visual: (
        <div className="text-center">
          <span className="text-5xl block mb-2">🃏</span>
        </div>
      ),
    },
    {
      id: 'game4' as const,
      title: 'أمساسا ن توالفت',
      description: 'لعبة التخمين بالصورة والاختيار من متعدد',
      icon: <Sparkles className="w-5 h-5" />,
      accent: 'var(--clay-coral)',
      completed: state.game4Completed,
      count: state.game4Deck.length,
      emoji: '✨',
      visual: <Image className="w-20 h-20" style={{ color: 'var(--clay-coral)' }} />,
    },
  ]

  const handleGameClick = (gameId: string) => {
    dispatch({ type: 'SELECT_GAME', payload: { game: gameId as 'game1' | 'game2' | 'game3' | 'game4' } })
    const routeMap: Record<string, string> = {
      game1: routes.nextLetter,
      game2: routes.animalMatch,
      game3: routes.memory,
      game4: routes.riddle,
    }
    navigate(routeMap[gameId] ?? routes.gameHub)
  }

  return (
    <div className="min-h-screen w-full pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-8 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 mb-4"
            style={{ background: 'var(--clay-surface-card)' }}
          >
            <Trophy className="w-4 h-4" style={{ color: 'var(--clay-ochre)' }} />
            <span className="clay-caption font-semibold" style={{ color: 'var(--clay-ochre)' }}>
              ألعاب تنافسية بين الفرق
            </span>
          </div>
          <h1 className="clay-display-sm mb-2" style={{ color: 'var(--clay-ink)' }}>
            👥 ألعاب الفرق
          </h1>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            كل فريق يتناوب على الإجابة — من يجمع أكبر عدد من النقاط يفوز!
          </p>
        </div>

        {/* Team Games Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {teamGames.map((game, idx) => (
            <div
              key={game.id}
              className="clay-card overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-clay-hover hover:-translate-y-1 group"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.95)',
                transitionDelay: `${150 + idx * 80}ms`,
              }}
              onClick={() => handleGameClick(game.id)}
            >
              {/* Card visual header */}
              <div
                className="h-40 flex items-center justify-center relative overflow-hidden"
                style={{ background: `${game.accent}10` }}
              >
                <span
                  className="absolute top-2 right-2 text-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                >
                  {game.emoji}
                </span>
                <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {game.visual}
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute top-4 left-6 text-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300">⭐</span>
                  <span className="absolute bottom-3 right-8 text-sm opacity-10 group-hover:opacity-30 transition-opacity duration-300">✨</span>
                  <span className="absolute top-8 left-1/3 text-xs opacity-15 group-hover:opacity-35 transition-opacity duration-300">🌟</span>
                </div>

                {game.completed && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    style={{ background: 'rgba(34,197,94,0.08)' }}
                  >
                    <div
                      className="w-16 h-16 flex items-center justify-center animate-pop-in"
                      style={{
                        borderRadius: '9999px',
                        background: 'var(--clay-surface-soft)',
                      }}
                    >
                      <CheckCircle
                        className="w-10 h-10"
                        style={{ color: 'var(--clay-success)' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-5">
                <h3
                  className="clay-title-sm mb-1 flex items-center gap-2"
                  style={{ color: 'var(--clay-ink)' }}
                >
                  {game.icon && <span style={{ color: game.accent }}>{game.icon}</span>}
                  {game.title}
                </h3>
                <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-muted)' }}>
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="clay-caption px-3 py-1"
                    style={{
                      background: game.completed
                        ? 'var(--clay-surface-soft)'
                        : `${game.accent}10`,
                      color: game.completed ? 'var(--clay-success)' : game.accent,
                    }}
                  >
                    {game.completed ? '✅ مكتمل' : `🎯 ${game.count} سؤال`}
                  </span>
                  <ArrowRight
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    style={{
                      color: game.completed
                        ? 'var(--clay-muted-soft)'
                        : game.accent,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-600 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <button
            onClick={() => {
              dispatch({ type: 'RETURN_TO_SETUP' })
              navigate(routes.setup)
            }}
            className="clay-btn-secondary inline-flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            تعديل الإعدادات
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'END_GAME' })
              navigate(routes.gameOver)
            }}
            className="clay-btn-primary inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            انهاء الجلسة
          </button>
        </div>
      </div>
    </div>
  )
}
