app/layout.tsx << 'EOF'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GN Tracker',
  description: 'GN Tracker Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

cat > app/page.tsx << 'EOF'
export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">GN Tracker</h1>
      <p>Welcome to GN Tracker</p>
    </div>
  )
}
EOF
