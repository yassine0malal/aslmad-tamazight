import { Link, useLocation, useNavigate } from 'react-router'
import { useGame } from '@/context/GameContext'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

import { navGroups, routes } from '@/lib/routes'
import { useIsMobile } from '@/hooks/use-mobile'
import logo from '@/assets/logo.png'
import iconGroups from '@/assets/icons/teams-games/groups.png'
import iconNextLetter from '@/assets/icons/teams-games/next-letter.png'
import iconAnimal from '@/assets/icons/teams-games/animal.png'
import iconMind from '@/assets/icons/teams-games/mind.png'
import iconPictureQuiz from '@/assets/icons/teams-games/picture-quiz.png'
import iconKids from '@/assets/icons/class-games/kids.png'
import iconMarket from '@/assets/icons/market/market.png'
import iconCulture from '@/assets/icons/culture.png'

const iconMap: Record<string, string> = {
  'groups': iconGroups,
  'next-letter': iconNextLetter,
  'animal': iconAnimal,
  'mind': iconMind,
  'picture-quiz': iconPictureQuiz,
  'kids': iconKids,
  'market': iconMarket,
  'culture': iconCulture,
}

export default function Navbar() {
  const { dispatch } = useGame()
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

  const isChildActive = (to: string) => location.pathname === to
  const isGroupActive = (children: { to: string }[]) =>
    children.some((child) => location.pathname === child.to)

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
        {/* Right action buttons — on the right side (RTL start) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Teacher panel toggle */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_PANEL' })}
            className="w-10 h-10 p-0 flex items-center justify-center overflow-hidden"
            style={{ borderRadius: '9999px', background: 'var(--clay-surface-soft)' }}
            title="لوحة المعلم"
          >
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </button>

          {/* Hamburger menu — mobile only */}
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
                            to={child.to}
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

        {/* Logo — always links to hub, on the left side (RTL end) */}
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
      </header>

      {/* Mobile nav drawer — accordion style */}
      {isMobile && (
        <div
          className="fixed top-[64px] left-0 right-0 z-40 overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: menuOpen ? '600px' : '0',
            opacity: menuOpen ? 1 : 0,
            background: 'var(--clay-canvas)',
            borderBottom: '1px solid var(--clay-hairline)',
          }}
        >
          <nav className="flex flex-col p-3 gap-1">
            {navGroups.map((group) => {
              const groupActive = isGroupActive(group.children)
              const isExpanded = expandedMobileGroup === group.id

              return (
                <div key={group.id}>
                  {/* Group header — clickable to expand */}
                  <button
                    onClick={() => {
                      if (group.children.length === 1) {
                        navigate(group.children[0].to)
                      } else {
                        setExpandedMobileGroup(isExpanded ? null : group.id)
                      }
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150"
                    style={{
                      borderRadius: '10px',
                      background: groupActive ? 'var(--clay-surface-card)' : 'transparent',
                      color: groupActive ? 'var(--clay-ink)' : 'var(--clay-muted)',
                    }}
                  >
                    <span className="flex items-center gap-2 clay-body-sm font-medium">
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
                    <div className="flex flex-col gap-0.5 pr-6 mr-2"
                      style={{ borderRight: '1px solid var(--clay-hairline)' }}
                    >
                      {group.children.map((child) => {
                        const childActive = isChildActive(child.to)
                        return (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 no-underline transition-colors duration-150"
                            style={{
                              borderRadius: '8px',
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

            {/* Quick hub link at bottom */}
            <Link
              to={routes.gameHub}
              onClick={() => setMenuOpen(false)}
              className="clay-body-sm px-4 py-3 mt-2 no-underline transition-colors duration-150 text-center"
              style={{
                borderRadius: '10px',
                color: 'var(--clay-muted-soft)',
                background: 'var(--clay-surface-soft)',
              }}
            >
              🏠 العودة إلى المركز
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
