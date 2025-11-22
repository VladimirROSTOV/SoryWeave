"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function StoryForm({ onAdd }) {
  const [title, setTitle] = useState("")
  const [prompt, setPrompt] = useState("") 
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  async function generatePrompt() {
    try {
      const res = await fetch("/api/storyPrompt")
      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Ошибка генерации темы")
        return
      }

      setPrompt(data.prompt)
    } catch (err) {
      console.error(err)
      alert("Ошибка сети")
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt }), 
      })

      if (res.ok) {
        const story = await res.json()
        onAdd(story)
        setTitle("")
        setPrompt("")
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


  if (!session) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Войдите, чтобы создать историю
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая история..."
          className="flex-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={generatePrompt}
          className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          Тема
        </button>
      </div>

      {prompt && (
        <p className="text-sm italic text-gray-600 dark:text-gray-400 border-l-4 border-purple-500 pl-2">
          {prompt}
        </p>
      )}

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
