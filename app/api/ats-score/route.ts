import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const atsAnalysis = analyzeATSCompatibility(resumeText, jobDescription)

    return NextResponse.json(atsAnalysis)
  } catch (error) {
    console.error("ATS analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze ATS compatibility" }, { status: 500 })
  }
}

function analyzeATSCompatibility(resumeText: string, jobDescription?: string) {
  const resumeLower = resumeText.toLowerCase()
  const jobLower = jobDescription ? jobDescription.toLowerCase() : ""

  let atsScore = 60

  // Format analysis
  const formatIssues = []
  const formatStrengths = []

  // Check for ATS-friendly elements
  if (resumeText.includes("@")) {
    atsScore += 5
    formatStrengths.push("Contact information clearly visible")
  } else {
    formatIssues.push("Missing email address")
  }

  if (resumeLower.includes("experience") || resumeLower.includes("work history")) {
    atsScore += 8
    formatStrengths.push("Clear work experience section")
  }

  if (resumeLower.includes("education")) {
    atsScore += 5
    formatStrengths.push("Education section present")
  }

  if (resumeLower.includes("skills")) {
    atsScore += 8
    formatStrengths.push("Dedicated skills section")
  }

  // Check for problematic elements
  if (resumeText.includes("•") || resumeText.includes("●")) {
    atsScore += 3
    formatStrengths.push("Uses bullet points for readability")
  }

  // Headers and structure
  const hasHeaders = /^[A-Z\s]{3,}$/gm.test(resumeText)
  if (hasHeaders) {
    atsScore += 5
    formatStrengths.push("Clear section headers")
  }

  // Keyword density analysis
  let keywordScore = 0
  const commonKeywords = [
    "managed",
    "led",
    "developed",
    "implemented",
    "created",
    "designed",
    "improved",
    "increased",
    "reduced",
    "achieved",
    "collaborated",
  ]

  const foundKeywords = commonKeywords.filter((keyword) => resumeLower.includes(keyword))

  keywordScore = Math.min(foundKeywords.length * 2, 15)
  atsScore += keywordScore

  if (foundKeywords.length >= 5) {
    formatStrengths.push("Good use of action verbs")
  } else {
    formatIssues.push("Limited use of strong action verbs")
  }

  // Job description matching
  if (jobDescription) {
    const jobKeywords = extractKeywords(jobLower)
    const resumeKeywords = extractKeywords(resumeLower)

    const matchingKeywords = jobKeywords.filter((keyword) => resumeKeywords.includes(keyword))

    const matchRatio = jobKeywords.length > 0 ? matchingKeywords.length / jobKeywords.length : 0
    const matchBonus = Math.round(matchRatio * 20)
    atsScore += matchBonus

    if (matchRatio > 0.6) {
      formatStrengths.push("Strong keyword alignment with job requirements")
    } else if (matchRatio > 0.3) {
      formatStrengths.push("Moderate keyword alignment")
    } else {
      formatIssues.push("Low keyword alignment with job requirements")
    }
  }

  // Length analysis
  const wordCount = resumeText.split(/\s+/).length
  if (wordCount >= 300 && wordCount <= 800) {
    atsScore += 5
    formatStrengths.push("Appropriate resume length")
  } else if (wordCount < 300) {
    formatIssues.push("Resume may be too short")
  } else if (wordCount > 1200) {
    formatIssues.push("Resume may be too long for ATS systems")
  }

  // Cap the score
  atsScore = Math.min(atsScore, 95)

  return {
    atsScore: Math.round(atsScore),
    formatStrengths: formatStrengths.slice(0, 6),
    formatIssues: formatIssues.slice(0, 5),
    keywordDensity: foundKeywords.length,
    recommendations: generateATSRecommendations(formatIssues, atsScore),
    passesATS: atsScore >= 70,
  }
}

function extractKeywords(text: string): string[] {
  const keywords = text.match(/\b[a-z]{3,}\b/g) || []
  return [...new Set(keywords)].filter(
    (word) =>
      ![
        "the",
        "and",
        "for",
        "are",
        "but",
        "not",
        "you",
        "all",
        "can",
        "had",
        "her",
        "was",
        "one",
        "our",
        "out",
        "day",
        "get",
        "has",
        "him",
        "his",
        "how",
        "man",
        "new",
        "now",
        "old",
        "see",
        "two",
        "way",
        "who",
        "boy",
        "did",
        "its",
        "let",
        "put",
        "say",
        "she",
        "too",
        "use",
      ].includes(word),
  )
}

function generateATSRecommendations(issues: string[], score: number): string[] {
  const recommendations = []

  if (score < 70) {
    recommendations.push("Optimize resume format for ATS compatibility")
  }

  if (issues.includes("Missing email address")) {
    recommendations.push("Add clear contact information at the top")
  }

  if (issues.includes("Limited use of strong action verbs")) {
    recommendations.push("Use more action verbs like 'managed', 'developed', 'implemented'")
  }

  if (issues.includes("Low keyword alignment with job requirements")) {
    recommendations.push("Include more keywords from the job description")
  }

  recommendations.push("Use standard section headers (Experience, Education, Skills)")
  recommendations.push("Avoid complex formatting, tables, and graphics")
  recommendations.push("Save resume in both PDF and Word formats")

  return recommendations.slice(0, 5)
}
