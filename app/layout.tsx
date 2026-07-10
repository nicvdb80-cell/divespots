import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Dive Spots — World Dive Site Database',
  description: 'Professional dive site guides for divers and divemasters. Verified information, divemaster diagrams, marine life data, and diver experiences — country by country.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
