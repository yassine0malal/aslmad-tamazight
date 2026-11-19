import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

interface FitToViewportProps {
  children: ReactNode
  /** Never shrink below this factor, to keep text readable on tiny screens. */
  minScale?: number
}

/**
 * Keeps its content fully visible without page scrolling by scaling it down
 * when the natural height exceeds the available height. Used for the game
 * screens so a classroom projector never needs to scroll.
 */
export default function FitToViewport({ children, minScale = 0.6 }: FitToViewportProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const measure = useCallback(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    const available = frame.clientHeight
    const natural = content.scrollHeight
    if (!available || !natural) return

    const next = Math.min(1, Math.max(minScale, available / natural))
    setScale((previous) => (Math.abs(previous - next) < 0.002 ? previous : next))
  }, [minScale])

  // Measure before paint so the first render is already scaled.
  useLayoutEffect(() => {
    measure()
  })

  useEffect(() => {
    measure()

    const observer = new ResizeObserver(measure)
    if (frameRef.current) observer.observe(frameRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <div ref={frameRef} className="h-full w-full overflow-hidden">
      <div
        ref={contentRef}
        className="w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {children}
      </div>
    </div>
  )
}
