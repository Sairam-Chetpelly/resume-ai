import { type NextRequest, NextResponse } from "next/server"

// Demo analysis for when OpenAI is not configured
export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate demo analysis based on resume content
    const demoAnalysis = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      strengths: [
        "Strong technical background evident in resume",
        "Good use of action verbs and quantified achievements",
        "Relevant work experience for the target role",
        "Clear and organized resume structure",
      ],
      weaknesses: [
        "Could benefit from more specific metrics and numbers",
        "Missing some industry-relevant keywords",
        "Professional summary could be more compelling",
        "Some sections could be more concise",
      ],
      skillsFound: extractSkillsFromText(resumeText),
      missingSkills: jobDescription
        ? ["Cloud Computing", "DevOps", "Agile Methodologies", "Data Analysis"]
        : ["Leadership", "Project Management", "Communication", "Problem Solving"],
      recommendations: [
        "Add more quantified achievements (e.g., 'Increased efficiency by 25%')",
        "Include relevant certifications or training",
        "Optimize keywords for ATS systems",
        "Consider adding a professional summary section",
        "Ensure consistent formatting throughout",
      ],
      jobMatchScore: jobDescription
        ? Math.floor(Math.random() * 25) + 65
        : // 65-90 if job description provided
          Math.floor(Math.random() * 30) + 70, // 70-100 otherwise
    }

    return NextResponse.json(demoAnalysis)
  } catch (error) {
    console.error("Demo analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "HTML",
    "CSS",
    "Java",
    "C++",
    "Git",
    "Docker",
    "AWS",
    "MongoDB",
    "PostgreSQL",
    "TypeScript",
    "Vue.js",
    "Angular",
    "Express",
    "Django",
    "Flask",
    "Machine Learning",
    "Data Science",
    "API Development",
    "Testing",
  ]

  const foundSkills = commonSkills.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))

  // Add some generic skills if none found
  if (foundSkills.length === 0) {
    return ["Communication", "Problem Solving", "Teamwork", "Time Management"]
  }

  return foundSkills.slice(0, 8) // Limit to 8 skills
}
