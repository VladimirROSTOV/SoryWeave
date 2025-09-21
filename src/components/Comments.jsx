"use client"

import { useState } from "react"

export default function Comments({ branchId, comments, session, onComment }) {
  const [localComments, setLocalComments] = useState(comments)

  async function handleSubmit(e) {
    e.preventDefault()
    const text = e.target.comment.value.trim()
    if (!text) return

    await onComment(branchId, text)

    setLocalComments(prev => [...prev, { text, author: session.user }])
    e.target.reset()
  }

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-semibold">Комментарии:</h4>
      {localComments.length > 0 ? (
        localComments.map((c, i) => (
          <div
            key={i}
            className="text-sm p-2 rounded bg-white dark:bg-gray-600"
          >
            <span className="font-medium">
              {c.author?.name || "Аноним"}:
            </span>{" "}
            {c.text}
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500">Комментариев нет</p>
      )}

      {session && (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <input
            type="text"
            name="comment"
            placeholder="Ваш комментарий..."
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            ➤
          </button>
        </form>
      )}
    </div>
  )
}
