import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/branches/[id]/comments
export async function GET(req, { params }) {
  try {
    const { id } = await params
    const branchId = Number.parseInt(id, 10)

    if (Number.isNaN(branchId)) {
      return NextResponse.json({ error: "Invalid branch ID" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { branchId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(comments)
  } catch (err) {
    console.error("GET comments error:", err)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// POST /api/branches/[id]/comments
export async function POST(req, { params }) {
  try {
    const { id } = await params
    const branchId = Number.parseInt(id, 10)
    const { content, userId } = await req.json() 

    if (!content || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,  
        branchId,  
        authorId: userId, 
      },
      include: { 
        author: { 
          select: { id: true, name: true } 
        } 
      },
    })

    return NextResponse.json(comment)
  } catch (err) {
    console.error("POST comment error:", err)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}