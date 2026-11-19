import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { shuffleArray } from '@/lib/utils'
import { routes } from '@/lib/routes'
import { colorAssets, paletteColors, type ColorAsset } from '@/data/colorsGameData'
import ParticleBurst from '@/components/ParticleBurst'
import { ArrowRight, Sparkles, Home, Palette, Volume2 } from 'lucide-react'

export default function ColorsGameView() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledAssets, setShuffledAssets] = useState<ColorAsset[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 })
  const [revealed, setRevealed] = useState(false)
  const [visible, setVisible] = useState(false)

  // Shuffle on mount
  useEffect(() => {
    setShuffledAssets(shuffleArray([...colorAssets]))
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const currentAsset = shuffledAssets[currentIndex]
  const isLast = currentIndex >= shuffledAssets.length - 1
  const totalPuzzles = shuffledAssets.length

  const progressPct = useMemo(() => {
    if (totalPuzzles === 0) return 0
    return Math.round((currentIndex / totalPuzzles) * 100)
  }, [currentIndex, totalPuzzles])

  const handleNext = useCallback(() => {
    if (revealed) {
      // Advance to next
      if (isLast) {
        navigate(routes.gameHub)
      } else {
        setRevealed(false)
        setCurrentIndex((prev) => prev + 1)
      }
    } else {
      // Reveal the answer (teacher clicks after students shout out)
      const cardEl = document.getElementById('color-object-card')
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect()
        setParticleOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }
      setRevealed(true)
      setShowParticles(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }, [revealed, isLast, navigate])

  const handleReset = useCallback(() => {
    setShuffledAssets(shuffleArray([...colorAssets]))
    setCurrentIndex(0)
    setRevealed(false)
    setShowCelebration(false)
  }, [])

  const handleSpeak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }, [])

  if (!currentAsset) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="clay-body-lg" style={{ color: 'var(--clay-ink)' }}>
          جارٍ تحضير اللعبة...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
              🎨 {currentIndex + 1} / {totalPuzzles}
            </span>
            <span className="clay-caption" style={{ color: 'var(--clay-coral)' }}>
              {progressPct}%
            </span>
          </div>
          <div
            className="h-2.5 rounded-full overflow-hidden"
            style={{ background: 'var(--clay-surface-strong)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(to right, var(--clay-coral), var(--clay-mint))`,
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {shuffledAssets.map((_, idx) => {
              const distance = Math.abs(idx - currentIndex)
              if (distance > 5 && idx !== 0 && idx !== totalPuzzles - 1) {
                if (idx === 6 || idx === totalPuzzles - 6)
                  return (
                    <span key={idx} className="text-xs" style={{ color: 'var(--clay-muted-soft)' }}>
                      …
                    </span>
                  )
                return null
              }
              return (
                <div
                  key={idx}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === currentIndex ? '20px' : '8px',
                    height: idx === currentIndex ? '10px' : '8px',
                    background:
                      idx < currentIndex
                        ? 'var(--clay-success)'
                        : idx === currentIndex
                          ? 'var(--clay-coral)'
                          : 'var(--clay-surface-strong)',
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div
          className={`text-center mb-5 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h2 className="clay-title-lg mb-1" style={{ color: 'var(--clay-ink)' }}>
            ⴰⵎⵓⵔⴰⵔ ⵏ ⵉⴽⵯⵍⴰⵏ — ألوان
          </h2>
          
        </div>

        {/* Main game area: Object (left) + Palette (right) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-5">
          {/* Left: Object display */}
          <div
            id="color-object-card"
            className="clay-card w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center overflow-hidden transition-all duration-600"
            style={{
              border: revealed ? `3px solid ${currentAsset.colorHex}` : undefined,
              transform: showCelebration ? 'scale(1.02)' : 'scale(1)',
              background: revealed
                ? `linear-gradient(135deg, ${currentAsset.colorHex}15, var(--clay-surface-card))`
                : undefined,
            }}
          >
            <div className="flex-1 w-full flex items-center justify-center p-6">
              <span className="text-8xl md:text-9xl transition-all duration-500">
                {currentAsset.objectEmoji}
              </span>
            </div>
            <div className="w-full text-center pb-6 px-4">
              <p className="clay-title-md" style={{ color: 'var(--clay-ink)' }}>
                {currentAsset.objectName}
              </p>
              <p className="clay-body-sm mt-1" style={{ color: 'var(--clay-muted-soft)' }}>
                أي لون هذا؟
              </p>
            </div>
          </div>

          {/* Right: Color palette */}
          <div className="w-full md:w-auto">
            <div className="clay-card p-6 md:p-8">
              <h3
                className="clay-title-sm mb-4 text-center flex items-center justify-center gap-2"
                style={{ color: 'var(--clay-ink)' }}
              >
                <Palette className="w-5 h-5" style={{ color: 'var(--clay-coral)' }} />
                لوحة الألوان
              </h3>
              <div className="flex flex-col items-center gap-3">
                {/* Row 1: Red, Blue, Green */}
                <div className="flex items-center gap-3">
                  {paletteColors.slice(0, 3).map((color, idx) => (
                    <ColorCircle
                      key={idx}
                      color={color}
                      isCorrect={revealed && color.colorHex === currentAsset.colorHex}
                      revealed={revealed}
                    />
                  ))}
                </div>
                {/* Row 2: Pink, Yellow, Brown, Purple */}
                <div className="flex items-center gap-3">
                  {paletteColors.slice(3, 7).map((color, idx) => (
                    <ColorCircle
                      key={idx}
                      color={color}
                      isCorrect={revealed && color.colorHex === currentAsset.colorHex}
                      revealed={revealed}
                    />
                  ))}
                </div>
                {/* Row 3: Orange, Black, White */}
                <div className="flex items-center gap-3">
                  {paletteColors.slice(7, 10).map((color, idx) => (
                    <ColorCircle
                      key={idx}
                      color={color}
                      isCorrect={revealed && color.colorHex === currentAsset.colorHex}
                      revealed={revealed}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question prompt banner */}
        <div
          className={`text-center mb-5 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '200ms' }}
        >
         
        </div>

        {/* Revealed answer */}
        {revealed && (
          <div className="text-center mb-5 animate-pop-in">
            <div
              className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
              style={{
                background: 'var(--clay-surface-soft)',
                border: `2px solid ${currentAsset.colorHex}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2"
                  style={{
                    background: currentAsset.colorHex,
                    borderColor: currentAsset.colorHex === '#F5F5F5' ? 'var(--clay-hairline)' : currentAsset.colorHex,
                  }}
                />
                <span className="tifinagh-text text-3xl font-bold" style={{ color: 'var(--clay-ink)' }}>
                  {currentAsset.tifinaghName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="clay-body-lg" style={{ color: 'var(--clay-lavender)' }}>
                  {currentAsset.latinName}
                </span>
                <span className="clay-body-lg" style={{ color: 'var(--clay-ochre)' }}>
                  {currentAsset.arabicName}
                </span>
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                style={{ background: `${currentAsset.colorHex}20`, color: currentAsset.colorHex }}
                onClick={() => handleSpeak(`${currentAsset.tifinaghName} ${currentAsset.latinName} ${currentAsset.arabicName}`)}
              >
                <Volume2 className="w-4 h-4" />
                استمع
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={handleNext} className="clay-btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            {revealed ? (
              isLast ? (
                <>
                  <Home className="w-5 h-5" />
                  العودة
                </>
              ) : (
                <>
                  التالي
                  <ArrowRight className="w-5 h-5" />
                </>
              )
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                ⴰⴼⵔⴰⵔ — إظهار الإجابة
              </>
            )}
          </button>

          {revealed && !isLast && (
            <button
              onClick={handleReset}
              className="clay-btn-secondary inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              إعادة التشغيل
            </button>
          )}
        </div>
      </div>

      {showParticles && (
        <ParticleBurst
          originX={particleOrigin.x}
          originY={particleOrigin.y}
          count={20}
          onComplete={() => setShowParticles(false)}
        />
      )}

    </div>
  )
}

/* ─── Color Circle Sub-Component ─── */

function ColorCircle({
  color,
  isCorrect,
  revealed,
}: {
  color: { colorHex: string; label: string }
  isCorrect: boolean
  revealed: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-full cursor-default transition-all duration-300"
        style={{
          background: color.colorHex,
          border:
            isCorrect && revealed
              ? '3px solid var(--clay-success)'
              : isHovered
                ? '2px solid var(--clay-ink)'
                : color.colorHex === '#F5F5F5'
                  ? '2px solid var(--clay-hairline)'
                  : '2px solid transparent',
          boxShadow:
            isCorrect && revealed
              ? `0 0 20px ${color.colorHex}80`
              : isHovered
                ? `0 4px 12px ${color.colorHex}40`
                : '0 2px 6px rgba(0,0,0,0.1)',
          transform: isCorrect && revealed ? 'scale(1.15)' : isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={color.label}
      />
      {revealed && isCorrect && (
        <span
          className="text-xs font-bold animate-pop-in"
          style={{ color: 'var(--clay-success)' }}
        >
          ✓
        </span>
      )}
    </div>
  )
}
