import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

// GET — получить профиль
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, bio: true, email: true },
  })

  return NextResponse.json(user)
}

// POST — обновить профиль
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { name, bio } = await req.json()

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio },
    select: { id: true, name: true, bio: true, email: true },
  })

  return NextResponse.json(updatedUser)
}
