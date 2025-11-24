"use client"
import Image from "next/image"
import md5 from "blueimp-md5"
import PropTypes from 'prop-types'

export default function Avatar({ email, name, size = 40 }) {
 
  const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  
  if (!safeEmail) {
   
    const initial = name && typeof name === 'string' && name.length > 0 
      ? name[0].toUpperCase() 
      : "?"
    
    return (
      <div
        className="flex items-center justify-center rounded-full bg-gray-400 text-white"
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    )
  }
  
  const hash = md5(safeEmail)
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

Avatar.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number
}