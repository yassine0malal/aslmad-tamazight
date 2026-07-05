import { Outlet } from 'react-router'
import Footer from '@/components/Footer'

export default function BareLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full" style={{ background: 'var(--clay-canvas)' }}>
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
