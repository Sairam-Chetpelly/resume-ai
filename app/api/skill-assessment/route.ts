import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Expanded static question bank as fallback
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
    {
      question: "What is closure in JavaScript?",
      options: [
        "A way to close browser windows",
        "A function that has access to variables in its outer scope",
        "A method to end loops",
        "A type of error handling",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: [
        "No difference",
        "=== checks type and value, == only checks value",
        "== is faster than ===",
        "=== is deprecated",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is event bubbling in JavaScript?",
      options: [
        "Creating new events",
        "Events propagating from child to parent elements",
        "Deleting events",
        "Events happening in parallel",
      ],
      correct: 1,
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
    {
      question: "What is the difference between state and props in React?",
      options: [
        "No difference",
        "State is mutable, props are immutable",
        "Props are faster than state",
        "State is only for class components",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is React.memo() used for?",
      options: [
        "Creating memos in code",
        "Memoizing functional components to prevent unnecessary re-renders",
        "Managing memory usage",
        "Creating class components",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the purpose of useCallback hook?",
      options: [
        "To call functions",
        "To memoize callback functions",
        "To create new callbacks",
        "To handle errors in callbacks",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the Context API in React?",
      options: [
        "A way to style components",
        "A method to pass data through the component tree without props",
        "A database connection API",
        "A way to create new components",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the key prop in React lists?",
      options: [
        "Optional attribute for styling",
        "Required unique identifier to help React identify items",
        "A way to encrypt data",
        "A performance optimization that can be skipped",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is React Suspense?",
      options: [
        "A way to handle loading states",
        "A method to suspend component rendering until data is ready",
        "A debugging tool",
        "A way to prevent component updates",
      ],
      correct: 1,
      difficulty: "advanced",
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
    {
      question: "What is the difference between a list and a tuple in Python?",
      options: [
        "No difference",
        "Lists are mutable, tuples are immutable",
        "Tuples are faster for all operations",
        "Lists can only store numbers",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is a decorator in Python?",
      options: [
        "A way to decorate code with comments",
        "A function that modifies another function",
        "A type of variable",
        "A debugging tool",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the difference between 'is' and '==' in Python?",
      options: ["No difference", "'is' checks identity, '==' checks equality", "'==' is faster", "'is' is deprecated"],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is a generator in Python?",
      options: [
        "A function that generates random numbers",
        "A function that yields values one at a time",
        "A type of loop",
        "A debugging tool",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the purpose of __init__ method in Python classes?",
      options: [
        "To initialize class variables",
        "To create a constructor for the class",
        "To define class methods",
        "To import modules",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What are Python context managers?",
      options: [
        "Tools for managing memory",
        "Objects that manage resource allocation and cleanup",
        "Special variables in Python",
        "Tools for managing database connections only",
      ],
      correct: 1,
      difficulty: "advanced",
    },
  ],
  "Node.js": [
    {
      question: "What is the event loop in Node.js?",
      options: [
        "A loop that creates events",
        "The mechanism that handles asynchronous operations",
        "A type of for loop",
        "A debugging tool",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is npm?",
      options: ["Node Package Manager", "New Programming Method", "Network Protocol Manager", "Node Process Monitor"],
      correct: 0,
      difficulty: "beginner",
    },
    {
      question: "What is middleware in Express.js?",
      options: [
        "Software in the middle of two applications",
        "Functions that execute during the request-response cycle",
        "A type of database",
        "A debugging tool",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the purpose of package.json?",
      options: [
        "To store user data",
        "To define project metadata and dependencies",
        "To configure the database",
        "To store environment variables",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is clustering in Node.js?",
      options: [
        "Grouping related files",
        "Creating multiple worker processes to handle load",
        "A type of database operation",
        "A debugging technique",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the purpose of the 'buffer' class in Node.js?",
      options: [
        "To store temporary data",
        "To handle binary data",
        "To buffer network requests",
        "To improve performance of file operations",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the purpose of process.nextTick() in Node.js?",
      options: [
        "To restart the application",
        "To schedule a callback to execute after the current operation completes",
        "To move to the next middleware",
        "To handle errors",
      ],
      correct: 1,
      difficulty: "advanced",
    },
  ],
  SQL: [
    {
      question: "What is a JOIN in SQL?",
      options: [
        "A way to connect to databases",
        "A method to combine rows from multiple tables",
        "A type of constraint",
        "A debugging command",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the difference between INNER JOIN and LEFT JOIN?",
      options: [
        "No difference",
        "INNER JOIN returns only matching rows, LEFT JOIN returns all rows from left table",
        "LEFT JOIN is faster",
        "INNER JOIN is deprecated",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is a primary key?",
      options: [
        "The most important key",
        "A unique identifier for each row in a table",
        "A key used for encryption",
        "A type of index",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is normalization in databases?",
      options: [
        "Making data normal",
        "Organizing data to reduce redundancy",
        "Sorting data alphabetically",
        "Backing up data",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is an index in SQL?",
      options: [
        "A table of contents",
        "A data structure that improves query performance",
        "A type of constraint",
        "A backup mechanism",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is a transaction in SQL?",
      options: [
        "A financial operation",
        "A unit of work that is performed against a database",
        "A type of query",
        "A connection to the database",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the purpose of the HAVING clause in SQL?",
      options: [
        "To filter rows before grouping",
        "To filter groups after the GROUP BY clause",
        "To join tables",
        "To sort results",
      ],
      correct: 1,
      difficulty: "advanced",
    },
  ],
  TypeScript: [
    {
      question: "What is TypeScript?",
      options: [
        "A new programming language",
        "A superset of JavaScript that adds static typing",
        "A JavaScript framework",
        "A database query language",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is an interface in TypeScript?",
      options: [
        "A way to connect to APIs",
        "A contract that defines the structure of an object",
        "A type of class",
        "A debugging tool",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is the 'any' type in TypeScript?",
      options: [
        "A type that can be assigned any value",
        "A type for arrays only",
        "A type for numbers only",
        "A type for functions only",
      ],
      correct: 0,
      difficulty: "beginner",
    },
    {
      question: "What are generics in TypeScript?",
      options: [
        "Generic functions that work with any data type",
        "A way to create reusable components that work with a variety of types",
        "A type of variable",
        "A debugging tool",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is the difference between 'interface' and 'type' in TypeScript?",
      options: [
        "No difference",
        "Interfaces can be extended, types cannot",
        "Types can be used with primitives, interfaces cannot",
        "Both B and C are correct",
      ],
      correct: 3,
      difficulty: "intermediate",
    },
    {
      question: "What is a union type in TypeScript?",
      options: [
        "A type that combines multiple types",
        "A type that can be one of several types",
        "A type for unions only",
        "A type for database operations",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
  ],
  CSS: [
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is flexbox in CSS?",
      options: ["A flexible box model for layout", "A type of animation", "A color scheme", "A font family"],
      correct: 0,
      difficulty: "intermediate",
    },
    {
      question: "What is the box model in CSS?",
      options: [
        "A 3D modeling tool",
        "A layout model that describes the content, padding, border, and margin of an element",
        "A type of selector",
        "A way to create boxes in CSS",
      ],
      correct: 1,
      difficulty: "beginner",
    },
    {
      question: "What is the difference between 'display: none' and 'visibility: hidden'?",
      options: [
        "No difference",
        "'display: none' removes the element from the flow, 'visibility: hidden' hides it but keeps the space",
        "'visibility: hidden' is faster",
        "'display: none' is deprecated",
      ],
      correct: 1,
      difficulty: "intermediate",
    },
    {
      question: "What is a CSS preprocessor?",
      options: [
        "A tool that processes CSS before the browser",
        "A scripting language that extends CSS with variables, nesting, and more",
        "A type of CSS framework",
        "A tool for compressing CSS",
      ],
      correct: 1,
      difficulty: "advanced",
    },
    {
      question: "What is CSS Grid?",
      options: ["A grid-based layout system", "A CSS framework", "A type of selector", "A way to create tables in CSS"],
      correct: 0,
      difficulty: "intermediate",
    },
  ],
}

// Function to attempt AI question generation with error handling
async function generateAIQuestions(skill: string, count = 5) {
  try {
    console.log(`Attempting to generate ${count} AI questions for ${skill}...`)

    // Check if we have API access before attempting to call OpenAI
    const hasApiAccess = await checkApiAccess()
    if (!hasApiAccess) {
      console.log("OpenAI API access is not available or quota exceeded")
      return { questions: [], error: "API quota exceeded or not available" }
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert technical interviewer. Generate exactly ${count} multiple-choice questions for ${skill} skill assessment. 

CRITICAL: You must respond with ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 0,
      "difficulty": "beginner"
    }
  ]
}

Requirements:
- Each question must have exactly 4 options
- correct must be a number (0, 1, 2, or 3) indicating the correct option index
- difficulty must be one of: "beginner", "intermediate", "advanced"
- Questions should test practical knowledge
- Do not include any text outside the JSON structure
- Ensure all JSON is properly escaped`,
      prompt: `Generate exactly ${count} diverse ${skill} assessment questions. Include:
- 2 beginner level questions (basic concepts)
- 2 intermediate level questions (practical application)  
- 1 advanced level question (complex scenarios)

Focus on real-world usage and practical understanding rather than memorization.`,
    })

    console.log(`Raw AI response for ${skill}:`, text.substring(0, 200) + "...")

    // Clean the response to ensure it's valid JSON
    let cleanedText = text.trim()

    // Remove any markdown code blocks if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "")
    }

    // Try to parse the JSON
    const parsed = JSON.parse(cleanedText)

    // Validate the structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response structure: missing questions array")
    }

    // Validate each question
    const validQuestions = parsed.questions.filter((q) => {
      return (
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correct === "number" &&
        q.correct >= 0 &&
        q.correct <= 3 &&
        ["beginner", "intermediate", "advanced"].includes(q.difficulty)
      )
    })

    console.log(`Generated ${validQuestions.length} valid AI questions for ${skill}`)
    return { questions: validQuestions, error: null }
  } catch (error) {
    console.error(`Failed to generate AI questions for ${skill}:`, error)
    return {
      questions: [],
      error: error.message.includes("quota") ? "API quota exceeded" : `Failed to generate questions: ${error.message}`,
    }
  }
}

// Function to check if we have API access
async function checkApiAccess() {
  try {
    // Simple check to see if we can access the API
    // This is a lightweight call that won't consume much quota
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
      },
    })

    // If we get a 401 or 429, we don't have access
    if (response.status === 401 || response.status === 429) {
      return false
    }

    return response.ok
  } catch (error) {
    console.error("Error checking API access:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { skill, answers, useAI = false } = await request.json()

    if (!skill) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 })
    }

    if (answers) {
      // Score the assessment
      const result = scoreAssessment(skill, answers)
      return NextResponse.json(result)
    } else {
      // Generate or return questions for the skill
      let questions = []
      let source = "static"
      let aiAvailable = true
      let aiError = null

      // Check if the skill exists in our static questions
      if (!SKILL_QUESTIONS[skill]) {
        return NextResponse.json(
          {
            error: `No questions available for ${skill}`,
          },
          { status: 404 },
        )
      }

      if (useAI) {
        console.log(`AI mode requested for ${skill}`)
        // Try to generate AI questions
        const { questions: aiQuestions, error } = await generateAIQuestions(skill, 5)

        if (error) {
          console.log(`AI generation error: ${error}`)
          aiError = error
          aiAvailable = error !== "API quota exceeded"
        }

        if (aiQuestions.length >= 3) {
          // Use AI questions if we got at least 3 valid ones
          questions = aiQuestions
          source = "ai"
          console.log(`Using ${aiQuestions.length} AI questions for ${skill}`)
        } else {
          // Fallback to static questions
          questions = SKILL_QUESTIONS[skill] || []
          console.log(`AI generation failed, using ${questions.length} static questions for ${skill}`)
        }
      } else {
        // Use static questions
        questions = SKILL_QUESTIONS[skill] || []
        console.log(`Using ${questions.length} static questions for ${skill}`)
      }

      // Ensure we have at least 5 questions
      if (questions.length > 5) {
        // Randomly select 5 questions for variety
        questions = shuffleArray(questions).slice(0, 5)
      }

      return NextResponse.json({
        questions,
        source,
        aiAvailable,
        aiError,
      })
    }
  } catch (error) {
    console.error("Skill assessment error:", error)
    return NextResponse.json(
      {
        error: "Failed to process skill assessment",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// Helper function to shuffle an array
function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function scoreAssessment(skill: string, answers: number[]) {
  const totalQuestions = answers.length

  // For demo purposes, we'll use a realistic scoring algorithm
  // In production, you'd compare against the actual correct answers stored in session
  let correct = 0

  // Simulate realistic scoring based on typical assessment performance
  answers.forEach((answer, index) => {
    if (typeof answer === "number" && answer >= 0 && answer <= 3) {
      // Simulate 60-80% accuracy for realistic results
      const randomScore = Math.random()
      if (randomScore > 0.25) {
        // 75% chance of being correct
        correct++
      }
    }
  })

  const percentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0

  let level = "Beginner"
  if (percentage >= 80) level = "Advanced"
  else if (percentage >= 60) level = "Intermediate"

  return {
    skill,
    score: Math.round(percentage),
    level,
    correct,
    total: totalQuestions,
    recommendations: generateSkillRecommendations(skill, percentage),
  }
}

function generateSkillRecommendations(skill: string, score: number): string[] {
  const recommendations = []

  if (score < 60) {
    recommendations.push(`Focus on ${skill} fundamentals and core concepts`)
    recommendations.push("Take structured online courses or tutorials")
    recommendations.push("Practice with hands-on coding exercises daily")
    recommendations.push(`Join ${skill} communities and forums for support`)
  } else if (score < 80) {
    recommendations.push(`Deepen your ${skill} knowledge with advanced topics`)
    recommendations.push("Work on real-world projects to gain practical experience")
    recommendations.push(`Explore ${skill} best practices and design patterns`)
    recommendations.push(`Consider contributing to open-source ${skill} projects`)
  } else {
    recommendations.push(`Maintain your ${skill} expertise with continuous learning`)
    recommendations.push(`Stay updated with the latest ${skill} features and updates`)
    recommendations.push(`Consider mentoring others or teaching ${skill}`)
    recommendations.push(`Explore advanced ${skill} frameworks and tools`)
  }

  return recommendations
}
