import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { LayoutGrid, ChevronsDown } from 'lucide-react'
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

type ViewMode = 'scroll' | 'grid'

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
}: {
  item: CultureItem & { imageUrl: string }
  isSelected: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onClick?: () => void
  index: number
}) {
  return (
    <motion.div
      layout
      className="group cursor-pointer m-5"
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
    >
      <motion.div
        className="overflow-hidden relative will-change-transform"
        style={{
          borderRadius: '24px',
          background: 'var(--clay-surface-card)',
          border: '1px solid var(--clay-hairline)',
          height: '360px',
        }}
        whileHover={{
          scale: 1.02,
          y: -4,
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
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

/* ─── Scroll Gallery Card ───
 * One card per screen: it slides in from the right as you scroll it into view,
 * so scrolling down brings the next card in from the right edge.
 */
function ScrollCard({
  item,
  index,
  total,
  onOpen,
}: {
  item: CultureItem & { imageUrl: string }
  index: number
  total: number
  onOpen: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['48%', '0%'])
  const opacity = useTransform(scrollYProgress, [0, 0.45, 1], [0, 0.7, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [3.5, 0])

  return (
    <div
      ref={ref}
      className="flex min-h-[100dvh] items-center justify-center px-2 py-6"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        className="group relative block w-full max-w-5xl overflow-hidden text-right"
        style={{
          x,
          opacity,
          scale,
          rotate,
          borderRadius: '32px',
          height: 'clamp(340px, 74vh, 760px)',
          background: 'var(--clay-surface-card)',
          border: '1px solid var(--clay-hairline)',
          boxShadow: '0 28px 70px rgba(61, 44, 20, 0.18)',
        }}
        whileHover={{ boxShadow: '0 34px 90px rgba(61, 44, 20, 0.24)' }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.titleAr}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={imgError}
            draggable={false}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'var(--clay-surface-soft)' }}
          >
            <span className="text-8xl">{item.emoji}</span>
          </div>
        )}

        {/* Readability gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 28%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* Index + counter */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white tabular-nums"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' }}>
            {item.emoji}
          </span>
        </div>

        {/* Caption block */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <p
            className="tifinagh-text text-3xl font-bold leading-tight text-white sm:text-5xl"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
          >
            {item.titleAm}
          </p>
          <p
            className="mt-2 text-lg font-semibold text-white/90 sm:text-2xl"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
          >
            {item.titleAr}
          </p>
          <p className="tifinagh-text mt-3 line-clamp-2 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            {item.descriptionAm}
          </p>
        </div>
      </motion.button>
    </div>
  )
}

/* ─── Main View ─── */
export default function CultureView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('scroll')
  const [modalItem, setModalItem] = useState<(CultureItem & { imageUrl: string }) | null>(null)

  const items = itemsWithImages

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  /* ── Modal keys: Esc closes, arrows step through the images ── */
  useEffect(() => {
    if (!modalItem) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalItem(null)
        return
      }

      const step =
        e.key === 'ArrowRight' || e.key === 'ArrowDown'
          ? 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
            ? -1
            : 0
      if (step === 0) return

      e.preventDefault()
      setModalItem((current) => {
        if (!current) return current
        const index = items.findIndex((item) => item.id === current.id)
        if (index === -1) return current
        return items[(index + step + items.length) % items.length]
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modalItem, items])

  return (
    <div className="min-h-screen w-full pb-20 relative">
      {/* ── Animated decorative background (scroll mode only) ── */}
      {viewMode !== 'grid' && (
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
          {/* <div
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl"
            style={{ background: 'var(--clay-surface-card)' }}
          >
            <Info className="w-3.5 h-3.5" style={{ color: 'var(--clay-muted)' }} />
            <span className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
              hover للوصف
            </span>
          </div>           */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setViewMode('scroll')}
              className="flex items-center gap-1.5 px-3 py-2 transition-all duration-200"
              style={{
                borderRadius: '10px 0 0 10px',
                background: viewMode === 'scroll' ? 'var(--clay-ink)' : 'var(--clay-surface-card)',
                color: viewMode === 'scroll' ? '#fff' : 'var(--clay-muted)',
              }}
            >
              <ChevronsDown className="w-3.5 h-3.5" />
              <span className="clay-caption">تمرير</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-1.5 px-3 py-2 transition-all duration-200"
              style={{
                borderRadius: '0 10px 10px 0',
                background: viewMode === 'grid' ? 'var(--clay-ink)' : 'var(--clay-surface-card)',
                color: viewMode === 'grid' ? '#fff' : 'var(--clay-muted)',
              }}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="clay-caption">شبكة</span>
            </button>
          </div>
        </motion.div>

        {/* ─── SCROLL MODE — one card per screen, entering from the right ─── */}
        {viewMode === 'scroll' && (
          <div className="relative -mx-2 overflow-x-clip">
            {items.map((item, idx) => (
              <ScrollCard
                key={item.id}
                item={item}
                index={idx}
                total={items.length}
                onOpen={() => setModalItem(item)}
              />
            ))}
            <div className="-mt-16 flex justify-center pb-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'var(--clay-surface-card)' }}
              >
                <ChevronsDown className="w-4 h-4" style={{ color: 'var(--clay-muted)' }} />
                <span className="clay-caption" style={{ color: 'var(--clay-muted)' }}>
                  مرر للأسفل لبقية المعرض
                </span>
              </div>
            </div>
          </div>
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