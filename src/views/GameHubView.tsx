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
  ShoppingBag,
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

  const games = [
    {
      id: 'game1' as const,
      title: 'تحدي الحرف التالي',
      description: 'اختر الحرف الذي يكمل التسلسل',
      icon: <LetterText className="w-5 h-5" />,
      accent: 'var(--clay-lavender)',
      completed: state.game1Completed,
      count: state.game1Deck.length,
      cardClass: 'clay-feature-card clay-feature-card-lavender',
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
      cardClass: 'clay-feature-card clay-feature-card-peach',
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
      cardClass: 'clay-feature-card clay-feature-card-ochre',
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
      cardClass: 'clay-feature-card clay-feature-card-cream',
      visual: <Image className="w-20 h-20" style={{ color: 'var(--clay-coral)' }} />,
    },
  ]

  return (
    <div className="min-h-screen w-full pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div
          className={`text-center mb-12 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h1 className="clay-display-sm mb-2" style={{ color: 'var(--clay-ink)' }}>
            اختر التحدي
          </h1>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            اختر اللعبة التي تريدها للفريق التالي.
          </p>
        </div>

        {/* Game Cards — Clay feature cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {games.map((game, idx) => (
            <div
              key={game.id}
              className={`clay-card overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-clay-hover ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: `${150 + idx * 100}ms` }}
              onClick={() => {
                dispatch({ type: 'SELECT_GAME', payload: { game: game.id } })
                const routeMap: Record<string, string> = {
                  game1: routes.nextLetter,
                  game2: routes.animalMatch,
                  game3: routes.memory,
                  game4: routes.riddle,
                }
                navigate(routeMap[game.id] ?? routes.gameHub)
              }}
            >
              {/* Card visual header */}
              <div
                className="h-36 flex items-center justify-center relative overflow-hidden"
                style={{ background: `${game.accent}10` }}
              >
                <div className="relative z-10">{game.visual}</div>
                {game.completed && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    style={{ background: 'rgba(34,197,94,0.08)' }}
                  >
                    <div
                      className="w-16 h-16 flex items-center justify-center"
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
                  {game.icon ? (
                    <span style={{ color: game.accent }}>{game.icon}</span>
                  ) : (
                    <ShoppingBag className="w-5 h-5" style={{ color: 'var(--clay-ochre)' }} />
                  )}
                  {game.title}
                </h3>
                <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-muted)' }}>
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="clay-caption px-3 py-1 rounded-full"
                    style={{
                      background: game.completed
                        ? 'var(--clay-surface-soft)'
                        : `${game.accent}10`,
                      color: game.completed ? 'var(--clay-success)' : game.accent,
                    }}
                  >
                    {game.completed ? 'مكتمل' : `${game.count} سؤال`}
                  </span>
                  <ArrowRight
                    className="w-5 h-5"
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

          {/* Virtual Souk — always open */}
          <div
            className={`clay-card overflow-hidden cursor-pointer hover:shadow-clay-hover transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '550ms' }}
            onClick={() => {
              dispatch({ type: 'GO_TO_SOUK' })
              navigate(routes.souk)
            }}
          >
            <div
              className="h-36 flex items-center justify-center relative overflow-hidden"
              style={{ background: 'var(--clay-surface-card)' }}
            >
              <div className="relative z-10 text-center">
                <span className="text-5xl block mb-2">🏪</span>
                <span
                  className="clay-body-sm font-medium"
                  style={{ color: 'var(--clay-ochre)' }}
                >
                  السوق
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3
                className="clay-title-sm mb-1"
                style={{ color: 'var(--clay-ink)' }}
              >
                السوق الافتراضي
              </h3>
              <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-muted)' }}>
                انفق النقاط التي ربحتها!
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="clay-caption px-3 py-1 rounded-full"
                  style={{
                    background: 'var(--clay-surface-card)',
                    color: 'var(--clay-ochre)',
                  }}
                >
                  مفتوح
                </span>
                <ArrowRight className="w-5 h-5" style={{ color: 'var(--clay-ochre)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions — always available */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-600 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '600ms' }}
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
