import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Home, SearchX } from 'lucide-react'
import { routes } from '@/lib/routes'

export default function NotFoundView() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--clay-canvas)' }}
    >
      {/* Decorative background blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--clay-lavender), transparent)' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--clay-ochre), transparent)' }}
        animate={{ x: [0, -30, 20, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 text-center px-6 max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Large 404 graphic */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={visible ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-4"
            style={{ background: 'var(--clay-surface-card)' }}
          >
            <SearchX className="w-14 h-14" style={{ color: 'var(--clay-muted-soft)' }} />
          </div>
        </motion.div>

        <motion.h1
          className="text-7xl font-bold mb-2"
          style={{ color: 'var(--clay-ink)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          404
        </motion.h1>

        <motion.p
          className="tifinagh-text text-2xl mb-2"
          style={{ color: 'var(--clay-muted)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          &#x2D63;&#x2D4E;&#x2D54;&#x2D63; &#x2D4E;&#x2D4D;&#x2D4C;&#x2D59;
        </motion.p>

        <motion.p
          className="text-xl font-medium mb-1"
          style={{ color: 'var(--clay-ink)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          الصفحة غير موجودة
        </motion.p>

        <motion.p
          className="clay-body-md mb-8"
          style={{ color: 'var(--clay-muted-soft)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          عذراً، الصفحة التي تبحث عنها غير متوفرة. قد يكون الرابط غير صحيح أو تم نقل الصفحة.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <button
            onClick={() => navigate(routes.landing)}
            className="inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
            style={{
              background: 'var(--clay-ink)',
              color: '#fff',
              fontWeight: 500,
            }}
          >
            <Home className="w-4 h-4" />
            العودة إلى الرئيسية
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
            style={{
              background: 'var(--clay-surface-card)',
              color: 'var(--clay-ink)',
              fontWeight: 500,
              border: '1px solid var(--clay-hairline)',
            }}
          >
            <ArrowRight className="w-4 h-4" />
            الرجوع للصفحة السابقة
          </button>
        </motion.div>

        {/* Footer decorative Tifinagh */}
        <motion.div
          className="mt-12 opacity-[0.08]"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 0.08 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="tifinagh-text text-6xl select-none">
            &#x2D30; &#x2D4D; &#x2D4E; &#x2D63; &#x2D4C; &#x2D30; &#x2D54;
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
