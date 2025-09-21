"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (res.ok) router.push("/login")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <input className="w-full border p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
      <input className="w-full border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
        Зарегистрироваться
      </button>
    </form>
  )
}
