"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function StoryForm({ onAdd }) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }), 
      })

      if (res.ok) {
        const story = await res.json()
        onAdd(story)
        setTitle("")
      } else {
        const { error } = await res.json()
        alert(error || "Ошибка при создании истории")
      }
    } catch (err) {
      console.error(err)
      alert("Ошибка сети")
    } finally {
      setLoading(false)
    }
  }

  // 🔒 Если пользователь не вошёл, не показываем форму
  if (!session) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Войдите, чтобы создать историю
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Новая история..."
        className="flex-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Создаём..." : "Добавить"}
      </button>
    </form>
  )
}
