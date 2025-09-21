"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import BranchCard from "./BranchCard"
import BranchForm from "./BranchForm"
import Avatar from "./Avatar"
import { motion } from "framer-motion"
import { GitBranch, MessageSquare, ThumbsUp } from "lucide-react"

export default function StoryCard({ story }) {
  const [branches, setBranches] = useState(story.branches || [])
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // голосование
  async function handleVote(branchId) {
    try {
      const res = await fetch(`/api/branches/${branchId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Ошибка при голосовании")
        return
      }
      setBranches(prev =>
        prev.map(b =>
          b.id === branchId ? { ...b, votes: [...(b.votes || []), data] } : b
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  // комментирование
  async function handleComment(branchId, content) {
    try {
      const res = await fetch(`/api/branches/${branchId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: currentUserId }),
      })

      const newComment = await res.json()
      if (!res.ok) {
        alert(newComment.error || "Ошибка при комментарии")
        return
      }

      setBranches(prev =>
        prev.map(b =>
          b.id === branchId
            ? { ...b, comments: [...(b.comments || []), newComment] }
            : b
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  // добавление ветки
  function handleBranchAdd(newBranchFromApi) {
    setBranches(prev => [...prev, newBranchFromApi])
  }

  return (
    <motion.article
      className="p-5 border rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      
    >
      {/* Заголовок */}
      <h2 className="text-xl font-bold mb-2">{story.title}</h2>

      {/* Автор */}
      <div className="flex items-center gap-2 mb-4">
        <Avatar email={story.author?.email} name={story.author?.name} size={36} />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {story.author?.name || "Аноним"}
        </span>
      </div>

      {/* Статистика */}
      <div className="flex gap-4 text-sm text-gray-500 mb-5">
        <div className="flex items-center gap-1">
          <GitBranch className="w-4 h-4" />
          {branches.length}
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          {branches.reduce((sum, b) => sum + (b.votes?.length || 0), 0)}
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          {branches.reduce((sum, b) => sum + (b.comments?.length || 0), 0)}
        </div>
      </div>

      {/* Ветки */}
      <div className="space-y-3">
        {branches.length > 0 ? (
          branches.map(branch => (
            <BranchCard
              key={branch.id}
              branch={branch}
              session={session}
              onVote={handleVote}
              onComment={handleComment}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400">Пока нет веток — стань первым!</p>
        )}
      </div>

      {/* Добавление ветки */}
      {session ? (
        <div className="mt-4">
          <BranchForm storyId={story.id} onAdd={handleBranchAdd} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Войдите, чтобы добавить ветку
        </p>
      )}
    </motion.article>
  )
}
