# layout.tsx
cat > app/layout.tsx << 'EOF'
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

# page.tsx
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">GN Tracker</h1>
      <p>Welcome to GN Tracker</p>
    </main>
  )
}
EOF

# globals.css
cat > app/globals.css << 'EOF'
@import "tailwindcss";
EOF
