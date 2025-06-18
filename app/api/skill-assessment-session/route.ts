import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use Redis, database, or proper session management
const questionSessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questions, answers } = await request.json()

    if (questions) {
      // Store questions for this session
      questionSessions.set(sessionId, questions)
      return NextResponse.json({ success: true })
    }

    if (answers && sessionId) {
      // Retrieve questions and score
      const storedQuestions = questionSessions.get(sessionId)
      if (!storedQuestions) {
        return NextResponse.json({ error: "Session expired" }, { status: 400 })
      }

      let correct = 0
      answers.forEach((answer: number, index: number) => {
        if (storedQuestions[index] && storedQuestions[index].correct === answer) {
          correct++
        }
      })

      const percentage = storedQuestions.length > 0 ? (correct / storedQuestions.length) * 100 : 0

      // Clean up session
      questionSessions.delete(sessionId)

      return NextResponse.json({
        correct,
        total: storedQuestions.length,
        percentage: Math.round(percentage),
      })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "Failed to process session" }, { status: 500 })
  }
}
