import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Dive Spots — World Dive Site Database',
  description: 'Professional scuba diving guides for divers and divemasters worldwide.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>)
}
