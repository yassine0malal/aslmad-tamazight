import { Routes, Route } from 'react-router'
import { GameProvider } from '@/context/GameContext'
import { Toaster } from 'sonner'
import GameLayout from '@/layouts/GameLayout'
import BareLayout from '@/layouts/BareLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import LandingView from '@/views/LandingView'
import SetupView from '@/views/SetupView'
import GameHubView from '@/views/GameHubView'
import NextLetterView from '@/views/NextLetterView'
import AmudruMatchView from '@/views/AmudruMatchView'
import MemoryMatchView from '@/views/MemoryMatchView'
import AmsasaRiddleView from '@/views/AmsasaRiddleView'
import ColorsGameView from '@/views/ColorsGameView'
import PronunciationView from '@/views/PronunciationView'
import CultureView from '@/views/CultureView'
import GameOverView from '@/views/GameOverView'
import NotFoundView from '@/views/NotFoundView'
import AboutView from '@/views/AboutView'
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
        {/* Bare layout — immersive pages (game-over) */}
        <Route element={<BareLayout />}>
          <Route path={routes.gameOver} element={<GameOverView />} />
        </Route>

        {/* Game layout — navbar + teacher panel + content area */}
        <Route element={<GameLayout />}>
          <Route path={routes.landing} element={<LandingView />} />
          <Route path={routes.setup} element={<SetupView />} />
          <Route path={routes.culture} element={<CultureView />} />
          <Route path={routes.about} element={<AboutView />} />
          <Route path={routes.colors} element={<ColorsGameView />} />
          <Route path={routes.pronunciation} element={<PronunciationView />} />

          {/* All routes below require setup to be completed */}
          <Route element={<ProtectedRoute />}>
            <Route path={routes.gameHub} element={<GameHubView />} />
            <Route path={routes.nextLetter} element={<NextLetterView />} />
            <Route path={routes.animalMatch} element={<AmudruMatchView />} />
            <Route path={routes.memory} element={<MemoryMatchView />} />
            <Route path={routes.riddle} element={<AmsasaRiddleView />} />
          </Route>
        </Route>

        {/* Catch-all — 404 page for unknown routes */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </GameProvider>
  )
}
