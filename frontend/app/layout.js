import './globals.css'

export const metadata = {
  title: 'TaxZen - Smart Tax Analysis',
  description: 'Upload your tax documents and get AI-powered insights to optimize your tax situation.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
