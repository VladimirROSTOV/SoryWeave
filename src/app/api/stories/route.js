import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

// GET /api/stories — список историй
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        author: { select: { id: true, name: true } },
        branches: {
          include: {
            votes: true,
            comments: true,
            author: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(stories)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    )
  }
}

// POST /api/stories — создать историю
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title } = await req.json()
    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 })
    }

    const story = await prisma.story.create({
      data: {
        title,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(story)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    )
  }
}
