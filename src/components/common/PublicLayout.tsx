import { Outlet } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
