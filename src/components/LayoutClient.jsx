"use client"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import ProfileModal from "@/components/ProfileModal"

export default function LayoutClient() {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            📖 StoryWeave
          </Link>

          <Link
            href="/about"
            className="text-sm px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            О проекте
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                {session.user?.name || "Профиль"}
              </button>

              <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
              />

              <button
                onClick={() => signOut()}
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
              >
                Регистрация
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
