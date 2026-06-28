import { Navigate, Outlet } from 'react-router'
import { useGame } from '@/context/GameContext'
import { routes } from '@/lib/routes'

export default function ProtectedRoute() {
  const { state } = useGame()

  if (state.teams.length === 0) {
    return <Navigate to={routes.setup} replace />
  }

  return <Outlet />
}
