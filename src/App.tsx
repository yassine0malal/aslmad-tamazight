import { Routes, Route, Navigate } from 'react-router'
import { GameProvider } from '@/context/GameContext'
import { Toaster } from 'sonner'
import GameLayout from '@/layouts/GameLayout'
import BareLayout from '@/layouts/BareLayout'
import LandingView from '@/views/LandingView'
import SetupView from '@/views/SetupView'
import GameHubView from '@/views/GameHubView'
import NextLetterView from '@/views/NextLetterView'
import AmudruMatchView from '@/views/AmudruMatchView'
import MemoryMatchView from '@/views/MemoryMatchView'
import AmsasaRiddleView from '@/views/AmsasaRiddleView'
import SoukView from '@/views/SoukView'
import GameOverView from '@/views/GameOverView'
import { routes } from '@/lib/routes'

export default function App() {
  return (
    <GameProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: '"El Messiri", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            borderRadius: '12px',
            background: 'var(--clay-canvas)',
            color: 'var(--clay-ink)',
            border: '1px solid var(--clay-hairline)',
          },
        }}
      />

      <Routes>
        {/* Bare layout — immersive pages (landing, game-over) */}
        <Route element={<BareLayout />}>
          <Route path={routes.landing} element={<LandingView />} />
          <Route path={routes.gameOver} element={<GameOverView />} />
        </Route>

        {/* Game layout — navbar + teacher panel + content area */}
        <Route element={<GameLayout />}>
          <Route path={routes.setup} element={<SetupView />} />
          <Route path={routes.gameHub} element={<GameHubView />} />
          <Route path={routes.nextLetter} element={<NextLetterView />} />
          <Route path={routes.animalMatch} element={<AmudruMatchView />} />
          <Route path={routes.memory} element={<MemoryMatchView />} />
          <Route path={routes.riddle} element={<AmsasaRiddleView />} />
          <Route path={routes.souk} element={<SoukView />} />
        </Route>

        {/* Catch-all — redirect to landing */}
        <Route path="*" element={<Navigate to={routes.landing} replace />} />
      </Routes>
    </GameProvider>
  )
}
