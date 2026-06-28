import { Outlet } from 'react-router'

export default function BareLayout() {
  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--clay-canvas)' }}>
      <Outlet />
    </div>
  )
}
