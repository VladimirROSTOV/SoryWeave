import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req, context) {
  try {
    // ✅ ждём context.params
    const { id } = await context.params

    const { content, authorId } = await req.json()

    if (!content || !authorId) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const branch = await prisma.branch.create({
      data: {
        content,
        storyId: Number(id), // ✅ приводим к Int
        authorId,
      },
    })

    return NextResponse.json(branch)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    )
  }
}
