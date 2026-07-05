import { Outlet, useLocation } from 'react-router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TeacherPanel from '@/components/TeacherPanel'
import TeamScoreboard from '@/components/TeamScoreboard'
import { routes } from '@/lib/routes'

export default function GameLayout() {
  const location = useLocation()
  const isLanding = location.pathname === routes.landing

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isLanding ? '#F7F3EA' : 'var(--clay-canvas)' }}
    >
      <Navbar />

      {/* Teacher panel — only render on non-landing pages */}
      {!isLanding && <TeacherPanel />}

      {/* Main content area */}
      <main
        className={`mx-auto w-full flex-1 ${isLanding ? '' : 'px-4 pt-24 pb-12'}`}
        style={{ maxWidth: isLanding ? 'none' : '1280px' }}
      >
        {/* Team scoreboard — only visible on game pages */}
        {!isLanding && <TeamScoreboard />}
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
