import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  LayoutGrid,
  Columns,
  Pause,
  Play,
  Keyboard,
} from 'lucide-react'
import { cultureItems, type CultureItem } from '@/data/cultureData'
import { floatingLetters } from '@/data/constants'

/* ─── Dynamically import all culture images using Vite's import.meta.glob ─── */
const imageModules: Record<string, { default: string }> = import.meta.glob(
  '/src/assets/images/culture/*.png',
  { eager: true },
)

/* Build a map: filename (without .png) → resolved URL */
const imageMap: Record<string, string> = {}
for (const [path, mod] of Object.entries(imageModules)) {
  const name = path.split('/').pop()?.replace(/\.png$/, '') ?? ''
  imageMap[name] = mod.default
}

/* Attach resolved image URL to each culture item */
const itemsWithImages = cultureItems.map((item) => ({
  ...item,
  imageUrl: imageMap[item.id] ?? '',
}))

/* ─── Constants ─── */
const CARD_W = 320
const GAP = 28
const CARD_UNIT = CARD_W + GAP
const AUTO_PLAY_MS = 4500

type ViewMode = 'carousel' | 'grid'

/* ─── Fallback for broken images ─── */
function imgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

/* ─── Single Card Component ─── */
function CultureCard({
  item,
  isSelected,
  onHoverStart,
  onHoverEnd,
  onClick,
  index,
  mode,
  isCenter,
  scrollProgress,
}: {
  item: CultureItem & { imageUrl: string }
  isSelected: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onClick?: () => void
  index: number
  mode: ViewMode
  isCenter?: boolean
  scrollProgress?: number
}) {
  // 3D tilt based on position from center
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useTransform(tiltY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-4, 4])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== 'carousel') return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      tiltX.set(x)
      tiltY.set(y)
    },
    [mode, tiltX, tiltY],
  )

  const handleMouseLeave = useCallback(() => {
    tiltX.set(0)
    tiltY.set(0)
  }, [tiltX, tiltY])

  return (
    <motion.div
      layout
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: 0.04 * index,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="overflow-hidden relative will-change-transform"
        style={{
          borderRadius: '24px',
          background: 'var(--clay-surface-card)',
          border: isCenter && mode === 'carousel'
            ? '1.5px solid rgba(255,255,255,0.2)'
            : '1px solid var(--clay-hairline)',
          height: mode === 'grid' ? '360px' : '340px',
          rotateX: mode === 'carousel' ? rotateX : 0,
          rotateY: mode === 'carousel' ? rotateY : 0,
        }}
        whileHover={{
          scale: mode === 'carousel' ? 1.05 : 1.02,
          y: mode === 'carousel' ? -8 : -4,
          boxShadow:
            mode === 'carousel'
              ? '0 28px 72px rgba(0,0,0,0.20), 0 10px 24px rgba(0,0,0,0.10)'
              : '0 16px 40px rgba(0,0,0,0.12)',
          transition: { type: 'spring', stiffness: 280, damping: 22 },
        }}
      >
        {/* ── Shine reflection overlay ── */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* ── Image ── */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={item.imageUrl}
            alt={item.titleAr}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.22 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            onError={imgError}
            draggable={false}
          />
          {!item.imageUrl && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'var(--clay-surface-card)' }}
            >
              <span className="text-5xl">{item.emoji}</span>
            </div>
          )}
        </div>

        {/* Gradient overlay layers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.8) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Decorative emoji badge */}
        <motion.span
          className="absolute top-3 right-3 text-2xl z-10"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={
            isSelected
              ? { opacity: 1, scale: 1.15, rotate: 0 }
              : { opacity: 0, scale: 0.5, rotate: -20 }
          }
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {item.emoji}
        </motion.span>

        {/* ── Title area ── */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <motion.p
            className="tifinagh-text text-xl font-bold text-white leading-tight"
            layout
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            {item.titleAm}
          </motion.p>
          <motion.p
            className="text-base text-white/85 leading-tight mt-1 font-medium"
            layout
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {item.titleAr}
          </motion.p>
        </div>

        {/* ── Hover detail overlay ── */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute inset-0 z-20 flex flex-col justify-end p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ backdropFilter: 'blur(4px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="relative z-10"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ delay: 0.08, duration: 0.35, ease: 'easeOut' }}
              >
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                  }}
                >
                  {item.emoji} ⵉⵎⵓⵛⵛⴰⵔ
                </div>
                <p
                  className="tifinagh-text text-sm leading-relaxed text-white/95"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                >
                  {item.descriptionAm}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom accent line ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ─── Main View ─── */
