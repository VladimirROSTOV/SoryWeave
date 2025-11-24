import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req, context) {
  try {
    const { id } = await context.params 
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }


    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_branchId: {
          userId: Number(userId),
          branchId: Number(id), 
        },
      },
    })

    if (existingVote) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 })
    }

    const vote = await prisma.vote.create({
      data: {
        userId: Number(userId),
        branchId: Number(id), 
      },
    })

    return NextResponse.json(vote)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}
