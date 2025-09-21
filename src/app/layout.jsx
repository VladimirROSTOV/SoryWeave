import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
import LayoutClient from "@/components/LayoutClient"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LayoutClient />
          <main className="container mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
