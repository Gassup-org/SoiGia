import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
