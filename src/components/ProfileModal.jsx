"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function ProfileModal({ isOpen, onClose }) {
  const { update } = useSession()
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setName(data?.name || "")
          setBio(data?.bio || "")
        })
    }
  }, [isOpen])

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        await update({ user: updatedUser }) 
        onClose()
      } else {
        alert("Ошибка при сохранении профиля")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Редактировать профиль</h2>

        <label className="block mb-2">
          Имя
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-50 dark:bg-gray-800"
          />
        </label>

        <label className="block mb-4">
          О себе
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-50 dark:bg-gray-800"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Сохраняю..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  )
}
