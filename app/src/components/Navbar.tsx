import { Link, useLocation } from 'react-router'
import { useGame } from '@/context/GameContext'
import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Trophy, Menu, X } from 'lucide-react'
import { playSound } from '@/lib/utils'
import { navLinks, routes } from '@/lib/routes'
import { useIsMobile } from '@/hooks/use-mobile'
import logo from '@/assets/logo.png'


export default function Navbar() {
  const { state, dispatch } = useGame()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  // Auto-close mobile menu on route change (e.g. browser back button)
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-5"
        style={{
          height: '64px',
          background: 'var(--clay-canvas)',
          borderBottom: '1px solid var(--clay-hairline)',
        }}
      >
        {/* Logo */}
        
        <Link
          to={routes.gameHub}
          className="flex items-center gap-2.5 shrink-0 no-underline"
        >
          <span
            className="tifinagh-text text-2xl font-bold leading-none"
            style={{ color: 'var(--clay-ink)' }}
          >
            &#x2D30;&#x2D59;&#x2D4D;&#x2D4E;&#x2D30;&#x2D37;
          </span>
         

        </Link>

        {/* Center nav links — desktop only */}
        {!isMobile && (
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`clay-nav-link px-3 py-1.5 no-underline transition-colors duration-150 ${isActive
                      ? 'bg-clay-surface-card text-clay-ink'
                      : 'text-clay-muted hover:text-clay-ink'
                    }`}
                  style={{ borderRadius: '8px' }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        {/* Right action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Score badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5"
            style={{
              borderRadius: '9999px',
              background: 'var(--clay-surface-card)',
            }}
          >
            <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--clay-ochre)' }} />
            <span className="clay-caption" style={{ color: 'var(--clay-ink)' }}>
              {state.teams[state.activeTeamIndex]?.score ?? 0}
            </span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => {
              playSound('click')
              dispatch({ type: 'TOGGLE_SOUND' })
            }}
            className="w-9 h-9 flex items-center justify-center transition-colors duration-150"
            style={{
              borderRadius: '9999px',
              background: 'var(--clay-surface-soft)',
              color: state.soundEnabled ? 'var(--clay-ink)' : 'var(--clay-muted)',
            }}
            title={state.soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Hamburger menu — mobile only */}
          {isMobile && (
            <button
              onClick={() => {
                playSound('click')
                setMenuOpen(!menuOpen)
              }}
              className="w-9 h-9 flex items-center justify-center transition-colors duration-150"
              style={{
                borderRadius: '9999px',
                background: menuOpen ? 'var(--clay-ink)' : 'var(--clay-surface-soft)',
                color: menuOpen ? 'white' : 'var(--clay-ink)',
              }}
              title="القائمة"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          {/* Teacher panel toggle */}
          <button
            onClick={() => {
              playSound('click')
              dispatch({ type: 'TOGGLE_PANEL' })
            }}
            className="w-10 h-10 p-0 flex items-center justify-center overflow-hidden"
            style={{ borderRadius: '9999px', background: 'var(--clay-surface-soft)' }}
            title="لوحة المعلم"
          >
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {isMobile && (
        <div
          className="fixed top-[64px] left-0 right-0 z-40 overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: menuOpen ? '400px' : '0',
            opacity: menuOpen ? 1 : 0,
            background: 'var(--clay-canvas)', borderBottom: '1px solid var(--clay-hairline)',
          }}
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="clay-nav-link px-4 py-3 no-underline transition-colors duration-150"
                  style={{
                    borderRadius: '8px',
                    background: isActive ? 'var(--clay-surface-card)' : 'transparent',
                    color: isActive ? 'var(--clay-ink)' : 'var(--clay-muted)',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
