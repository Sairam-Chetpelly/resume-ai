"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

interface ResumePreviewProps {
  resumeData: ResumeData
  onDownload: () => void
}

export function ResumePreview({ resumeData, onDownload }: ResumePreviewProps) {
  const { personalInfo, summary, experiences, education, skills } = resumeData

  const downloadAsPDF = () => {
    // For now, we'll download as text. In a real app, you'd use a PDF library
    onDownload()
  }

  const downloadAsWord = () => {
    const resumeContent = generateWordContent()
    const blob = new Blob([resumeContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${personalInfo.fullName || "Resume"}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateWordContent = () => {
    // Simple HTML format that Word can read
    let content = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .contact { font-size: 14px; color: #666; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
            .experience-item, .education-item { margin-bottom: 20px; }
            .job-title { font-weight: bold; font-size: 16px; }
            .company { font-style: italic; color: #666; }
            .date { float: right; color: #666; font-size: 14px; }
            .description { margin-top: 8px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
          </style>
        </head>
        <body>
    `

    // Header
    content += `<div class="header">`
    if (personalInfo.fullName) {
      content += `<div class="name">${personalInfo.fullName}</div>`
    }
    content += `<div class="contact">`
    if (personalInfo.email) content += `${personalInfo.email} | `
    if (personalInfo.phone) content += `${personalInfo.phone} | `
    if (personalInfo.location) content += `${personalInfo.location}`
    if (personalInfo.linkedin) content += `<br>LinkedIn: ${personalInfo.linkedin}`
    if (personalInfo.website) content += ` | Website: ${personalInfo.website}`
    content += `</div></div>`

    // Summary
    if (summary) {
      content += `<div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <p>${summary}</p>
      </div>`
    }

    // Experience
    if (experiences.length > 0) {
      content += `<div class="section">
        <div class="section-title">EXPERIENCE</div>`
      experiences.forEach((exp) => {
        content += `<div class="experience-item">
          <div class="job-title">${exp.position}</div>
          <div class="company">${exp.company} <span class="date">${exp.startDate} - ${exp.current ? "Present" : exp.endDate}</span></div>
          ${exp.description ? `<div class="description">${exp.description}</div>` : ""}
        </div>`
      })
      content += `</div>`
    }

    // Education
    if (education.length > 0) {
      content += `<div class="section">
        <div class="section-title">EDUCATION</div>`
      education.forEach((edu) => {
        content += `<div class="education-item">
          <div class="job-title">${edu.degree} in ${edu.field}</div>
          <div class="company">${edu.institution} <span class="date">${edu.graduationDate}</span></div>
          ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ""}
        </div>`
      })
      content += `</div>`
    }

    // Skills
    if (skills.length > 0) {
      content += `<div class="section">
        <div class="section-title">SKILLS</div>
        <div class="skills">`
      skills.forEach((skill) => {
        content += `<span class="skill">${skill}</span>`
      })
      content += `</div></div>`
    }

    content += `</body></html>`
    return content
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Resume Preview</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <FileText className="mr-2 h-4 w-4" />
              Text
            </Button>
            <Button variant="outline" size="sm" onClick={downloadAsWord}>
              <Download className="mr-2 h-4 w-4" />
              Word
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-8 min-h-[600px] max-h-[800px] overflow-y-auto shadow-sm">
          {/* Header */}
          {personalInfo.fullName && (
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{personalInfo.fullName}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                {personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {personalInfo.location}
                  </div>
                )}
              </div>
              {(personalInfo.linkedin || personalInfo.website) && (
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
                  {personalInfo.linkedin && (
                    <div className="flex items-center">
                      <Linkedin className="h-4 w-4 mr-1" />
                      {personalInfo.linkedin}
                    </div>
                  )}
                  {personalInfo.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {personalInfo.website}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Professional Summary */}
          {summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">EXPERIENCE</h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600 italic">{exp.company}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    {exp.description && <p className="text-gray-700 leading-relaxed mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">EDUCATION</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600 italic">{edu.institution}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <p className="text-sm text-gray-500">{edu.graduationDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">SKILLS</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!personalInfo.fullName &&
            !summary &&
            experiences.length === 0 &&
            education.length === 0 &&
            skills.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Start filling out the form to see your resume preview</p>
                <p className="text-sm mt-2">Your resume will appear here as you add information</p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
