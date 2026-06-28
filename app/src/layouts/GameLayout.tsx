import { Outlet } from 'react-router'
import Navbar from '@/components/Navbar'
import TeacherPanel from '@/components/TeacherPanel'
import TeamScoreboard from '@/components/TeamScoreboard'

export default function GameLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--clay-canvas)' }}>
      <Navbar />
      <TeacherPanel />

      {/* Main content area — pt-24 clears the fixed 64px navbar + breathing room */}
      <main
        className="mx-auto w-full px-4 pt-24 pb-12"
        style={{ maxWidth: '1280px' }}
      >
        <TeamScoreboard />
        <Outlet />
      </main>
    </div>
  )
}
