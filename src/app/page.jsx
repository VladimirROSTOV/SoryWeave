"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import StoryCard from "@/components/StoryCard"
import StoryForm from "@/components/StoryForm"

export default function HomePage() {
  const [stories, setStories] = useState([])
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories")
      const data = await res.json()
      setStories(data)
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    }
  }

  // Обработчик голосования
  const handleVote = async (branchId) => {
    try {
      const res = await fetch(`/api/branches/${branchId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })

      if (res.ok) {
        // Обновляем данные после голосования
        fetchStories()
      } else {
        const error = await res.json()
        alert(error.error || "Ошибка при голосовании")
      }
    } catch (err) {
      console.error("Vote error:", err)
      alert("Ошибка при голосовании")
    }
  }

  // Обработчик комментариев
  const handleComment = async (branchId, text) => {
    try {
      const res = await fetch(`/api/branches/${branchId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text, 
          userId: currentUserId 
        }),
      })

      if (res.ok) {

        fetchStories()
      } else {
        const error = await res.json()
        alert(error.error || "Ошибка при добавлении комментария")
      }
    } catch (err) {
      console.error("Comment error:", err)
      alert("Ошибка при добавлении комментария")
    }
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📖 Истории</h1>

      {session ? (
        <StoryForm onAdd={(s) => setStories([s, ...stories])} />
      ) : (
        <p className="text-gray-500">Войдите, чтобы создать историю</p>
      )}

      <div className="mt-6 space-y-6">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            session={session}
            onVote={handleVote}
            onComment={handleComment}
          />
        ))}
      </div>
    </main>
  )
}