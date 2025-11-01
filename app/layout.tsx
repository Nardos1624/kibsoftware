// app/layout.tsx

import './globals.css'; // Assuming you have a global CSS file
import { Inter } from 'next/font/google'; // 👈 1. IMPORT Inter

// 👈 2. DECLARE inter variable
const inter = Inter({ subsets: ['latin'] });

// Assuming this is your RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 👈 3. USE inter.className on the body tag */}
      <body className={inter.className}>
        <main>
            {children}
        </main>
      </body>
    </html>
  );
}