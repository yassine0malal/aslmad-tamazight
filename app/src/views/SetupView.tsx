import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Users, Play } from 'lucide-react'
import { playSound } from '@/lib/utils'
import { routes } from '@/lib/routes'
import { colorOptions, createTeamConfig } from '@/data/constants'

export default function SetupView() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const hasExistingTeams = state.teams.length > 0

  // Pre-fill from existing teams if coming from hub (تعديل الإعدادات)
  const [teamCount, setTeamCount] = useState(
    hasExistingTeams ? state.teams.length : 3,
  )
  const [teams, setTeams] = useState(() => {
    if (hasExistingTeams) {
      return state.teams.map((t) => ({
        name: t.name,
        color: t.color,
        avatar: t.avatar,
      }))
    }
    return Array.from({ length: 3 }, (_, index) => createTeamConfig(index))
  })
  const [groupCount, setGroupCount] = useState(
    hasExistingTeams ? state.groupCount : 3,
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const updateTeam = (
    index: number,
    changes: Partial<{ name: string; color: string }>,
  ) => {
    setTeams((current) =>
      current.map((team, idx) =>
        idx === index ? { ...team, ...changes } : team,
      ),
    )
  }

  const handleTeamCountChange = (value: number) => {
    const nextCount = Math.max(2, Math.min(8, value))
    setTeamCount(nextCount)
    setTeams((current) => {
      if (nextCount === current.length) return current
      if (nextCount > current.length) {
        return [
          ...current,
          ...Array.from({ length: nextCount - current.length }, (_, index) =>
            createTeamConfig(current.length + index),
          ),
        ]
      }
      return current.slice(0, nextCount)
    })
  }

  const canStart =
    teams.every((team) => team.name.trim().length > 0) && groupCount >= 1

  return (
    <div className="min-h-screen w-full pb-12 px-4"
      style={{ background: 'var(--clay-canvas)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-10 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{
                borderRadius: '12px',
                background: 'var(--clay-surface-card)',
              }}
            >
              <Users className="w-6 h-6" style={{ color: 'var(--clay-coral)' }} />
            </div>
            <h1 className="clay-display-sm" style={{ color: 'var(--clay-ink)' }}>
              إعداد اللعبة
            </h1>
          </div>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted)' }}>
            حدد عدد الفرق ثم خصص اسم ولون كل فريق قبل بدء اللعبة.
          </p>
        </div>

        {/* Team Count */}
        <div
          className={`clay-card p-6 mb-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <label
            className="clay-caption block mb-3"
            style={{ color: 'var(--clay-muted)' }}
          >
            عدد الفرق المشاركة
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={2}
              max={8}
              value={teamCount}
              onChange={(e) => handleTeamCountChange(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--clay-coral)' }}
            />
            <div
              className="w-16 h-10 flex items-center justify-center"
              style={{
                borderRadius: '12px',
                background: 'var(--clay-surface-card)',
              }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--clay-coral)' }}
              >
                {teamCount}
              </span>
            </div>
          </div>
          <p className="clay-body-sm mt-2" style={{ color: 'var(--clay-muted-soft)' }}>
            اختر من 2 إلى 8 فرق. ستلعب جميع الفرق بالتناوب.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid gap-5 mb-6 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team, index) => (
            <div
              key={index}
              className={`clay-card overflow-hidden transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 60}ms` }}
            >
              {/* Color accent bar */}
              <div className="h-2" style={{ background: team.color }} />

              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      borderRadius: '16px',
                      background: `${team.color}15`,
                      border: `2px solid ${team.color}30`,
                    }}
                  >
                    <img
                      src={team.avatar}
                      alt={team.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="clay-caption block"
                      style={{ color: 'var(--clay-muted-soft)' }}
                    >
                      الفريق {index + 1}
                    </span>
                    <div
                      className="font-bold text-lg truncate"
                      style={{ color: 'var(--clay-ink)' }}
                    >
                      {team.name || 'فريق جديد'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      className="clay-caption block mb-1.5"
                      style={{ color: 'var(--clay-muted)' }}
                    >
                      اسم الفريق
                    </label>
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) =>
                        updateTeam(index, { name: e.target.value })
                      }
                      className="clay-input w-full"
                      placeholder="اكتب اسم الفريق..."
                    />
                  </div>

                  <div>
                    <label
                      className="clay-caption block mb-1.5"
                      style={{ color: 'var(--clay-muted)' }}
                    >
                      لون الفريق
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() =>
                            updateTeam(index, { color: color.hex })
                          }
                          className="w-8 h-8 rounded-full transition-all duration-200"
                          style={{
                            background: color.hex,
                            border:
                              team.color === color.hex
                                ? `3px solid var(--clay-canvas)`
                                : '3px solid transparent',
                            boxShadow:
                              team.color === color.hex
                                ? `0 0 0 2px ${color.hex}`
                                : 'none',
                          }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Group Count */}
        <div
          className={`clay-card p-6 mb-8 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '400ms' }}
        >
          <label
            className="clay-caption block mb-3"
            style={{ color: 'var(--clay-muted)' }}
          >
            عدد المجموعات لكل شوط
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={34}
              value={groupCount}
              onChange={(e) =>
                setGroupCount(
                  Math.max(1, Math.min(34, Number(e.target.value) || 1)),
                )
              }
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--clay-ochre)' }}
            />
            <div
              className="w-16 h-10 flex items-center justify-center"
              style={{
                borderRadius: '12px',
                background: 'var(--clay-surface-card)',
              }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--clay-ochre)' }}
              >
                {groupCount}
              </span>
            </div>
          </div>
          <p
            className="clay-body-sm mt-2"
            style={{ color: 'var(--clay-muted-soft)' }}
          >
            كل مجموعة تحتوي على 3 أسئلة. يمكنك اختيار حتى 34 مجموعة.
          </p>
        </div>

        {/* Start Button */}
        <div
          className={`transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <button
            onClick={() => {
              playSound('click')
              if (canStart) {
                dispatch({
                  type: 'START_GAME',
                  payload: { teams, groupCount },
                })
                navigate(routes.gameHub)
              }
            }}
            disabled={!canStart}
            className={`w-full max-w-md mx-auto flex items-center justify-center gap-3 clay-btn-primary ${!canStart ? '!bg-clay-surface-strong !text-clay-muted cursor-not-allowed' : ''}`}
          >
            <Play className="w-5 h-5" />
            بدء المباراة
          </button>
        </div>
      </div>
    </div>
  )
}
