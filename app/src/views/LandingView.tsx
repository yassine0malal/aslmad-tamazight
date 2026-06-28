import { useGame } from '@/context/GameContext'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight, Sparkles } from 'lucide-react'
import { playSound } from '@/lib/utils'
import { routes } from '@/lib/routes'
import { floatingLetters } from '@/data/constants'

export default function LandingView() {
  const { dispatch } = useGame()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--clay-canvas)' }}
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/landing-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Floating Tifinagh letters */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      >
        {floatingLetters.map((letter, i) => (
          <div
            key={i}
            className={`absolute tifinagh-text ${letter.size} select-none`}
            style={{
              left: letter.x,
              top: letter.y,
              color: 'var(--clay-muted-soft)',
              opacity: 0.15,
              animation: `float 4s ease-in-out ${letter.delay}s infinite`,
            }}
          >
            {letter.char}
          </div>
        ))}

        {/* Decorative circles */}
        <div
          className="absolute top-[15%] left-[10%] w-20 h-20 rounded-full animate-float"
          style={{ border: '1px solid var(--clay-hairline)' }}
        />
        <div
          className="absolute bottom-[20%] right-[12%] w-32 h-32 rounded-full animate-float"
          style={{ border: '1px solid var(--clay-hairline-soft)', animationDelay: '1s' }}
        />
        <div
          className="absolute top-[60%] left-[8%] w-16 h-16 rounded-full animate-float"
          style={{ background: 'var(--clay-surface-soft)', animationDelay: '2s' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        {/* Tifinagh title */}
        <div
          className={`mb-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <span
            className="tifinagh-text text-7xl md:text-9xl font-extrabold block"
            style={{
              color: 'var(--clay-ink)',
              textShadow: '0 4px 30px rgba(0,0,0,0.08)',
            }}
          >
            &#x2D30;&#x2D53;&#x2D4A;&#x2D4D;&#x2D53;
          </span>
        </div>

        {/* App name */}
        <h1
          className={`text-5xl md:text-7xl font-bold mb-3 tracking-wide transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            transitionDelay: '400ms',
            color: 'var(--clay-ink)',
            letterSpacing: '-1px',
          }}
        >
          Asklu
        </h1>

        {/* Subtitle */}
        <p
          className={`clay-body-lg mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            transitionDelay: '550ms',
            color: 'var(--clay-body)',
          }}
        >
          لعبة تعليمية تفاعلية لتعلم حروف التيفيناغ
        </p>

        {/* CTA Button */}
        <div
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <button
            onClick={() => {
              playSound('click')
              dispatch({ type: 'START_SETUP' })
              navigate(routes.setup)
            }}
            className="group clay-btn-primary inline-flex items-center justify-center gap-3 px-10 py-4 text-lg"
          >
            <Sparkles className="w-5 h-5" />
            ابدأ اللعب
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Decorative Tifinagh row */}
        <div
          className={`mt-14 flex items-center justify-center gap-5 transition-all duration-1000 ${visible ? 'opacity-50' : 'opacity-0'}`}
          style={{ transitionDelay: '900ms' }}
        >
          {['&#x2D30;', '&#x2D31;', '&#x2D33;', '&#x2D37;', '&#x2D3C;', '&#x2D40;'].map(
            (char, i) => (
              <span key={i} className="flex items-center gap-5">
                <span
                  className="tifinagh-text text-3xl transition-transform duration-300 hover:scale-125 cursor-default"
                  style={{ color: 'var(--clay-muted)' }}
                >
                  {char}
                </span>
                {i < 5 && (
                  <span style={{ color: 'var(--clay-hairline)' }} className="text-sm">
                    •
                  </span>
                )}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
