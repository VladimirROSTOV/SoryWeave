import { NextResponse } from "next/server"
import { STORY_TOPICS } from "./storyTopics"

export async function GET() {
  try {
    const randomTopic =
      STORY_TOPICS[Math.floor(Math.random() * STORY_TOPICS.length)]

    return NextResponse.json({ prompt: randomTopic })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to get topic" },
      { status: 500 }
    )
  }
}
