import { Navigate, Outlet, useLocation } from 'react-router'
import { useGame } from '@/context/GameContext'
import { routes } from '@/lib/routes'

export default function ProtectedRoute() {
  const { state } = useGame()
  const location = useLocation()

  if (state.teams.length === 0) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${routes.setup}?redirect=${redirect}`} replace />
  }

  return <Outlet />
}
