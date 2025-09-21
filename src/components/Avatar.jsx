"use client"
import Image from "next/image"
import md5 from "blueimp-md5"

export default function Avatar({ email, name, size = 40 }) {
  if (!email) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-gray-400 text-white"
        style={{ width: size, height: size }}
      >
        {name ? name[0].toUpperCase() : "?"}
      </div>
    )
  }

  const hash = md5(email.trim().toLowerCase())
  const url = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`

  return (
    <Image
      src={url}
      alt={name || "user"}
      width={size}
      height={size}
      className="rounded-full"
    />
  )
}
