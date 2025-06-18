import { type NextRequest, NextResponse } from "next/server"

const SKILL_QUESTIONS = {
  JavaScript: [
    {
      question: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
      options: [
        "No difference, they're interchangeable",
        "let and const are block-scoped, var is function-scoped",
        "var is the newest syntax",
        "const can be reassigned",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What does 'this' refer to in JavaScript?",
      options: [
        "Always the global object",
        "The current function",
        "Depends on how the function is called",
        "The parent object",
      ],
      correct: 2,
      difficulty: "intermediate",
    },
  ],
  React: [
    {
      question: "What is the purpose of useEffect hook?",
      options: [
        "To manage component state",
        "To handle side effects in functional components",
        "To create new components",
        "To style components",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the virtual DOM?",
      options: ["A copy of the real DOM kept in memory", "A new browser API", "A React component", "A CSS framework"],
      correct: 0,
      difficulty: "beginner",
    },
  ],
  Python: [
    {
      question: "What is a list comprehension in Python?",
      options: [
        "A way to create lists using a concise syntax",
        "A method to sort lists",
        "A type of loop",
        "A debugging tool",
      ],
      correct: 0,
      difficulty: "intermediate",
    },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { skill, answers } = await request.json()

    if (!skill) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 })
    }

    if (answers) {
      // Score the assessment
      const result = scoreAssessment(skill, answers)
      return NextResponse.json(result)
    } else {
      // Return questions for the skill
      const questions = SKILL_QUESTIONS[skill] || []
      return NextResponse.json({ questions })
    }
  } catch (error) {
    console.error("Skill assessment error:", error)
    return NextResponse.json({ error: "Failed to process skill assessment" }, { status: 500 })
  }
}

function scoreAssessment(skill: string, answers: number[]) {
  const questions = SKILL_QUESTIONS[skill] || []
  let correct = 0

  answers.forEach((answer, index) => {
    if (questions[index] && questions[index].correct === answer) {
      correct++
    }
  })

  const percentage = questions.length > 0 ? (correct / questions.length) * 100 : 0

  let level = "Beginner"
  if (percentage >= 80) level = "Advanced"
  else if (percentage >= 60) level = "Intermediate"

  return {
    skill,
    score: Math.round(percentage),
    level,
    correct,
    total: questions.length,
    recommendations: generateSkillRecommendations(skill, percentage),
  }
}

function generateSkillRecommendations(skill: string, score: number): string[] {
  const recommendations = []

  if (score < 60) {
    recommendations.push(`Focus on ${skill} fundamentals`)
    recommendations.push("Take online courses or tutorials")
    recommendations.push("Practice with coding exercises")
  } else if (score < 80) {
    recommendations.push(`Deepen your ${skill} knowledge`)
    recommendations.push("Work on real-world projects")
    recommendations.push("Explore advanced concepts")
  } else {
    recommendations.push(`Maintain your ${skill} expertise`)
    recommendations.push("Stay updated with latest features")
    recommendations.push("Consider mentoring others")
  }

  return recommendations
}
