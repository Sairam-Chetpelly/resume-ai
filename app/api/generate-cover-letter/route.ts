import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, companyName, position } = await request.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: "Resume text and job description are required" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const coverLetter = generateCoverLetter(resumeText, jobDescription, companyName, position)

    return NextResponse.json({
      coverLetter,
      tips: [
        "Customize the opening paragraph for each application",
        "Include specific examples from your experience",
        "Research the company culture and values",
        "Keep it concise - aim for 3-4 paragraphs",
        "End with a strong call to action",
      ],
    })
  } catch (error) {
    console.error("Cover letter generation error:", error)
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 })
  }
}

function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName?: string,
  position?: string,
): string {
  const company = companyName || "[Company Name]"
  const role = position || "[Position Title]"

  // Extract key skills and experiences from resume
  const skills = extractSkillsFromResume(resumeText)
  const experiences = extractExperiences(resumeText)

  // Extract requirements from job description
  const requirements = extractRequirements(jobDescription)

  // Match skills with requirements
  const relevantSkills = skills
    .filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))
    .slice(0, 3)

  const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With my background in ${relevantSkills.join(", ")}, I am excited about the opportunity to contribute to your team and help drive ${company}'s continued success.

In my previous roles, I have ${experiences[0] || "developed strong technical and leadership skills"}. ${experiences[1] || "I have consistently delivered high-quality results while collaborating effectively with cross-functional teams."}${relevantSkills.length > 0 ? ` My expertise in ${relevantSkills.join(" and ")} directly aligns with your requirements for this position.` : ""}

What particularly attracts me to ${company} is ${generateCompanyAttraction(companyName)}. I am eager to bring my ${skills.slice(0, 2).join(" and ")} skills to help ${company} achieve its goals and continue its growth trajectory.

I would welcome the opportunity to discuss how my experience and passion can contribute to your team. Thank you for considering my application, and I look forward to hearing from you soon.

Best regards,
[Your Name]`

  return coverLetter
}

function extractSkillsFromResume(resumeText: string): string[] {
  const commonSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "AWS",
    "Docker",
    "Git",
    "MongoDB",
    "PostgreSQL",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "Leadership",
    "Communication",
    "Problem Solving",
    "Teamwork",
  ]

  return commonSkills.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase())).slice(0, 6)
}

function extractExperiences(resumeText: string): string[] {
  const experiences = []
  const text = resumeText.toLowerCase()

  if (text.includes("led") || text.includes("managed")) {
    experiences.push("successfully led teams and managed complex projects")
  }

  if (text.includes("developed") || text.includes("built")) {
    experiences.push("I have developed and built scalable solutions that improved business outcomes")
  }

  if (text.includes("improved") || text.includes("increased")) {
    experiences.push("I have a proven track record of improving processes and increasing efficiency")
  }

  return experiences.slice(0, 2)
}

function extractRequirements(jobDescription: string): string[] {
  // Simple extraction - in a real app, this would be more sophisticated
  const requirements = []
  const text = jobDescription.toLowerCase()

  if (text.includes("experience")) requirements.push("relevant experience")
  if (text.includes("degree")) requirements.push("educational background")
  if (text.includes("leadership")) requirements.push("leadership skills")

  return requirements
}

function generateCompanyAttraction(companyName?: string): string {
  if (!companyName) {
    return "your company's innovative approach and commitment to excellence"
  }

  const attractions = [
    "your company's reputation for innovation and excellence",
    "the opportunity to work with cutting-edge technology",
    "your commitment to professional development and growth",
    "the collaborative culture and talented team",
  ]

  return attractions[Math.floor(Math.random() * attractions.length)]
}
