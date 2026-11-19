import { memo } from 'react'
import { useGame } from '@/context/GameContext'
import { useLocation } from 'react-router'
import { Banana } from 'lucide-react'
import { routes } from '@/lib/routes'

/**
 * TeamScoreboard — vertical team column beside the game.
 * Each row is a circular avatar, the team name and a dark score pill, keeping
 * the classroom projector look. The active team gets a green ring.
 * Visible only during active gameplay (not on landing, setup, or game-over).
 */
function TeamScoreboard({ fill = false }: { fill?: boolean }) {
  const { state } = useGame()
  const location = useLocation()

  const isGameView = [
    routes.nextLetter,
    routes.animalMatch,
    routes.memory,
    routes.riddle,
    routes.colors,
  ].includes(location.pathname as typeof routes.nextLetter)

  if (!isGameView || state.teams.length === 0) return null

  const maxScore = Math.max(...state.teams.map((t) => t.score), 0)

  return (
    <div
      className={
        fill
          ? 'flex h-full w-full flex-col justify-around gap-2'
          : 'flex w-full flex-col gap-1.5'
      }
    >
      {state.teams.map((team, index) => {
        const isActive = index === state.activeTeamIndex
        const isLeader = team.score > 0 && team.score === maxScore

        return (
          <div
            key={team.id}
            className={`flex w-full items-center gap-2 px-2.5 transition-all duration-300 ${
              fill ? 'flex-1 py-2' : 'py-1.5'
            }`}
            style={{
              borderRadius: '16px',
              background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
              border: `2px solid ${isActive ? 'var(--clay-success)' : 'transparent'}`,
              opacity: isActive ? 1 : 0.8,
              boxShadow: isActive
                ? '0 0 0 4px rgba(46, 160, 95, 0.18), 0 6px 14px rgba(61, 44, 20, 0.12)'
                : '0 3px 8px rgba(61, 44, 20, 0.04)',
            }}
          >
            {/* Avatar — green ring marks whose turn it is */}
            <div
              className="flex shrink-0 items-center justify-center rounded-full bg-white transition-all duration-300"
              style={{
                width: fill ? '48px' : '38px',
                height: fill ? '48px' : '38px',
                padding: '3px',
                border: `2px solid ${isActive ? 'var(--clay-success)' : 'var(--clay-hairline)'}`,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img
                src={team.avatar}
                alt=""
                aria-hidden
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>

            {/* Team name */}
            <span
              className={`min-w-0 flex-1 truncate font-bold leading-tight ${
                fill ? 'text-[15px]' : 'text-[13px]'
              }`}
              style={{ color: isActive ? 'var(--clay-ink)' : 'var(--clay-muted)' }}
              title={team.name}
            >
              {team.name}
            </span>

            {/* Score pill */}
            <div
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 ${
                fill ? 'py-1.5' : 'py-1'
              }`}
              style={{
                background: '#252a3a',
                boxShadow: '0 3px 8px rgba(37, 42, 58, 0.22)',
              }}
            >
              <Banana
                className="h-3.5 w-3.5"
                style={{ color: isLeader ? '#ffd84d' : '#f3d38a' }}
              />
              <span
                className="text-[14px] font-bold leading-none tabular-nums text-white"
                aria-label={`${team.name}: ${team.score}`}
              >
                {team.score}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(TeamScoreboard)
