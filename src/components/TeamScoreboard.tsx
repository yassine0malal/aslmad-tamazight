import { memo } from 'react'
import { useGame } from '@/context/GameContext'
import { useLocation } from 'react-router'
import { Trophy } from 'lucide-react'
import { routes } from '@/lib/routes'

/**
 * TeamScoreboard — shows all teams in a compact horizontal strip.
 * The currently active team is highlighted with its color.
 * Visible only during active gameplay (not on landing, setup, or game-over).
 */
function TeamScoreboard() {
  const { state } = useGame()
  const location = useLocation()

  // Only show on game views where teams are playing
  const isGameView = [routes.nextLetter, routes.animalMatch, routes.memory, routes.riddle].includes(location.pathname as typeof routes.nextLetter)

  if (!isGameView || state.teams.length === 0) return null

  // Find the highest score for highlighting
  const maxScore = Math.max(...state.teams.map((t) => t.score), 0)

  return (
    <div
      className="w-full overflow-x-auto scrollbar-none px-0 mb-3"
    >
      <div className="flex items-center gap-3 min-w-max mx-auto" style={{ justifyContent: 'center' }}>
        {state.teams.map((team, index) => {
          const isActive = index === state.activeTeamIndex
          const isLeader = team.score > 0 && team.score === maxScore

          return (
            <div
              key={team.id}
              className="flex items-center gap-2.5 px-3 py-2 transition-all duration-300"
              style={{
                borderRadius: '12px',
                background: isActive ? `${team.color}12` : 'transparent',
                border: isActive ? `1.5px solid ${team.color}40` : '1.5px solid transparent',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  borderRadius: '10px',
                  background: `${team.color}18`,
                  border: `2px solid ${isActive ? team.color : 'transparent'}`,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <img
                  src={team.avatar}
                  alt={team.name}
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Name + Score */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-sm font-semibold truncate max-w-[80px] leading-tight"
                  style={{
                    color: isActive ? 'var(--clay-ink)' : 'var(--clay-muted)',
                  }}
                >
                  {team.name}
                </span>
                <div className="flex items-center gap-1">
                  <Trophy
                    className="w-3.5 h-3.5"
                    style={{
                      color: isLeader ? 'var(--clay-ochre)' : 'var(--clay-muted-soft)',
                    }}
                  />
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: isLeader ? 'var(--clay-ochre)' : 'var(--clay-muted)',
                    }}
                  >
                    {team.score}
                  </span>
                </div>
              </div>

              {/* Active indicator dot */}
              {isActive && (
                <div
                  className="w-2 h-2 shrink-0 rounded-full animate-pulse"
                  style={{ background: team.color }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(TeamScoreboard)
