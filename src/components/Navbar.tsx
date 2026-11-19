import { Link, useLocation, useNavigate } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Info } from 'lucide-react'

import { navGroups, routes } from '@/lib/routes'
import { useGame } from '@/context/GameContext'
import { useIsMobile } from '@/hooks/use-mobile'
import logo from '@/assets/logo.png'
import iconAll from '@/assets/icons/teams-games/all.png'
import iconGroups from '@/assets/icons/teams-games/groups.png'
import iconNextLetter from '@/assets/icons/teams-games/next-letter.png'
import iconAnimal from '@/assets/icons/teams-games/animal.png'
import iconMind from '@/assets/icons/teams-games/mind.png'
import iconPictureQuiz from '@/assets/icons/teams-games/picture-quiz.png'
import iconKids from '@/assets/icons/class-games/kids.png'
import iconMarket from '@/assets/icons/market/market.png'
import iconPronunciation from '@/assets/icons/pronunciation.svg'
import iconCulture from '@/assets/icons/culture.png'

const iconMap: Record<string, string> = {
  'all': iconAll,
  'groups': iconGroups,
  'next-letter': iconNextLetter,
  'animal': iconAnimal,
  'mind': iconMind,
  'picture-quiz': iconPictureQuiz,
  'kids': iconKids,
  'market': iconMarket,
  'pronunciation': iconPronunciation,
  'culture': iconCulture,
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const timeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
    setExpandedMobileGroup(null)
  }, [location.pathname])

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const isInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(target),
      )
      if (!isInside) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Clean up hover timeout on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(clearTimeout)
    }
  }, [])

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current[id]) {
      clearTimeout(timeoutRef.current[id])
      delete timeoutRef.current[id]
    }
    setOpenDropdown(id)
  }

  const handleMouseLeave = (id: string) => {
    timeoutRef.current[id] = setTimeout(() => {
      setOpenDropdown((current) => (current === id ? null : current))
    }, 150)
  }

  const { state } = useGame()

  const isChildActive = (to: string) => location.pathname === to
  const isGroupActive = (children: { to: string }[]) =>
    children.some((child) => location.pathname === child.to)

  // If user has completed setup (teams exist), go directly to the game.
  // Otherwise, redirect to setup first, remembering which game they wanted.
  const gameRoute = (to: string) =>
    state.teams.length > 0
      ? to
      : `${routes.setup}?redirect=${encodeURIComponent(to)}`

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6"
        style={{
          height: '64px',
          background: 'var(--clay-canvas)',
          borderBottom: '1px solid var(--clay-hairline)',
        }}
      >
        {/* Right side — Hamburger + Logo */}
        <div className="flex items-center gap-1">
          {/* Hamburger menu — mobile only (placed BEFORE logo) */}
          {isMobile && (
            <button
              onClick={() => {
                setMenuOpen(!menuOpen)
                setExpandedMobileGroup(null)
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

          {/* Logo — links to landing page */}
          <Link
            to={routes.landing}
            className="flex items-center gap-2 no-underline shrink-0"
          >
            <img src={logo} alt="Aslmad" className="w-8 h-8 object-contain" />
            {/* App name hidden on mobile, visible on sm+ */}
            <span
              className="tifinagh-text text-xl font-bold leading-none hidden sm:inline"
              style={{ color: 'var(--clay-ink)' }}
            >
              &#x2D30;&#x2D59;&#x2D4D;&#x2D4E;&#x2D30;&#x2D37;
            </span>
          </Link>
        </div>

        {/* Center: 3 dropdown nav tabs — desktop only */}
        {!isMobile && (
          <nav className="flex items-center gap-1">
            {navGroups.map((group) => {
              const active = isGroupActive(group.children)
              const isOpen = openDropdown === group.id

              return (
                <div
                  key={group.id}
                  ref={(el) => { dropdownRefs.current[group.id] = el }}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.id)}
                  onMouseLeave={() => handleMouseLeave(group.id)}
                >
                  {/* Tab button */}
                  <button
                    onClick={() =>
                      group.children.length === 1
                        ? navigate(group.children[0].to)
                        : setOpenDropdown(isOpen ? null : group.id)
                    }
                    className="flex items-center gap-1.5 px-3 py-2 transition-all duration-200"
                    style={{
                      borderRadius: '10px',
                      background: active
                        ? 'var(--clay-surface-card)'
                        : isOpen
                          ? 'var(--clay-surface-soft)'
                          : 'transparent',
                      color: active ? 'var(--clay-ink)' : 'var(--clay-muted)',
                    }}
                  >
                    <img src={iconMap[group.icon]} alt="" className="w-5 h-5 " />
                    <span className="clay-body-sm font-medium whitespace-nowrap">
                      {group.label}
                    </span>
                    {group.children.length > 1 && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {/* Dropdown menu */}
                  {isOpen && group.children.length > 1 && (
                    <div
                      className="absolute top-full left-0 mt-1 min-w-[220px] overflow-hidden transition-all duration-200"
                      style={{
                        borderRadius: '14px',
                        background: 'var(--clay-canvas)',
                        border: '1px solid var(--clay-hairline)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      }}
                    >
                      {group.children.map((child) => {
                        const childActive = isChildActive(child.to)
                        return (
                          <Link
                            key={child.to}
                            to={gameRoute(child.to)}
                            className="flex items-center gap-3 px-4 py-3 no-underline transition-colors duration-150"
                            style={{
                              background: childActive
                                ? 'var(--clay-surface-card)'
                                : 'transparent',
                              color: childActive
                                ? 'var(--clay-ink)'
                                : 'var(--clay-muted)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--clay-surface-soft)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = childActive
                                ? 'var(--clay-surface-card)'
                                : 'transparent'
                            }}
                          >
                            <img src={iconMap[child.icon]} alt="" className="w-6 h-6 object-contain" />
                            <div className="flex flex-col">
                              <span className="clay-body-sm font-medium">
                                {child.label}
                              </span>
                              {child.description && (
                                <span
                                  className="clay-caption"
                                  style={{ color: 'var(--clay-muted-soft)' }}
                                >
                                  {child.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        )}

        {/* Logo + app name — links to about page */}
        <Link
          to={routes.about}
          className="flex items-center gap-2 shrink-0 no-underline"
        >
          <button className='bg-clay-surface-strong px-4 py-1 rounded-[4px] hover:bg-clay-surface-dark hover:text-white transition-all duration-300'>من نحن</button>
        </Link>
      </header>

      {/* Mobile nav drawer — redesign: clean, no border-radius */}
      {isMobile && (
        <div
          className="fixed top-[64px] left-0 right-0 z-40 overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: menuOpen ? '600px' : '0',
            opacity: menuOpen ? 1 : 0,
            background: 'var(--clay-canvas)',
            borderBottom: '1px solid var(--clay-hairline)',
            boxShadow: menuOpen ? '0 16px 48px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          {/* Subtle accent bar at top */}
          <div
            className="h-0.5 w-full"
            style={{ background: 'var(--clay-hairline)' }}
          />

          <nav className="flex flex-col py-2">
            {navGroups.map((group) => {
              const groupActive = isGroupActive(group.children)
              const isExpanded = expandedMobileGroup === group.id

              return (
                <div key={group.id}>
                  {/* Group header */}
                  <button
                    onClick={() => {
                      if (group.children.length === 1) {
                        navigate(group.children[0].to)
                      } else {
                        setExpandedMobileGroup(isExpanded ? null : group.id)
                      }
                    }}
                    className="w-full flex items-center justify-between px-5 py-3.5 transition-colors duration-150"
                    style={{
                      background: groupActive ? 'var(--clay-surface-card)' : 'transparent',
                      color: groupActive ? 'var(--clay-ink)' : 'var(--clay-muted)',
                      borderBottom: '1px solid var(--clay-hairline)',
                    }}
                  >
                    <span className="flex items-center gap-2.5 clay-body-sm font-medium">
                      <img src={iconMap[group.icon]} alt="" className="w-5 h-5 object-contain" />
                      {group.label}
                    </span>
                    {group.children.length > 1 && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {/* Sub-items (collapsible) */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isExpanded ? `${group.children.length * 56}px` : '0',
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div className="flex flex-col gap-0.5 pr-8 mr-3 py-1"
                      style={{ borderRight: '1px solid var(--clay-hairline)' }}
                    >
                      {group.children.map((child) => {
                        const childActive = isChildActive(child.to)
                        return (
                          <Link
                            key={child.to}
                            to={gameRoute(child.to)}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 no-underline transition-colors duration-150"
                            style={{
                              background: childActive
                                ? 'var(--clay-surface-card)'
                                : 'transparent',
                              color: childActive
                                ? 'var(--clay-ink)'
                                : 'var(--clay-muted)',
                            }}
                          >
                            <img src={iconMap[child.icon]} alt="" className="w-5 h-5 object-contain" />
                            <div className="flex flex-col">
                              <span className="clay-body-sm">{child.label}</span>
                              {child.description && (
                                <span
                                  className="clay-caption"
                                  style={{ color: 'var(--clay-muted-soft)' }}
                                >
                                  {child.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Bottom actions */}
            <div className="mt-auto px-5 py-4 flex flex-col gap-2"
              style={{ borderTop: '1px solid var(--clay-hairline)' }}
            >
              <Link
                to={routes.setup}
                onClick={() => setMenuOpen(false)}
                className="clay-body-sm px-4 py-3 no-underline transition-colors duration-150 text-center"
                style={{
                  color: 'var(--clay-ink)',
                  background: 'var(--clay-surface-card)',
                  fontWeight: 500,
                }}
              >
                &#x2190; العودة إلى الإعدادات
              </Link>
              <Link
                to={routes.about}
                onClick={() => setMenuOpen(false)}
                className="clay-body-sm px-4 py-2.5 no-underline transition-colors duration-150 text-center"
                style={{
                  color: 'var(--clay-muted-soft)',
                }}
              >
                <Info className="w-3.5 h-3.5 inline-block ml-1 -mt-0.5" />
                حول التطبيق
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
