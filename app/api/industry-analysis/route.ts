import { type NextRequest, NextResponse } from "next/server"

const INDUSTRY_DATA = {
  "Software Engineering": {
    keySkills: ["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "AWS", "Docker"],
    averageSalary: "$95,000 - $150,000",
    growthRate: "22%",
    topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
    trends: ["AI/ML Integration", "Cloud Computing", "DevOps", "Microservices"],
  },
  "Data Science": {
    keySkills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Tableau", "TensorFlow", "Pandas"],
    averageSalary: "$100,000 - $160,000",
    growthRate: "35%",
    topCompanies: ["Netflix", "Uber", "Airbnb", "LinkedIn", "Spotify"],
    trends: ["Deep Learning", "MLOps", "Big Data", "Real-time Analytics"],
  },
  "Product Management": {
    keySkills: ["Strategy", "Analytics", "User Research", "Agile", "Roadmapping", "A/B Testing", "SQL", "Figma"],
    averageSalary: "$110,000 - $180,000",
    growthRate: "19%",
    topCompanies: ["Google", "Amazon", "Microsoft", "Stripe", "Slack"],
    trends: ["AI-Powered Products", "Customer-Centric Design", "Data-Driven Decisions", "Remote Collaboration"],
  },
  Marketing: {
    keySkills: [
      "Digital Marketing",
      "SEO",
      "Content Marketing",
      "Analytics",
      "Social Media",
      "Email Marketing",
      "PPC",
      "CRM",
    ],
    averageSalary: "$50,000 - $90,000",
    growthRate: "10%",
    topCompanies: ["HubSpot", "Salesforce", "Adobe", "Mailchimp", "Buffer"],
    trends: ["Marketing Automation", "Personalization", "Video Marketing", "Influencer Marketing"],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText, targetIndustry } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const industry = detectIndustry(resumeText, targetIndustry)
    const analysis = analyzeForIndustry(resumeText, industry)

    return NextResponse.json({
      detectedIndustry: industry,
      industryData: INDUSTRY_DATA[industry] || INDUSTRY_DATA["Software Engineering"],
      analysis,
      marketInsights: generateMarketInsights(industry),
    })
  } catch (error) {
    console.error("Industry analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze industry fit" }, { status: 500 })
  }
}

function detectIndustry(resumeText: string, targetIndustry?: string): string {
  if (targetIndustry && INDUSTRY_DATA[targetIndustry]) {
    return targetIndustry
  }

  const text = resumeText.toLowerCase()

  // Score each industry based on keyword presence
  const scores = Object.entries(INDUSTRY_DATA).map(([industry, data]) => {
    const keywordMatches = data.keySkills.filter((skill) => text.includes(skill.toLowerCase())).length

    return { industry, score: keywordMatches }
  })

  // Return industry with highest score
  const bestMatch = scores.reduce((prev, current) => (current.score > prev.score ? current : prev))

  return bestMatch.industry
}

function analyzeForIndustry(resumeText: string, industry: string) {
  const industryData = INDUSTRY_DATA[industry]
  const text = resumeText.toLowerCase()

  const presentSkills = industryData.keySkills.filter((skill) => text.includes(skill.toLowerCase()))

  const missingSkills = industryData.keySkills.filter((skill) => !text.includes(skill.toLowerCase()))

  const skillCoverage = (presentSkills.length / industryData.keySkills.length) * 100

  return {
    skillCoverage: Math.round(skillCoverage),
    presentSkills,
    missingSkills,
    industryFit: skillCoverage >= 60 ? "Strong" : skillCoverage >= 40 ? "Moderate" : "Weak",
    recommendations: generateIndustryRecommendations(missingSkills, industry),
  }
}

function generateMarketInsights(industry: string) {
  const data = INDUSTRY_DATA[industry]

  return {
    salaryRange: data.averageSalary,
    jobGrowth: data.growthRate,
    topEmployers: data.topCompanies.slice(0, 3),
    emergingTrends: data.trends.slice(0, 2),
    competitiveness: "High", // Could be dynamic based on skill coverage
    demandLevel: "Very High",
  }
}

function generateIndustryRecommendations(missingSkills: string[], industry: string): string[] {
  const recommendations = []

  if (missingSkills.length > 0) {
    recommendations.push(`Consider learning: ${missingSkills.slice(0, 3).join(", ")}`)
  }

  switch (industry) {
    case "Software Engineering":
      recommendations.push("Contribute to open source projects")
      recommendations.push("Build a portfolio of personal projects")
      break
    case "Data Science":
      recommendations.push("Complete Kaggle competitions")
      recommendations.push("Publish data analysis articles")
      break
    case "Product Management":
      recommendations.push("Get certified in product management")
      recommendations.push("Lead cross-functional projects")
      break
    case "Marketing":
      recommendations.push("Get Google Analytics certified")
      recommendations.push("Create case studies of successful campaigns")
      break
  }

  recommendations.push("Network with industry professionals")
  recommendations.push("Stay updated with industry trends")

  return recommendations.slice(0, 5)
}
