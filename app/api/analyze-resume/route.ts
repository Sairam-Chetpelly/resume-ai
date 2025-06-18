import { type NextRequest, NextResponse } from "next/server"

// Enhanced demo analysis function with more realistic content
function generateDemoAnalysis(resumeText: string, jobDescription?: string) {
  console.log("Generating demo analysis...")

  // Extract actual skills from the resume text
  const skillKeywords = [
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
    "API",
    "Testing",
    "Agile",
    "Leadership",
    "Project Management",
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Scrum",
    "DevOps",
    "Kubernetes",
    "Redis",
    "GraphQL",
    "REST",
    "Microservices",
    "CI/CD",
    "Jenkins",
    "Linux",
    "Windows",
    "macOS",
    "Figma",
    "Photoshop",
    "Excel",
  ]

  const foundSkills = skillKeywords
    .filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()))
    .slice(0, 10)

  // If no skills found, add some generic ones
  if (foundSkills.length === 0) {
    foundSkills.push("Communication", "Problem Solving", "Teamwork", "Time Management")
  }

  // Generate realistic scores based on resume length and content
  const resumeLength = resumeText.length
  let baseScore = 70

  // Adjust score based on resume characteristics
  if (resumeLength > 2000) baseScore += 10
  if (resumeLength > 4000) baseScore += 5
  if (resumeText.includes("@")) baseScore += 5 // Has email
  if (resumeText.match(/\d{4}/)) baseScore += 5 // Has years/dates
  if (resumeText.toLowerCase().includes("experience")) baseScore += 5
  if (resumeText.toLowerCase().includes("education")) baseScore += 5

  // Cap at 95
  baseScore = Math.min(baseScore, 95)

  const jobMatchScore = jobDescription ? Math.max(baseScore - 10, 60) + Math.floor(Math.random() * 15) : baseScore

  // Generate contextual feedback based on actual resume content
  const strengths = []
  const weaknesses = []
  const recommendations = []

  // Analyze resume content for strengths
  if (resumeText.toLowerCase().includes("led") || resumeText.toLowerCase().includes("managed")) {
    strengths.push("Demonstrates leadership and management experience")
  }
  if (resumeText.match(/\d+%|\d+\s*(years?|months?)/i)) {
    strengths.push("Includes quantified achievements and metrics")
  }
  if (foundSkills.length > 5) {
    strengths.push("Strong technical skill set evident throughout resume")
  }
  if (resumeText.toLowerCase().includes("project")) {
    strengths.push("Clear project experience and hands-on work")
  }
  if (resumeText.toLowerCase().includes("summary")) {
    strengths.push("Well-structured with professional summary")
  }

  // Default strengths if none found
  if (strengths.length === 0) {
    strengths.push(
      "Professional presentation and structure",
      "Relevant experience for target roles",
      "Clear communication of background",
    )
  }

  // Generate improvement suggestions
  if (!resumeText.match(/\d+%/)) {
    weaknesses.push("Could benefit from more quantified achievements")
    recommendations.push("Add specific metrics and percentages to showcase impact")
  }
  if (resumeText.length < 1000) {
    weaknesses.push("Resume could be more detailed")
    recommendations.push("Expand on key experiences and accomplishments")
  }
  if (!resumeText.toLowerCase().includes("summary")) {
    weaknesses.push("Missing professional summary section")
    recommendations.push("Add a compelling professional summary at the top")
  }
  if (!resumeText.includes("@")) {
    weaknesses.push("Contact information could be more prominent")
    recommendations.push("Ensure email and phone number are clearly visible")
  }

  // Default weaknesses and recommendations
  if (weaknesses.length === 0) {
    weaknesses.push("Some sections could be more concise", "Consider optimizing for ATS systems")
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Ensure consistent formatting throughout",
      "Include relevant keywords for your target industry",
    )
  }

  // Add more recommendations
  recommendations.push(
    "Consider adding links to portfolio or LinkedIn profile",
    "Tailor resume for each specific job application",
  )

  return {
    overallScore: baseScore,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 4),
    skillsFound: foundSkills,
    missingSkills: jobDescription
      ? ["Cloud Computing", "DevOps", "Agile Methodologies", "Data Analysis"]
      : ["Leadership", "Project Management", "Strategic Planning"],
    recommendations: recommendations.slice(0, 6),
    jobMatchScore,
    isDemoMode: true,
    demoReason: "Using intelligent demo analysis",
  }
}

export async function POST(request: NextRequest) {
  console.log("Resume analysis API called")

  let resumeText = ""
  let jobDescription = ""

  // Parse request body safely
  try {
    const body = await request.json()
    resumeText = body.resumeText || ""
    jobDescription = body.jobDescription || ""
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }

  if (!resumeText.trim()) {
    return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
  }

  // Check if API key is available and valid
  const apiKey = process.env.OPENAI_API_KEY
  const hasValidApiKey = apiKey && apiKey !== "your_openai_api_key_here" && apiKey.startsWith("sk-")

  if (!hasValidApiKey) {
    console.log("No valid OpenAI API key found, using demo mode")
    const demoResult = generateDemoAnalysis(resumeText, jobDescription)
    return NextResponse.json(demoResult)
  }

  console.log("Attempting OpenAI API call...")

  // Try OpenAI API with comprehensive error handling
  try {
    const { generateObject } = await import("ai")
    const { openai } = await import("@ai-sdk/openai")
    const { z } = await import("zod")

    const AnalysisSchema = z.object({
      overallScore: z.number().min(0).max(100),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      skillsFound: z.array(z.string()),
      missingSkills: z.array(z.string()),
      recommendations: z.array(z.string()),
      jobMatchScore: z.number().min(0).max(100),
    })

    const prompt = `
Analyze the following resume and provide detailed feedback:

RESUME:
${resumeText}

${
  jobDescription
    ? `JOB DESCRIPTION (for targeted analysis):
${jobDescription}`
    : ""
}

Please provide:
1. An overall score (0-100) based on resume quality, formatting, and content
2. Key strengths of the resume
3. Areas that need improvement
4. Skills and technologies found in the resume
5. Missing skills that would be valuable (especially if job description provided)
6. Specific recommendations for improvement
7. Job match score (0-100) if job description is provided, otherwise use overall score

Focus on:
- Technical skills and experience
- Resume structure and formatting
- Achievement quantification
- Keyword optimization
- Industry relevance
- Professional presentation

Be specific and actionable in your feedback.
`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: AnalysisSchema,
      prompt,
    })

    console.log("OpenAI API call successful")
    return NextResponse.json({
      ...object,
      isDemoMode: false,
    })
  } catch (openaiError: any) {
    console.error("OpenAI API error:", openaiError?.message || openaiError)

    // Fall back to demo mode for any OpenAI error
    console.log("Falling back to demo mode due to OpenAI error")
    const demoResult = generateDemoAnalysis(resumeText, jobDescription)
    return NextResponse.json(demoResult)
  }
}
