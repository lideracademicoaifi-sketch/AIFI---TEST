import './globals.css'

export const metadata = {
  title: 'AIFI CONNECT',
  description: 'Language Learning & Testing Platform'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
