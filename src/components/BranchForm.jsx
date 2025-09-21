"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function BranchForm({ storyId, onAdd }) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)

    try {
      // POST к роуту
      const res = await fetch(`/api/stories/${storyId}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          authorId: session?.user?.id
        }),
      })

      const branch = await res.json()
      if (!res.ok) {
        alert(branch.error || "Ошибка при создании ветки")
      } else {
        onAdd(branch)
        setText("")
      }
    } catch (err) {
      console.error(err)
      alert("Ошибка сети")
    } finally {
      setLoading(false)
    }
  }


  if (!session) return null

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Продолжить историю — напиши ветку..."
        className="flex-1 px-3 py-2 border rounded text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-60"
      >
        {loading ? "..." : "Добавить"}
      </button>
    </form>
  )
}
