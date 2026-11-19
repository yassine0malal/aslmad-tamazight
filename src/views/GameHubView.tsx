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
import iconPronunciation from '@/assets/icons/pronunciation.svg'

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
  'pronunciation': iconPronunciation,
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
      tint: '#efe8ff',
      completed: state.game1Completed,
      count: state.game1Deck.length,
      route: routes.nextLetter,
    },
    {
      id: 'game2',
      title: 'مباراة الكلمات',
      description: 'ابنِ الكلمة الأمازيغية الصحيحة من الحروف',
      icon: 'animal',
      accent: 'var(--clay-peach)',
      accentLight: 'rgba(220, 140, 110, 0.08)',
      tint: '#ffe9df',
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
      tint: '#fff2c9',
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
      tint: '#ffe3df',
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
      tint: '#fff2c9',
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
      tint: '#efe8ff',
      route: routes.culture,
    },
    {
      title: 'النطق والاستماع',
      description: 'استمع إلى الكلمات وردّدها بصوت واضح',
      icon: 'pronunciation',
      accent: 'var(--clay-peach)',
      accentLight: 'rgba(220, 140, 110, 0.08)',
      tint: '#ffe9df',
      route: routes.pronunciation,
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
        <FadeIn delay={0} className="text-center pt-6 pb-2 relative">
          <span
            className="hidden sm:block absolute left-[4%] top-2 tifinagh-text text-5xl animate-kid-bob select-none"
            style={{ color: 'var(--clay-lavender)', opacity: 0.55 }}
            aria-hidden
          >
            ⴰ
          </span>
          <span
            className="hidden sm:block absolute right-[6%] top-8 tifinagh-text text-4xl animate-kid-bob select-none"
            style={{ color: 'var(--clay-peach)', opacity: 0.7, animationDelay: '0.8s' }}
            aria-hidden
          >
            ⵣ
          </span>
          <span
            className="hidden md:block absolute right-[18%] top-0 tifinagh-text text-3xl animate-kid-bob select-none"
            style={{ color: 'var(--clay-mint)', opacity: 0.8, animationDelay: '1.4s' }}
            aria-hidden
          >
            ⵜ
          </span>

          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6"
            style={{
              background: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: '999px',
              boxShadow: '0 8px 20px rgba(61, 44, 20, 0.08)',
            }}
          >
            <span className="clay-caption font-bold" style={{ color: 'var(--clay-lavender)' }}>
              مركز الألعاب
            </span>
            <img src={iconAll} alt="" className="w-5 h-5 object-contain" />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
            style={{ color: 'var(--clay-ink)' }}
          >
            🎮 اختر{' '}
            <span className="relative inline-block">
              <span className="relative z-10">لعبتك</span>
              <span
                className="absolute left-0 right-0 bottom-1 h-4 -z-0 rounded-full"
                style={{ background: 'var(--clay-ochre)', opacity: 0.4 }}
                aria-hidden
              />
            </span>
          </h1>
          <p className="clay-body-md max-w-xl mx-auto" style={{ color: 'var(--clay-muted)' }}>
            هيا نلعب ونتعلّم معًا! كل فريق يتناوب على الإجابة — ومن يجمع أكبر عدد من النقاط يفوز
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
                className="group relative overflow-hidden cursor-pointer kid-card-hover"
                style={{
                  background: `linear-gradient(155deg, ${game.tint} 0%, #fffdf8 78%)`,
                  border: '3px solid #ffffff',
                  borderRadius: '28px',
                  boxShadow: visible ? '0 10px 24px rgba(61, 44, 20, 0.08)' : 'none',
                }}
                onClick={() => handleGameClick(game.id)}
              >
                {/* Scalloped ribbon + sparkle accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-3 pointer-events-none"
                  aria-hidden
                  style={{
                    backgroundImage: `radial-gradient(circle at 10px -2px, ${game.accent} 9px, transparent 9.5px)`,
                    backgroundSize: '20px 12px',
                    backgroundRepeat: 'repeat-x',
                    opacity: 0.55,
                  }}
                />
                <span
                  className="absolute top-4 left-5 text-lg animate-kid-twinkle pointer-events-none select-none"
                  style={{ color: game.accent, opacity: 0.55 }}
                  aria-hidden
                >
                  ✦
                </span>

                <div className="relative z-10 p-6 pt-7 flex items-center gap-5">
                  {/* Icon */}
                  <div
                    className="w-20 h-20 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: '#ffffff',
                      borderRadius: '24px',
                      boxShadow: '0 8px 18px rgba(61, 44, 20, 0.1)',
                    }}
                  >
                    <img
                      src={iconMap[game.icon]}
                      alt={game.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2"
                      style={{ color: 'var(--clay-ink)' }}
                    >
                      {game.title}
                      {game.completed && (
                        <span className="text-sm" style={{ color: 'var(--clay-success)' }}>
                          ✅
                        </span>
                      )}
                    </h3>
                    <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-body)' }}>
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="clay-caption font-bold px-3 py-1.5"
                        style={{
                          background: '#ffffff',
                          color: game.completed ? 'var(--clay-success)' : game.accent,
                          borderRadius: '999px',
                          boxShadow: '0 4px 10px rgba(61, 44, 20, 0.06)',
                        }}
                      >
                        {game.completed ? '✅ مكتمل' : `🎯 ${game.count} سؤال`}
                      </span>
                      <div
                        className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                        style={{
                          background: '#ffffff',
                          color: game.accent,
                          borderRadius: '999px',
                          boxShadow: '0 4px 10px rgba(61, 44, 20, 0.08)',
                        }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════
            KIDS GAMES + CULTURE + PRONUNCIATION — compact row
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
                className="group relative overflow-hidden cursor-pointer kid-card-hover"
                style={{
                  background: `linear-gradient(155deg, ${game.tint} 0%, #fffdf8 80%)`,
                  border: '3px solid #ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 8px 20px rgba(61, 44, 20, 0.07)',
                }}
                onClick={() => directNavigate(game.route)}
              >
                <div className="relative z-10 p-5 flex items-center gap-4">
                  <div
                    className="w-16 h-16 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      boxShadow: '0 6px 14px rgba(61, 44, 20, 0.08)',
                    }}
                  >
                    <img
                      src={iconMap[game.icon]}
                      alt={game.title}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--clay-ink)' }}>
                      {game.title}
                    </h3>
                    <p className="clay-caption mb-0" style={{ color: 'var(--clay-body)' }}>
                      {game.description}
                    </p>
                  </div>

                  <div
                    className="w-9 h-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ background: '#ffffff', color: game.accent, borderRadius: '999px' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Culture + Pronunciation */}
          {exploreLinks.map((link, idx) => (
            <FadeIn key={link.route} delay={660 + idx * 60}>
              <div
                className="group relative overflow-hidden cursor-pointer kid-card-hover"
                style={{
                  background: `linear-gradient(155deg, ${link.tint} 0%, #fffdf8 80%)`,
                  border: '3px solid #ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 8px 20px rgba(61, 44, 20, 0.07)',
                }}
                onClick={() => directNavigate(link.route)}
              >
                <div className="relative z-10 p-5 flex items-center gap-4">
                  <div
                    className="w-16 h-16 shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      boxShadow: '0 6px 14px rgba(61, 44, 20, 0.08)',
                    }}
                  >
                    <img
                      src={iconMap[link.icon]}
                      alt={link.title}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--clay-ink)' }}>
                      {link.title}
                    </h3>
                    <p className="clay-caption mb-0" style={{ color: 'var(--clay-body)' }}>
                      {link.description}
                    </p>
                  </div>

                  <div
                    className="w-9 h-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ background: '#ffffff', color: link.accent, borderRadius: '999px' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
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
