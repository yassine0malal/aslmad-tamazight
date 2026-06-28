import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  shopItems,
  shopItemCosts,
} from '@/data/gameData'
import {
  Crown,
  Shirt,
  Drum,
  Coffee,
  Lamp,
  Check,
  Coins,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { routes } from '@/lib/routes'
import { categoryColors, categoryLabels } from '@/data/constants'

const itemIcons: Record<string, React.ReactNode> = {
  'carpet-backdrop': <Sparkles className="w-10 h-10" style={{ color: 'var(--clay-coral)' }} />,
  'silver-crown': <Crown className="w-10 h-10" style={{ color: 'var(--clay-ochre)' }} />,
  'djellaba-cape': <Shirt className="w-10 h-10" style={{ color: 'var(--clay-lavender)' }} />,
  'drum-emote': <Drum className="w-10 h-10" style={{ color: 'var(--clay-body)' }} />,
  'tea-set': <Coffee className="w-10 h-10" style={{ color: 'var(--clay-mint)' }} />,
  'souk-lantern': <Lamp className="w-10 h-10" style={{ color: 'var(--clay-peach)' }} />,
}

export default function SoukView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(0)
  const [justBought, setJustBought] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const team = state.teams[selectedTeam] ?? state.teams[0]

  const handleBuy = (itemId: string) => {
    const cost = shopItemCosts[itemId] || 10
    if (team.coins >= cost && !team.accessories.includes(itemId)) {
      dispatch({ type: 'BUY_ITEM', payload: { itemId, teamIndex: selectedTeam } })
      setJustBought(itemId)
      setTimeout(() => setJustBought(null), 1200)
    }
  }

  return (
    <div className="min-h-screen w-full pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div
          className={`text-center mb-8 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ borderRadius: '12px', background: 'var(--clay-surface-card)' }}
            >
              <ShoppingBag className="w-6 h-6" style={{ color: 'var(--clay-coral)' }} />
            </div>
            <h1 className="clay-display-sm" style={{ color: 'var(--clay-ink)' }}>
              السوق الافتراضي
            </h1>
          </div>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            انفق النقاط التي ربحها فريقك!
          </p>
        </div>

        {/* Team Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {state.teams.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setSelectedTeam(idx)}
              className={`clay-tab flex items-center gap-2 px-5 py-2.5 ${selectedTeam === idx ? 'clay-tab-active' : ''}`}
            >
              <img src={t.avatar} alt={t.name} className="w-6 h-6 object-contain" />
              {t.name}
            </button>
          ))}
        </div>

        {/* Selected Team Info */}
        {team && (
          <div
            className={`clay-card overflow-hidden mb-10 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="h-2" style={{ background: team.color }} />
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 flex items-center justify-center"
                  style={{ borderRadius: '16px', background: `${team.color}15` }}
                >
                  <img src={team.avatar} alt={team.name} className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--clay-ink)' }}>
                    {team.name}
                  </h3>
                  <p className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
                    {team.score} نقطة
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderRadius: '16px', background: 'var(--clay-surface-card)' }}
              >
                <Coins className="w-6 h-6" style={{ color: 'var(--clay-ochre)' }} />
                <span className="text-2xl font-extrabold" style={{ color: 'var(--clay-ochre)' }}>
                  {team.coins}
                </span>
                <span className="clay-body-sm" style={{ color: 'var(--clay-muted)' }}>
                  قطعة
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Shop Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {shopItems.map((item, idx) => {
            const isOwned = team?.accessories.includes(item.id)
            const cost = shopItemCosts[item.id] || 10
            const canAfford = (team?.coins ?? 0) >= cost
            const categoryColor = categoryColors[item.category] || 'var(--clay-lavender)'
            const isJustBought = justBought === item.id

            return (
              <div
                key={item.id}
                className={`clay-card overflow-hidden transition-all duration-500 hover:shadow-clay-hover ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${300 + idx * 60}ms` }}
              >
                {/* Category accent */}
                <div className="h-1.5" style={{ background: categoryColor }} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      style={{ borderRadius: '16px', background: `${categoryColor}10` }}
                    >
                      {itemIcons[item.id] || (
                        <ShoppingBag className="w-8 h-8" style={{ color: 'var(--clay-lavender)' }} />
                      )}
                    </div>
                    <span
                      className="clay-caption px-2.5 py-1 rounded-full"
                      style={{ background: `${categoryColor}10`, color: categoryColor }}
                    >
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>

                  <h3 className="clay-title-sm mb-0.5" style={{ color: 'var(--clay-ink)' }}>
                    {item.name}
                  </h3>
                  <p className="clay-body-sm mb-4" style={{ color: 'var(--clay-muted)' }}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4" style={{ color: 'var(--clay-ochre)' }} />
                      <span className="font-bold" style={{ color: 'var(--clay-ochre)' }}>
                        {cost}
                      </span>
                    </div>

                    {isOwned ? (
                      <div
                        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold"
                        style={{ background: 'var(--clay-surface-soft)', color: 'var(--clay-success)' }}
                      >
                        <Check className="w-4 h-4" />
                        مملوك
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(item.id)}
                        disabled={!canAfford || isJustBought}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                          isJustBought
                            ? 'clay-btn-primary'
                            : canAfford
                            ? 'clay-btn-primary'
                            : 'clay-btn-secondary opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {isJustBought ? '✓ تم الشراء' : 'شراء'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              dispatch({ type: 'RETURN_TO_HUB' })
              navigate(routes.gameHub)
            }}
            className="clay-btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى المركز
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'END_GAME' })
              navigate(routes.gameOver)
            }}
            className="clay-btn-primary inline-flex items-center gap-2"
          >
            انهاء
          </button>
        </div>
      </div>
    </div>
  )
}
