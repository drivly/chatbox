import type { Metadata } from 'next'
import { Inter as FontSans, IBM_Plex_Sans, Montserrat } from 'next/font/google'
import { cn } from '../lib/utils'
import './chatbox.css'
import ChatBox from '../components/widget'


const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
})

const IBM = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-IBM_Plex_Sans',
  preload: true,
})

const mont = Montserrat({
  subsets: ['latin'],
  variable: '--font-Montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Drivly Chatbox',
  description: 'Powered by Drivly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'w-full font-sans',
          fontSans.variable,
          IBM.variable,
          mont.variable
        )}>
        <main>
          {children}
          <ChatBox />
        </main>
      </body>
    </html>
  )
}
