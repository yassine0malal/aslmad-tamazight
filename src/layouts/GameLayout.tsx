import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TeacherPanel from '@/components/TeacherPanel'
import TeamScoreboard from '@/components/TeamScoreboard'
import FitToViewport from '@/components/FitToViewport'
import { routes } from '@/lib/routes'

export default function GameLayout() {
  const location = useLocation()
  const isLanding = location.pathname === routes.landing
  const gamePaths: string[] = [
    routes.nextLetter,
    routes.animalMatch,
    routes.memory,
    routes.riddle,
    routes.colors,
  ]
  const isGamePage = gamePaths.includes(location.pathname)
  const isSetup = location.pathname === routes.setup

  // Setup scales to the viewport on large screens, but scrolls naturally on phones.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <div
      className={
        isGamePage
          ? 'h-[100dvh] flex flex-col overflow-hidden'
          : isSetup
            ? 'min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden flex flex-col'
            : 'min-h-screen flex flex-col'
      }
      style={{ background: isLanding ? '#F7F3EA' : 'var(--clay-canvas)' }}
    >
      <Navbar />

      {/* Teacher panel — only render on non-landing pages */}
      {!isLanding && <TeacherPanel />}

      {isGamePage ? (
        /* Game pages: full-height stage, no page scrolling */
        <main className="w-full flex-1 min-h-0 flex flex-col px-3 pt-[72px] pb-2 sm:px-4">
          <div
            className="relative flex-1 min-h-0 flex flex-col p-2.5 sm:p-3"
            style={{
              border: '4px solid #ffffff',
              borderRadius: '28px',
              background: 'rgba(255, 255, 255, 0.5)',
              boxShadow:
                '0 0 0 1px rgba(184, 164, 237, 0.3), 0 22px 55px rgba(61, 44, 20, 0.1)',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3">
              {/* Team column — vertical, always visible beside the game */}
              <aside className="w-full lg:w-60 shrink-0 lg:h-full flex flex-col gap-2">
                <Link
                  to={routes.gameHub}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold no-underline transition-transform duration-150 hover:-translate-y-0.5"
                  style={{
                    background: '#252a3a',
                    color: '#ffffff',
                    boxShadow: '0 4px 10px rgba(37, 42, 58, 0.25)',
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  كل الألعاب
                </Link>

                <div
                  className="w-full flex-1 min-h-0 flex flex-col p-2"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(180deg, #FBE8AE 0%, #F5CE6C 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 8px 20px rgba(61, 44, 20, 0.08)',
                  }}
                >
                  <TeamScoreboard fill />
                </div>
              </aside>

              {/* Game stage — scaled down if needed so it always fits */}
              <div className="flex-1 min-w-0 min-h-0">
                <FitToViewport>
                  <Outlet />
                </FitToViewport>
              </div>
            </div>
          </div>
        </main>
      ) : isSetup ? (
        /* Setup: scaled to the viewport on desktop, normal flow on mobile */
        <main className="mx-auto w-full flex-1 min-h-0 px-2 pt-[70px] pb-3 sm:px-3 sm:pt-[76px]">
          {isDesktop ? (
            <FitToViewport>
              <Outlet />
            </FitToViewport>
          ) : (
            <Outlet />
          )}
        </main>
      ) : (
        <main
          className={`mx-auto w-full flex-1 ${isLanding ? '' : 'playful-page px-4 pt-24 pb-12'}`}
          style={{ maxWidth: isLanding ? 'none' : '1280px' }}
        >
          {!isLanding && <TeamScoreboard />}
          <Outlet />
        </main>
      )}

      {!isGamePage && !isSetup && <Footer />}
    </div>
  )
}
