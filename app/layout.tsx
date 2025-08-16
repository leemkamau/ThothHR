// app/layout.tsx

import './styles/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Thoth HR',
  description: 'Smart Payroll and HR System for SMEs',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
