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
  Palette,
  ShoppingBag,
  Users,
  SmilePlus,
  Store,
  Star,
  PartyPopper,
  Trophy,
} from 'lucide-react'
import { routes } from '@/lib/routes'

type TabId = 'team' | 'kids' | 'souk'

export default function GameHubView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('team')
  const [tabChanging, setTabChanging] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab) return
    setTabChanging(true)
    setTimeout(() => {
      setActiveTab(tab)
      setTimeout(() => setTabChanging(false), 50)
    }, 200)
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode; emoji: string; accent: string; description: string }[] = [
    {
      id: 'team',
      label: 'الألعاب الجماعية',
      icon: <Users className="w-5 h-5" />,
      emoji: '👥',
      accent: 'var(--clay-lavender)',
      description: 'تحديات الفرق الجماعية',
    },
    {
      id: 'kids',
      label: 'ألعاب التلاميذ',
      icon: <SmilePlus className="w-5 h-5" />,
      emoji: '🧒',
      accent: 'var(--clay-peach)',
      description: 'ألعاب مفتوحة لجميع التلاميذ',
    },
    {
      id: 'souk',
      label: 'السوق',
      icon: <Store className="w-5 h-5" />,
      emoji: '🏪',
      accent: 'var(--clay-ochre)',
      description: 'أنفق نقاطك واشتري الإكسسوارات',
    },
  ]

  const teamGames = [
    {
      id: 'game1' as const,
      title: 'تحدي الحرف التالي',
      description: 'اختر الحرف الذي يكمل التسلسل',
      icon: <LetterText className="w-5 h-5" />,
      accent: 'var(--clay-lavender)',
      completed: state.game1Completed,
      count: state.game1Deck.length,
      cardClass: 'clay-feature-card clay-feature-card-lavender',
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
      cardClass: 'clay-feature-card clay-feature-card-peach',
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
      cardClass: 'clay-feature-card clay-feature-card-ochre',
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
      cardClass: 'clay-feature-card clay-feature-card-cream',
      emoji: '✨',
      visual: <Image className="w-20 h-20" style={{ color: 'var(--clay-coral)' }} />,
    },
  ]

  const kidsGames = [
    {
      id: 'colors',
      title: 'ⴰⵎⵓⵔⴰⵔ ⵏ ⵉⴽⵯⵍⴰⵏ',
      description: 'تعلم أسماء الألوان باللغة الأمازيغية',
      accent: 'var(--clay-lavender)',
      emoji: '🎨',
      count: 10,
      visual: (
        <div className="flex items-center gap-2">
          <Palette className="w-10 h-10" style={{ color: 'var(--clay-lavender)' }} />
          <div className="flex -space-x-2">
            <span className="text-3xl">🔴</span>
            <span className="text-3xl">🔵</span>
            <span className="text-3xl">🟢</span>
            <span className="text-3xl">🟡</span>
          </div>
        </div>
      ),
      route: routes.colors,
    },
  ]

  const handleGameClick = (gameId: string) => {
    if (gameId === 'colors') {
      navigate(routes.colors)
      return
    }
    dispatch({ type: 'SELECT_GAME', payload: { game: gameId as 'game1' | 'game2' | 'game3' | 'game4' } })
    const routeMap: Record<string, string> = {
      game1: routes.nextLetter,
      game2: routes.animalMatch,
      game3: routes.memory,
      game4: routes.riddle,
    }
    navigate(routeMap[gameId] ?? routes.gameHub)
  }

  const handleSoukClick = () => {
    dispatch({ type: 'GO_TO_SOUK' })
    navigate(routes.souk)
  }

  return (
    <div className="min-h-screen w-full pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div
          className={`text-center mb-8 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h1 className="clay-display-sm mb-2" style={{ color: 'var(--clay-ink)' }}>
            🎮 اختر التحدي
          </h1>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            اختر فئة الألعاب ثم اختر التحدي الذي تريد
          </p>
        </div>

        {/* Tab Bar */}
        <div
          className={`flex items-center justify-center gap-2 mb-10 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '100ms' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="relative flex items-center gap-2 px-5 py-3 transition-all duration-300 group"
                style={{
                  borderRadius: '16px',
                  background: isActive
                    ? `linear-gradient(135deg, ${tab.accent}20, ${tab.accent}08)`
                    : 'transparent',
                  border: isActive
                    ? `1px solid ${tab.accent}30`
                    : '1px solid transparent',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Hover glow */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: `${tab.accent}08` }}
                  />
                )}

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{ background: tab.accent }}
                  />
                )}

                <span className="relative z-10 text-xl">{tab.emoji}</span>

                <span
                  className="relative z-10 clay-body-sm font-medium whitespace-nowrap"
                  style={{
                    color: isActive ? 'var(--clay-ink)' : 'var(--clay-muted)',
                  }}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <div
                    className="w-5 h-5 flex items-center justify-center relative z-10"
                    style={{ color: tab.accent }}
                  >
                    <div className="absolute inset-0 animate-ping rounded-full" style={{ background: `${tab.accent}20` }} />
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div
          className="transition-all duration-300"
          style={{
            opacity: tabChanging ? 0 : 1,
            transform: tabChanging ? 'translateY(12px)' : 'translateY(0)',
          }}
        >
          {/* ─── TAB 1: TEAM GAMES ─── */}
          {activeTab === 'team' && (
            <div>
              <div
                className="text-center mb-8 transition-all duration-500"
                style={{ animation: visible && !tabChanging ? 'fadeIn 0.5s ease-out' : 'none' }}
              >
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-3"
                  style={{ background: 'var(--clay-surface-soft)' }}
                >
                  <Trophy className="w-4 h-4" style={{ color: 'var(--clay-ochre)' }} />
                  <span className="clay-caption" style={{ color: 'var(--clay-ochre)' }}>
                    ألعاب تنافسية بين الفرق
                  </span>
                </div>
                <h2 className="clay-title-lg" style={{ color: 'var(--clay-ink)' }}>
                  👥 ألعاب الفرق
                </h2>
                <p className="clay-body-md mt-1" style={{ color: 'var(--clay-muted)' }}>
                  كل فريق يتناوب على الإجابة — من يجمع أكبر عدد من النقاط يفوز!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {teamGames.map((game, idx) => (
                  <div
                    key={game.id}
                    className="clay-card overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-clay-hover hover:-translate-y-1 group"
                    style={{
                      opacity: visible && !tabChanging ? 1 : 0,
                      transform: visible && !tabChanging ? 'scale(1)' : 'scale(0.95)',
                      transitionDelay: `${150 + idx * 80}ms`,
                    }}
                    onClick={() => handleGameClick(game.id)}
                  >
                    {/* Card visual header */}
                    <div
                      className="h-40 flex items-center justify-center relative overflow-hidden"
                      style={{ background: `${game.accent}10` }}
                    >
                      {/* Decorative corner emoji */}
                      <span
                        className="absolute top-2 right-2 text-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                      >
                        {game.emoji}
                      </span>
                      <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                        {game.visual}
                      </div>

                      {/* Floating particles decoration */}
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
            </div>
          )}

          {/* ─── TAB 2: KIDS GAMES ─── */}
          {activeTab === 'kids' && (
            <div>
              <div
                className="text-center mb-8"
                style={{ animation: visible && !tabChanging ? 'fadeIn 0.5s ease-out' : 'none' }}
              >
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-3"
                  style={{ background: 'var(--clay-surface-soft)' }}
                >
                  <Star className="w-4 h-4" style={{ color: 'var(--clay-peach)' }} />
                  <span className="clay-caption" style={{ color: 'var(--clay-peach)' }}>
                    ألعاب مفتوحة لجميع التلاميذ
                  </span>
                </div>
                <h2 className="clay-title-lg" style={{ color: 'var(--clay-ink)' }}>
                  🧒 ألعاب التلاميذ
                </h2>
                <p className="clay-body-md mt-1" style={{ color: 'var(--clay-muted)' }}>
                  ألعاب تفاعلية يشارك فيها الجميع — بدون فرق، الكل يلعب معاً!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {kidsGames.map((game, idx) => (
                  <div
                    key={game.id}
                    className="clay-card overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-clay-hover hover:-translate-y-1 group"
                    style={{
                      opacity: visible && !tabChanging ? 1 : 0,
                      transform: visible && !tabChanging ? 'scale(1)' : 'scale(0.95)',
                      transitionDelay: `${150 + idx * 100}ms`,
                    }}
                    onClick={() => handleGameClick(game.id)}
                  >
                    {/* Card visual header */}
                    <div
                      className="h-40 flex items-center justify-center relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #667eea15, #764ba215)' }}
                    >
                      <span className="absolute top-2 right-2 text-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        🎨
                      </span>
                      <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                        {game.visual}
                      </div>
                      <div className="absolute inset-0 pointer-events-none">
                        <span className="absolute bottom-4 left-6 text-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300">🌈</span>
                        <span className="absolute top-6 right-10 text-sm opacity-10 group-hover:opacity-30 transition-opacity duration-300">⭐</span>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-5">
                      <h3
                        className="clay-title-sm mb-1 flex items-center gap-2"
                        style={{ color: 'var(--clay-ink)' }}
                      >
                        <Palette className="w-5 h-5" style={{ color: 'var(--clay-lavender)' }} />
                        {game.title}
                      </h3>
                      <p className="clay-body-sm mb-3" style={{ color: 'var(--clay-muted)' }}>
                        {game.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="clay-caption px-3 py-1 rounded-full"
                          style={{
                            background: '#667eea15',
                            color: 'var(--clay-lavender)',
                          }}
                        >
                          🎨 {game.count} لون
                        </span>
                        <ArrowRight
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          style={{ color: 'var(--clay-lavender)' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Future games placeholder */}
                <div
                  className="clay-card overflow-hidden flex items-center justify-center h-full min-h-[200px] transition-all duration-500 hover:shadow-clay-hover group"
                  style={{
                    border: '1px dashed var(--clay-hairline)',
                    opacity: visible && !tabChanging ? 0.6 : 0,
                    transform: visible && !tabChanging ? 'scale(1)' : 'scale(0.95)',
                    transitionDelay: '350ms',
                  }}
                >
                  <div className="text-center p-8">
                    <PartyPopper className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--clay-muted-soft)' }} />
                    <p className="clay-body-sm" style={{ color: 'var(--clay-muted-soft)' }}>
                      المزيد من الألعاب قريباً 🚀
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: SOUK ─── */}
          {activeTab === 'souk' && (
            <div>
              <div
                className="text-center mb-8"
                style={{ animation: visible && !tabChanging ? 'fadeIn 0.5s ease-out' : 'none' }}
              >
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-3"
                  style={{ background: 'var(--clay-surface-soft)' }}
                >
                  <Store className="w-4 h-4" style={{ color: 'var(--clay-ochre)' }} />
                  <span className="clay-caption" style={{ color: 'var(--clay-ochre)' }}>
                    التسوق بالمكافآت
                  </span>
                </div>
                <h2 className="clay-title-lg" style={{ color: 'var(--clay-ink)' }}>
                  🏪 السوق الافتراضي
                </h2>
                <p className="clay-body-md mt-1" style={{ color: 'var(--clay-muted)' }}>
                  استخدم النقاط التي جمعتها لشراء إكسسوارات رائعة!
                </p>
              </div>

              <div
                className="clay-card overflow-hidden cursor-pointer hover:shadow-clay-hover hover:-translate-y-1 transition-all duration-500 group max-w-md mx-auto mb-8"
                onClick={handleSoukClick}
              >
                <div
                  className="h-48 flex items-center justify-center relative overflow-hidden"
                  style={{ background: 'var(--clay-surface-card)' }}
                >
                  <span className="absolute top-3 right-3 text-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">💰</span>
                  <div className="relative z-10 text-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-7xl block mb-3">🏪</span>
                    <span
                      className="clay-body-lg font-bold"
                      style={{ color: 'var(--clay-ochre)' }}
                    >
                      ادخل السوق
                    </span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute bottom-6 left-8 text-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">✨</span>
                    <span className="absolute top-8 right-12 text-lg opacity-15 group-hover:opacity-30 transition-opacity duration-300">🪙</span>
                    <span className="absolute bottom-8 right-8 text-xl opacity-10 group-hover:opacity-25 transition-opacity duration-300">💎</span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <p className="clay-body-md mb-3" style={{ color: 'var(--clay-muted)' }}>
                    لديك {state.teams.reduce((sum, t) => sum + Math.floor(t.score / 5), 0)} قطعة نقدية
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className="clay-caption px-4 py-2 rounded-full inline-flex items-center gap-2"
                      style={{
                        background: 'var(--clay-surface-card)',
                        color: 'var(--clay-ochre)',
                      }}
                    >
                      🛍️ تسوق الآن
                    </span>
                    <ArrowRight
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: 'var(--clay-ochre)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions — always available */}
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