export default function CultureView() {
  const [scrollX, setScrollX] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')
  const [autoPlay, setAutoPlay] = useState(true)
  const [modalItem, setModalItem] = useState<(CultureItem & { imageUrl: string }) | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const userPausedRef = useRef(false)

  const items = itemsWithImages

  const maxScroll = useMemo(
    () => Math.max(0, (items.length - 1) * CARD_UNIT),
    [items.length],
  )

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  /* ── Keyboard navigation ── */
  useEffect(() => {
    if (viewMode !== 'carousel') return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scroll('prev')
      if (e.key === 'ArrowRight') scroll('next')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, maxScroll])

  /* ── Modal escape key ── */
  useEffect(() => {
    if (!modalItem) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalItem(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modalItem])

  /* ── Auto-play ── */
  useEffect(() => {
    if (!autoPlay || viewMode === 'grid') return
    const id = setInterval(() => {
      setScrollX((prev) => {
        const next = prev - CARD_UNIT
        if (Math.abs(next) >= maxScroll) return 0
        return next
      })
    }, AUTO_PLAY_MS)
    return () => clearInterval(id)
  }, [autoPlay, viewMode, maxScroll])

  const scroll = useCallback(
    (dir: 'prev' | 'next') => {
      setScrollX((prev) => {
        if (dir === 'prev') {
          const val = prev + CARD_UNIT
          return val > 0 ? 0 : val
        }
        const val = prev - CARD_UNIT
        return val < -maxScroll ? -maxScroll : val
      })
    },
    [maxScroll],
  )

  /* ── Drag handler — snap to nearest card ── */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      const threshold = CARD_UNIT * 0.15
      if (info.offset.x > threshold) scroll('prev')
      else if (info.offset.x < -threshold) scroll('next')
      // Snap to nearest card
      else {
        const nearestIdx = Math.round(Math.abs(scrollX) / CARD_UNIT)
        setScrollX(-nearestIdx * CARD_UNIT)
      }
      if (!userPausedRef.current) setAutoPlay(true)
    },
    [scroll, scrollX],
  )

  /* Calculate the "active" index from scroll position */
  const currentIndex = useMemo(() => {
    if (maxScroll === 0) return 0
    return Math.min(
      Math.round(Math.abs(scrollX) / CARD_UNIT),
      items.length - 1,
    )
  }, [scrollX, maxScroll, items.length])

  return (
    <div className="min-h-screen w-full pb-20 relative">
      {/* ── Animated decorative background (carousel only) ── */}
      {viewMode === 'carousel' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orb 1 */}
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, var(--clay-lavender), transparent)' }}
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Gradient orb 2 */}
          <motion.div
            className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, var(--clay-ochre), transparent)' }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 40, -20, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Floating Tifinagh decorations */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
            {floatingLetters.slice(0, 5).map((letter, i) => (
              <motion.span
                key={i}
                className="tifinagh-text absolute text-6xl font-bold select-none"
                style={{ left: letter.x, top: letter.y }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.03, 0.06, 0.03],
                }}
                transition={{
                  duration: 6 + i * 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: letter.delay,
                }}
              >
                {letter.char}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Hero Header ── */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full mb-4"
            style={{ background: 'var(--clay-surface-card)' }}
            whileHover={{ scale: 1.03 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--clay-ochre)' }} />
            <span className="clay-caption font-semibold" style={{ color: 'var(--clay-ochre)' }}>
              ⵉⵎⴰⵣⵉⵖⵏ · أمازيغ
            </span>
          </motion.div>

          <h1 className="clay-display-sm mb-2" style={{ color: 'var(--clay-ink)' }}>
            المعرض الثقافي الأمازيغي
          </h1>
          <p className="tifinagh-text text-2xl mb-3" style={{ color: 'var(--clay-muted)' }}>
            ⵜⴰⵙⴽⵯⴼⵍⵜ ⵏ ⵜⵓⵙⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ
          </p>
          <p className="clay-body-md" style={{ color: 'var(--clay-muted-soft)' }}>
            استكشف جمال وثراء التراث الأمازيغي من خلال معرض الصور التفاعلي
          </p>
        </motion.div>

        {/* ── Controls Bar ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2.5 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Hint */}
          <div
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl"
            style={{ background: 'var(--clay-surface-card)' }}
          >
            <Info className="w-3.5 h-3.5" style={{ color: 'var(--clay-muted)' }} />
            <span className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
              hover للوصف
            </span>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setViewMode('carousel')}
              className="flex items-center gap-1.5 px-3 py-2 transition-all duration-200"
              style={{
                borderRadius: '10px 0 0 10px',
                background:
                  viewMode === 'carousel' ? 'var(--clay-ink)' : 'var(--clay-surface-card)',
                color: viewMode === 'carousel' ? '#fff' : 'var(--clay-muted)',
              }}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="clay-caption">كاروسيل</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-1.5 px-3 py-2 transition-all duration-200"
              style={{
                borderRadius: '0 10px 10px 0',
                background:
                  viewMode === 'grid' ? 'var(--clay-ink)' : 'var(--clay-surface-card)',
                color: viewMode === 'grid' ? '#fff' : 'var(--clay-muted)',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="clay-caption">شبكة</span>
            </button>
          </div>

          {/* Auto-play toggle */}
          {viewMode === 'carousel' && (
            <button
              onClick={() => {
                userPausedRef.current = !autoPlay
                setAutoPlay((p) => !p)
              }}
              className="flex items-center gap-1.5 px-3 py-2 transition-all duration-200 rounded-xl"
              style={{
                background: autoPlay ? 'var(--clay-surface-card)' : 'var(--clay-surface-soft)',
                color: autoPlay ? 'var(--clay-ink)' : 'var(--clay-muted-soft)',
              }}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="clay-caption">{autoPlay ? 'إيقاف' : 'تشغيل'}</span>
            </button>
          )}

          {/* Keyboard hint */}
          {viewMode === 'carousel' && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: 'var(--clay-surface-soft)' }}
            >
              <Keyboard className="w-3.5 h-3.5" style={{ color: 'var(--clay-muted-soft)' }} />
              <span className="clay-caption" style={{ color: 'var(--clay-muted-soft)' }}>
                ← →
              </span>
            </div>
          )}
        </motion.div>

        {/* ─── CAROUSEL MODE ─── */}
        {viewMode === 'carousel' && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Glassmorphism arrows */}
            {scrollX < 0 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => scroll('prev')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  color: 'var(--clay-ink)',
                }}
                whileHover={{
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  background: 'rgba(255,255,255,0.85)',
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}

            {scrollX > -maxScroll && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => scroll('next')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  color: 'var(--clay-ink)',
                }}
                whileHover={{
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  background: 'rgba(255,255,255,0.85)',
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}

            {/* ── Track with drag support ── */}
            <div
              ref={containerRef}
              className="overflow-hidden px-4"
              onMouseEnter={() => {
                if (!userPausedRef.current) setAutoPlay(false)
              }}
              onMouseLeave={() => {
                if (!userPausedRef.current) setAutoPlay(true)
              }}
            >
              <motion.div
                ref={trackRef}
                className="flex cursor-grab active:cursor-grabbing"
                style={{ gap: `${GAP}px` }}
                animate={{ x: scrollX }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 30,
                  mass: 0.8,
                }}
                drag="x"
                dragConstraints={{
                  left: -maxScroll - 20,
                  right: 20,
                }}
                dragElastic={0.08}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
                onDragStart={() => setAutoPlay(false)}
              >
                {items.map((item, idx) => {
                  const isCenter = idx === currentIndex

                  return (
                    <div
                      key={item.id}
                      className="shrink-0 select-none"
                      style={{ width: `${CARD_W}px` }}
                    >
                      <CultureCard
                        item={item}
                        index={idx}
                        mode="carousel"
                        isCenter={isCenter}
                        isSelected={selectedId === item.id}
                        onHoverStart={() => {
                          setSelectedId(item.id)
                          setAutoPlay(false)
                        }}
                        onHoverEnd={() => {
                          setSelectedId(null)
                          if (!userPausedRef.current) setAutoPlay(true)
                        }}
                        onClick={() => setModalItem(item)}
                      />
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* ── Progress + Counter ── */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div
                className="relative h-1.5 rounded-full overflow-hidden flex-1 max-w-sm"
                style={{ background: 'var(--clay-hairline)' }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: 'var(--clay-ink)' }}
                  animate={{
                    width: `${((currentIndex + 1) / items.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="clay-caption tabular-nums" style={{ color: 'var(--clay-muted)' }}>
                {String(currentIndex + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
              </span>
            </div>

            {/* ── Dot indicators ── */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {items.map((item, idx) => {
                const isActive = idx === currentIndex
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setScrollX(-idx * CARD_UNIT)
                    }}
                    className="rounded-full"
                    style={{
                      height: '8px',
                      background: isActive ? 'var(--clay-ink)' : 'var(--clay-hairline)',
                    }}
                    animate={{
                      width: isActive ? '32px' : '8px',
                      opacity: Math.abs(idx - currentIndex) > 6 ? 0.3 : 1,
                    }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.5 }}
                  />
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ─── GRID MODE ─── */}
        {viewMode === 'grid' && (
          <motion.div
            className="grid gap-5 px-2"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item, idx) => (
              <CultureCard
                key={item.id}
                item={item}
                index={idx}
                mode="grid"
                isSelected={selectedId === item.id}
                onHoverStart={() => setSelectedId(item.id)}
                onHoverEnd={() => setSelectedId(null)}
                onClick={() => setModalItem(item)}
              />
            ))}
          </motion.div>
        )}

        {/* ── Footer ── */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background: 'var(--clay-surface-card)' }}
          >
            <span className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
              ⵜⴰⵔⵎⵉⵜ ⵏ ⵜⵓⵙⵙⵏⴰ · تراث وهوية
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalItem(null)}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 w-full max-w-4xl overflow-hidden"
              style={{
                borderRadius: '24px',
                background: 'var(--clay-surface-card)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
              }}
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative" style={{ minHeight: '320px' }}>
                  <img
                    src={modalItem.imageUrl}
                    alt={modalItem.titleAr}
                    className="w-full h-full object-cover"
                    onError={imgError}
                    draggable={false}
                  />
                  {!modalItem.imageUrl && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'var(--clay-surface-card)' }}
                    >
                      <span className="text-6xl">{modalItem.emoji}</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
                  <button
                    onClick={() => setModalItem(null)}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:scale-110 active:scale-95"
                    style={{
                      background: 'var(--clay-surface-soft)',
                      color: 'var(--clay-muted)',
                    }}
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                  <div className="mb-1">
                    <span className="text-3xl">{modalItem.emoji}</span>
                  </div>
                  <h2
                    className="tifinagh-text text-2xl font-bold mb-1"
                    style={{ color: 'var(--clay-ink)' }}
                  >
                    {modalItem.titleAm}
                  </h2>
                  <h3
                    className="text-lg font-medium mb-4"
                    style={{ color: 'var(--clay-muted)' }}
                  >
                    {modalItem.titleAr}
                  </h3>
                  <p
                    className="tifinagh-text text-sm leading-relaxed"
                    style={{ color: 'var(--clay-ink)' }}
                  >
                    {modalItem.descriptionAm}
                  </p>
                  <div
                    className="mt-5 inline-flex self-start items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'var(--clay-surface-soft)' }}
                  >
                    <span className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                      ⵉⵎⵓⵛⵛⴰⵔ · وصف
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}