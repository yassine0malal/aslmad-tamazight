import { Heart } from 'lucide-react'
import footerBg from '@/assets/images/footer/index.png'

export default function Footer() {
  return (
    <footer className="w-full mt-auto relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={footerBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,250,240,0.92) 0%, rgba(255,250,240,0.88) 50%, rgba(255,250,240,0.95) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">

          {/* ── Divider ── */}
          <div
            className="h-px w-full mb-6"
            style={{ background: 'var(--clay-hairline)' }}
          />

          {/* ── Bottom Row ── */}
          <div className="flex flex-col items-center gap-4 text-center">
            <p
              className="text-sm"
              style={{ color: 'var(--clay-muted)' }}
            >
              <Heart
                className="w-4 h-4 inline-block mx-1"
                style={{ color: 'var(--clay-coral)' }}
              />
              {' '}Built with passion for Amazigh children everywhere.
            </p>
            <p
              className="text-xs md:text-sm leading-relaxed"
              style={{ color: 'var(--clay-muted-soft)' }}
            >
              &copy; {new Date().getFullYear()} أسلماد — لأن كل كلمة أمازيغية يتعلمها طفل
              {' '}هي خطوة نحو الحفاظ على هويتنا.{' '}
              <span className="tifinagh-text">&#x2D63;</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
