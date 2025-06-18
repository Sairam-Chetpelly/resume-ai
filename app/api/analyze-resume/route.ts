import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("=== Resume Analysis API Called ===")

  try {
    // Step 1: Parse request body
    console.log("Step 1: Parsing request body...")
    let body
    try {
      body = await request.json()
      console.log("✓ Request body parsed successfully")
    } catch (parseError) {
      console.error("✗ Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Step 2: Extract data
    console.log("Step 2: Extracting data...")
    const resumeText = body?.resumeText || ""
    const jobDescription = body?.jobDescription || ""

    if (!resumeText.trim()) {
      console.log("✗ No resume text provided")
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    console.log("✓ Resume text length:", resumeText.length)
    console.log("✓ Job description length:", jobDescription.length)

    // Step 3: Generate realistic analysis
    console.log("Step 3: Generating realistic analysis...")

    try {
      const analysis = generateRealisticAnalysis(resumeText, jobDescription)
      console.log("✓ Analysis generated successfully")
      console.log("✓ Overall Score:", analysis.overallScore)
      console.log("✓ Job Match Score:", analysis.jobMatchScore)
      console.log("✓ Skills Found:", analysis.skillsFound)

      return NextResponse.json(analysis)
    } catch (analysisError) {
      console.error("✗ Analysis generation failed:", analysisError)

      // Return basic fallback
      const fallbackAnalysis = {
        overallScore: 65,
        strengths: ["Resume structure is clear", "Professional presentation"],
        weaknesses: ["Analysis temporarily unavailable", "Please try again"],
        skillsFound: ["Professional Experience"],
        missingSkills: ["Analysis in progress"],
        recommendations: ["Please try the analysis again"],
        jobMatchScore: 60,
      }

      console.log("✓ Returning fallback analysis")
      return NextResponse.json(fallbackAnalysis)
    }
  } catch (generalError) {
    console.error("=== GENERAL ERROR ===", generalError)
    return NextResponse.json({
      overallScore: 60,
      strengths: ["Resume submitted for analysis"],
      weaknesses: ["Analysis service temporarily unavailable"],
      skillsFound: ["Professional Experience"],
      missingSkills: ["Service unavailable"],
      recommendations: ["Please try again later"],
      jobMatchScore: 55,
    })
  }
}

function generateRealisticAnalysis(resumeText: string, jobDescription?: string) {
  console.log("--- Starting Realistic Analysis ---")

  const lowerResumeText = resumeText.toLowerCase()
  const lowerJobDescription = jobDescription?.toLowerCase() || ""

  // Comprehensive skill categories
  const skillCategories = {
    // Backend Technologies
    backend: [
      "php",
      "laravel",
      "symfony",
      "codeigniter",
      "node.js",
      "express",
      "django",
      "flask",
      "spring",
      "asp.net",
      "ruby on rails",
      "java",
      "python",
      "c#",
      "go",
      "rust",
    ],
    // Frontend Technologies
    frontend: [
      "javascript",
      "typescript",
      "react",
      "vue.js",
      "angular",
      "html",
      "css",
      "sass",
      "less",
      "bootstrap",
      "tailwind",
      "jquery",
      "webpack",
      "vite",
    ],
    // Databases
    databases: ["mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "sql server", "mariadb"],
    // Cloud & DevOps
    cloud: ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "gitlab", "github actions", "terraform"],
    // Tools & Others
    tools: ["git", "composer", "npm", "yarn", "postman", "swagger", "jira", "trello"],
    // Soft Skills
    soft: [
      "leadership",
      "project management",
      "communication",
      "problem solving",
      "teamwork",
      "agile",
      "scrum",
      "mentoring",
    ],
  }

  // Find skills in resume
  const foundSkills = []
  const skillMatches = {}

  for (const [category, skills] of Object.entries(skillCategories)) {
    skillMatches[category] = []
    for (const skill of skills) {
      if (lowerResumeText.includes(skill)) {
        foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1))
        skillMatches[category].push(skill)
      }
    }
  }

  console.log("✓ Skills by category:", skillMatches)

  // Determine primary technology stack
  let primaryStack = "General"
  if (skillMatches.backend.some((skill) => ["php", "laravel"].includes(skill))) {
    primaryStack = "PHP/Laravel"
  } else if (skillMatches.backend.some((skill) => ["node.js", "express"].includes(skill))) {
    primaryStack = "Node.js"
  } else if (skillMatches.backend.some((skill) => ["python", "django", "flask"].includes(skill))) {
    primaryStack = "Python"
  } else if (skillMatches.backend.includes("java")) {
    primaryStack = "Java"
  } else if (skillMatches.frontend.some((skill) => ["react", "javascript"].includes(skill))) {
    primaryStack = "Frontend"
  }

  console.log("✓ Primary stack detected:", primaryStack)

  // Calculate realistic base score
  let baseScore = 50 // Start lower

  // Resume quality factors
  const resumeLength = resumeText.length
  if (resumeLength > 1500) baseScore += 8
  if (resumeLength > 3000) baseScore += 5

  // Contact info
  if (resumeText.includes("@")) baseScore += 3
  if (resumeText.match(/$$?\d{3}$$?[-.\s]?\d{3}[-.\s]?\d{4}/)) baseScore += 3

  // Structure
  if (lowerResumeText.includes("experience")) baseScore += 6
  if (lowerResumeText.includes("education")) baseScore += 4
  if (lowerResumeText.includes("summary")) baseScore += 5

  // Skills diversity
  const totalSkills = foundSkills.length
  if (totalSkills >= 5) baseScore += 8
  if (totalSkills >= 10) baseScore += 7
  if (totalSkills >= 15) baseScore += 5

  // Quantified achievements
  const achievements = resumeText.match(/\d+%|\d+\s*(years?|months?)|increased|improved|reduced|led|managed/gi)
  if (achievements && achievements.length > 2) baseScore += 10
  if (achievements && achievements.length > 5) baseScore += 5

  // Cap the base score realistically
  baseScore = Math.min(baseScore, 85)

  console.log("✓ Base score calculated:", baseScore)

  // Job matching logic
  let jobMatchScore = baseScore
  const jobRequiredSkills = []
  let matchingSkills = []
  let missingCriticalSkills = []

  if (jobDescription && jobDescription.trim()) {
    console.log("--- Analyzing Job Match ---")

    // Extract skills from job description
    for (const [category, skills] of Object.entries(skillCategories)) {
      for (const skill of skills) {
        if (lowerJobDescription.includes(skill)) {
          jobRequiredSkills.push(skill)
        }
      }
    }

    console.log("✓ Job required skills:", jobRequiredSkills)

    // Find matching skills
    matchingSkills = foundSkills.filter((skill) =>
      jobRequiredSkills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()),
    )

    // Find missing critical skills
    missingCriticalSkills = jobRequiredSkills.filter(
      (jobSkill) => !foundSkills.some((skill) => skill.toLowerCase() === jobSkill.toLowerCase()),
    )

    console.log("✓ Matching skills:", matchingSkills)
    console.log("✓ Missing skills:", missingCriticalSkills)

    // Calculate realistic job match score
    if (jobRequiredSkills.length > 0) {
      const matchPercentage = matchingSkills.length / jobRequiredSkills.length
      console.log("✓ Match percentage:", matchPercentage)

      // More realistic job matching
      if (matchPercentage >= 0.8) {
        jobMatchScore = Math.min(baseScore + 5, 90) // Excellent match
      } else if (matchPercentage >= 0.6) {
        jobMatchScore = Math.min(baseScore, 80) // Good match
      } else if (matchPercentage >= 0.4) {
        jobMatchScore = Math.max(baseScore - 10, 60) // Fair match
      } else if (matchPercentage >= 0.2) {
        jobMatchScore = Math.max(baseScore - 20, 45) // Poor match
      } else {
        jobMatchScore = Math.max(baseScore - 30, 35) // Very poor match
      }

      // Additional penalties for missing critical skills
      const criticalMissing = missingCriticalSkills.length
      if (criticalMissing > 5) jobMatchScore -= 15
      else if (criticalMissing > 3) jobMatchScore -= 10
      else if (criticalMissing > 1) jobMatchScore -= 5

      jobMatchScore = Math.max(jobMatchScore, 25) // Minimum score
    }
  }

  console.log("✓ Final job match score:", jobMatchScore)

  // Generate contextual strengths
  const strengths = []
  if (totalSkills > 8) {
    strengths.push(`Strong ${primaryStack} skill set with ${totalSkills} relevant technologies`)
  }
  if (achievements && achievements.length > 3) {
    strengths.push("Good use of quantified achievements and measurable results")
  }
  if (lowerResumeText.includes("led") || lowerResumeText.includes("managed")) {
    strengths.push("Demonstrates leadership and management experience")
  }
  if (resumeLength > 2500) {
    strengths.push("Comprehensive coverage of professional background")
  }
  if (skillMatches.databases.length > 1) {
    strengths.push("Experience with multiple database technologies")
  }

  // Default strengths
  if (strengths.length === 0) {
    strengths.push("Professional presentation with clear structure", "Relevant technical background")
  }

  // Generate contextual weaknesses
  const weaknesses = []
  if (!achievements || achievements.length < 2) {
    weaknesses.push("Limited quantified achievements - add specific metrics and numbers")
  }
  if (totalSkills < 5) {
    weaknesses.push("Technical skills section could be more comprehensive")
  }
  if (!lowerResumeText.includes("summary")) {
    weaknesses.push("Missing professional summary section")
  }
  if (jobDescription && missingCriticalSkills.length > 3) {
    weaknesses.push(
      `Missing several key skills required for this role: ${missingCriticalSkills.slice(0, 3).join(", ")}`,
    )
  }

  // Default weaknesses
  if (weaknesses.length === 0) {
    weaknesses.push("Consider adding more specific project details", "Could optimize for ATS systems")
  }

  // Generate smart recommendations
  const recommendations = []
  if (!achievements || achievements.length < 3) {
    recommendations.push("Add specific metrics: 'Improved performance by X%', 'Led team of X developers'")
  }
  if (jobDescription && missingCriticalSkills.length > 0) {
    recommendations.push(`Consider learning: ${missingCriticalSkills.slice(0, 3).join(", ")} for this role`)
  }
  if (!lowerResumeText.includes("project")) {
    recommendations.push("Include specific project examples with technologies used")
  }
  recommendations.push("Tailor resume keywords to match job description requirements")
  recommendations.push("Consider adding links to portfolio, GitHub, or LinkedIn profile")

  // Smart missing skills suggestions
  let suggestedSkills = []
  if (jobDescription) {
    suggestedSkills = missingCriticalSkills.slice(0, 6)
  } else {
    // Suggest complementary skills based on primary stack
    if (primaryStack === "PHP/Laravel") {
      suggestedSkills = ["Vue.js", "MySQL", "Redis", "Docker", "AWS", "Git"].filter(
        (skill) => !foundSkills.some((fs) => fs.toLowerCase() === skill.toLowerCase()),
      )
    } else if (primaryStack === "Java") {
      suggestedSkills = ["Spring Boot", "MySQL", "Docker", "AWS", "Maven", "JUnit"].filter(
        (skill) => !foundSkills.some((fs) => fs.toLowerCase() === skill.toLowerCase()),
      )
    } else {
      suggestedSkills = ["Docker", "AWS", "Git", "MySQL", "Redis", "CI/CD"].filter(
        (skill) => !foundSkills.some((fs) => fs.toLowerCase() === skill.toLowerCase()),
      )
    }
  }

  const result = {
    overallScore: Math.round(baseScore),
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 4),
    skillsFound: foundSkills.slice(0, 12),
    missingSkills: suggestedSkills.slice(0, 6),
    recommendations: recommendations.slice(0, 6),
    jobMatchScore: Math.round(jobMatchScore),
  }

  console.log("✓ Final analysis result:", result)
  return result
}
