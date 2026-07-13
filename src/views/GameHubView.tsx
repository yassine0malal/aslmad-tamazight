import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Sparkles, Settings, Trophy, Star, Gamepad2 } from 'lucide-react'
import { routes } from '@/lib/routes'

/* ─── Custom PNG icons from design assets ─── */
import iconAll from '@/assets/icons/teams-games/all.png'
import iconNextLetter from '@/assets/icons/teams-games/next-letter.png'
import iconAnimal from '@/assets/icons/teams-games/animal.png'
import iconMind from '@/assets/icons/teams-games/mind.png'
import iconPictureQuiz from '@/assets/icons/teams-games/picture-quiz.png'
import iconKids from '@/assets/icons/class-games/kids.png'
import iconCulture from '@/assets/icons/culture/culture.png'
import iconMarket from '@/assets/icons/market/market.png'

/* ─── Shared helpers ─── */
const iconMap: Record<string, string> = {
  'all': iconAll,
  'next-letter': iconNextLetter,
  'animal': iconAnimal,
  'mind': iconMind,
  'picture-quiz': iconPictureQuiz,
  'kids': iconKids,
  'culture': iconCulture,
  'market': iconMarket,
}

export default function GameHubView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  /* ─── Navigation helpers ─── */
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

  const directNavigate = (to: string) => navigate(to)

  /* ─── Game definitions ─── */
  const teamGames = [
    {
      id: 'game1',
      title: 'تحدي الحرف التالي',
      description: 'اختر الحرف الذي يكمل التسلسل',
      icon: 'next-letter',
      accent: 'var(--clay-lavender)',
      accentLight: 'rgba(137, 115, 191, 0.08)',
      completed: state.game1Completed,
      count: state.game1Deck.length,
      route: routes.nextLetter,
    },
    {
      id: 'game2',
      title: 'مباراة الحيوانات',
      description: 'اختر الحرف الصحيح لاسم الحيوان',
      icon: 'animal',
      accent: 'var(--clay-peach)',
      accentLight: 'rgba(220, 140, 110, 0.08)',
      completed: state.game2Completed,
      count: state.game2Deck.length,
      route: routes.animalMatch,
    },
    {
      id: 'game3',
      title: 'لعبة الذاكرة',
      description: 'ابحث عن الأزواج المطابقة داخل الشبكة',
      icon: 'mind',
      accent: 'var(--clay-ochre)',
      accentLight: 'rgba(196, 149, 48, 0.08)',
      completed: false,
      count: state.memoryDeck.length || 12,
      route: routes.memory,
    },
    {
      id: 'game4',
      title: 'أمساسا ن توالفت',
      description: 'لعبة التخمين بالصورة والاختيار من متعدد',
      icon: 'picture-quiz',
      accent: 'var(--clay-coral)',
      accentLight: 'rgba(211, 91, 91, 0.08)',
      completed: state.game4Completed,
      count: state.game4Deck.length,
      route: routes.riddle,
    },
  ]

  const kidsGames = [
    {
      title: 'ألوان',
      description: 'تعلّم أسماء الألوان بطريقة تفاعلية',
      icon: 'kids',
      accent: 'var(--clay-ochre)',
      accentLight: 'rgba(196, 149, 48, 0.08)',
      route: routes.colors,
    },
  ]

  const exploreLinks = [
    {
      title: 'المعرض الثقافي',
      description: 'استكشف التراث الأمازيغي الثري',
      icon: 'culture',
      accent: 'var(--clay-lavender)',
      accentLight: 'rgba(137, 115, 191, 0.08)',
      route: routes.culture,
    },
    {
      title: 'السوق الافتراضي',
      description: 'أنفق نقاطك واشتري هدايا رائعة',
      icon: 'market',
      accent: 'var(--clay-peach)',
      accentLight: 'rgba(220, 140, 110, 0.08)',
      route: routes.souk,
    },
  ]

  /* ─── Animated entry wrapper ─── */
  const FadeIn = ({
    children,
    delay = 0,
    className = '',
    style = {},
  }: {
    children: React.ReactNode
    delay?: number
    className?: string
    style?: React.CSSProperties
  }) => (
    <div
      className={`transition-all duration-600 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )

  return (
    <div
      className="min-h-screen w-full pb-16 relative overflow-hidden"
      style={{ background: 'var(--clay-canvas)' }}
    >
      {/* ── Decorative bg blobs ── */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--clay-lavender), transparent)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--clay-ochre), transparent)' }}
      />

      <div className="max-w-5xl mx-auto relative z-10 px-4">
        {/* ═══════════════════════════════════════════════════
            HERO HEADER
           ═══════════════════════════════════════════════════ */}
        <FadeIn delay={0} className="text-center pt-8 pb-2">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 mb-5"
            style={{
              background: 'var(--clay-surface-card)',
              border: '1px solid var(--clay-hairline)',
              borderRadius: '999px',
            }}
          >
            <img src={iconAll} alt="" className="w-5 h-5 object-contain" />
            <span className="clay-caption font-semibold" style={{ color: 'var(--clay-muted-soft)' }}>
              مركز الألعاب
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
            style={{ color: 'var(--clay-ink)' }}
          >
            🎮 اختر{' '}
            <span style={{ color: 'var(--clay-ochre)' }}>لعبتك</span>
          </h1>
          <p className="clay-body-md max-w-xl mx-auto" style={{ color: 'var(--clay-muted)' }}>
            كل فريق يتناوب على الإجابة — من يجمع أكبر عدد من النقاط يفوز!
          </p>
        </FadeIn>

        {/* ═══════════════════════════════════════════════════
            TEAM GAMES — large grid cards
           ═══════════════════════════════════════════════════ */}
        <FadeIn delay={100}>
          <div className="flex items-center gap-3 mb-5 mt-10">
            <div
              className="w-9 h-9 flex items-center justify-center shrink-0"
              style={{
                background: 'var(--clay-surface-card)',
                borderRadius: '10px',
                border: '1px solid var(--clay-hairline)',
              }}
            >
              <Gamepad2 className="w-4 h-4" style={{ color: 'var(--clay-muted-soft)' }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--clay-ink)' }}>
              الألعاب الجماعية
            </h2>
            <div className="flex-1 h-px" style={{ background: 'var(--clay-hairline)' }} />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {teamGames.map((game, idx) => (
            <FadeIn key={game.id} delay={200 + idx * 80}>
              <div
                className="group relative overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1.5"
                style={{
                  background: 'var(--clay-surface-card)',
                  border: '1px solid var(--clay-hairline)',
                  borderRadius: '16px',
                  boxShadow: visible ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
                }}
                onClick={() => handleGameClick(game.id)}
              >
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${game.accentLight}, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      background: game.accentLight,
                      borderRadius: '14px',
                      border: `1px solid ${game.accent}20`,
                    }}
                  >
                    <img
                      src={iconMap[game.icon]}
                      alt={game.title}
                      className="w-9 h-9 object-contain"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-bold mb-1 flex items-center gap-2"
                      style={{ color: 'var(--clay-ink)' }}
                    >
                      {game.title}
                      {game.completed && (
                        <span className="text-xs" style={{ color: 'var(--clay-success)' }}>
                          ✅
                        </span>
                      )}
                    </h3>
                    <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-muted)' }}>
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="clay-caption px-2.5 py-1"
                        style={{
                          background: game.completed
                            ? 'var(--clay-surface-soft)'
                            : game.accentLight,
                          color: game.completed ? 'var(--clay-success)' : game.accent,
                          borderRadius: '6px',
                        }}
                      >
                        {game.completed ? '✅ مكتمل' : `🎯 ${game.count} سؤال`}
                      </span>
                      <ArrowRight
                        className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1"
                        style={{
                          color: game.completed ? 'var(--clay-muted-soft)' : game.accent,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: game.accent }}
                />
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            KIDS GAMES + CULTURE + SOUK — compact row
           ═══════════════════════════════════════════════════ */}
        <FadeIn delay={550}>
          <div className="flex items-center gap-3 mb-5 mt-2">
            <div
              className="w-9 h-9 flex items-center justify-center shrink-0"
              style={{
                background: 'var(--clay-surface-card)',
                borderRadius: '10px',
                border: '1px solid var(--clay-hairline)',
              }}
            >
              <Star className="w-4 h-4" style={{ color: 'var(--clay-muted-soft)' }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--clay-ink)' }}>
              المزيد من المغامرات
            </h2>
            <div className="flex-1 h-px" style={{ background: 'var(--clay-hairline)' }} />
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {/* Kids: Colors */}
          {kidsGames.map((game, idx) => (
            <FadeIn key={game.route} delay={600 + idx * 60}>
              <div
                className="group relative overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1.5"
                style={{
                  background: 'var(--clay-surface-card)',
                  border: '1px solid var(--clay-hairline)',
                  borderRadius: '14px',
                }}
                onClick={() => directNavigate(game.route)}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${game.accentLight}, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      background: game.accentLight,
                      borderRadius: '12px',
                      border: `1px solid ${game.accent}20`,
                    }}
                  >
                    <img
                      src={iconMap[game.icon]}
                      alt={game.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--clay-ink)' }}>
                      {game.title}
                    </h3>
                    <p className="clay-caption mb-0" style={{ color: 'var(--clay-muted)' }}>
                      {game.description}
                    </p>
                  </div>

                  <ArrowRight
                    className="w-4 h-4 shrink-0 transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: 'var(--clay-muted-soft)' }}
                  />
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Culture + Souk */}
          {exploreLinks.map((link, idx) => (
            <FadeIn key={link.route} delay={660 + idx * 60}>
              <div
                className="group relative overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1.5"
                style={{
                  background: 'var(--clay-surface-card)',
                  border: '1px solid var(--clay-hairline)',
                  borderRadius: '14px',
                }}
                onClick={() => directNavigate(link.route)}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${link.accentLight}, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      background: link.accentLight,
                      borderRadius: '12px',
                      border: `1px solid ${link.accent}20`,
                    }}
                  >
                    <img
                      src={iconMap[link.icon]}
                      alt={link.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--clay-ink)' }}>
                      {link.title}
                    </h3>
                    <p className="clay-caption mb-0" style={{ color: 'var(--clay-muted)' }}>
                      {link.description}
                    </p>
                  </div>

                  <ArrowRight
                    className="w-4 h-4 shrink-0 transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: 'var(--clay-muted-soft)' }}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            BOTTOM ACTIONS
           ═══════════════════════════════════════════════════ */}
        <FadeIn delay={800}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pb-8">
            <button
              onClick={() => {
                dispatch({ type: 'RETURN_TO_SETUP' })
                navigate(routes.setup)
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--clay-surface-card)',
                border: '1px solid var(--clay-hairline)',
                borderRadius: '10px',
                color: 'var(--clay-ink)',
              }}
            >
              <Settings className="w-4 h-4" />
              <span className="clay-body-sm font-medium">تعديل الإعدادات</span>
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'END_GAME' })
                navigate(routes.gameOver)
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--clay-ink)',
                borderRadius: '10px',
                color: '#fff',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="clay-body-sm font-medium">إنهاء الجلسة</span>
            </button>
          </div>
        </FadeIn>

        {/* ═══════════════════════════════════════════════════
            FOOTER NOTE
           ═══════════════════════════════════════════════════ */}
        <FadeIn delay={900}>
          <div className="text-center pb-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{
                background: 'var(--clay-surface-soft)',
                borderRadius: '999px',
              }}
            >
              <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--clay-ochre)' }} />
              <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
                كل فريق يتناوب على الإجابة — من يجمع أكبر عدد من النقاط يفوز!
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
