"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/layout/header"
import { FileText, Loader2, Download, Copy, CheckCircle, Lightbulb } from "lucide-react"

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [position, setPosition] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [tips, setTips] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generateCoverLetter = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert("Please provide both resume text and job description")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          companyName,
          position,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCoverLetter(result.coverLetter)
        setTips(result.tips)
      } else {
        throw new Error("Failed to generate cover letter")
      }
    } catch (error) {
      console.error("Cover letter generation failed:", error)
      alert("Failed to generate cover letter. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const downloadCoverLetter = () => {
    if (!coverLetter) return

    const blob = new Blob([coverLetter], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${companyName || "Company"}_Cover_Letter.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleData = () => {
    setResumeText(`John Smith
Senior Software Engineer
Email: john.smith@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing scalable web applications. Led development of microservices architecture serving 1M+ users. Expert in JavaScript, React, Node.js, and cloud technologies.

EXPERIENCE
Senior Software Engineer | TechCorp | 2021-2024
• Developed and maintained React applications with 500k+ monthly active users
• Built RESTful APIs using Node.js and Express, improving response time by 40%
• Implemented CI/CD pipelines using Docker and AWS, reducing deployment time by 60%
• Led team of 4 developers and conducted code reviews

SKILLS
JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL`)

    setJobDescription(`Senior Full Stack Developer Position

We are seeking an experienced Full Stack Developer to join our engineering team.

Requirements:
- 4+ years of software development experience
- Strong proficiency in JavaScript, React, and Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
- Knowledge of database design and optimization
- Familiarity with Docker and containerization
- Experience with CI/CD pipelines and DevOps practices

Responsibilities:
- Develop and maintain full-stack web applications
- Design and implement scalable backend services
- Collaborate with cross-functional teams
- Optimize application performance and scalability`)

    setCompanyName("TechInnovate Inc.")
    setPosition("Senior Full Stack Developer")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Cover Letter Generator</h2>
            <p className="text-gray-600">Create personalized cover letters tailored to specific job opportunities</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>Provide information about the position you're applying for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="e.g., Google, Microsoft"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position Title</Label>
                      <Input
                        id="position"
                        placeholder="e.g., Senior Software Engineer"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume Text</CardTitle>
                  <CardDescription>Paste your resume content for personalization</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={8}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                  <CardDescription>Paste the job posting to tailor your cover letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                  />
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={loadSampleData} variant="outline" className="flex-1">
                  Load Sample Data
                </Button>
                <Button
                  onClick={generateCoverLetter}
                  disabled={isGenerating || !resumeText.trim() || !jobDescription.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {coverLetter ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Generated Cover Letter</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            {copied ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadCoverLetter}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white border rounded-lg p-6 whitespace-pre-line font-mono text-sm max-h-96 overflow-y-auto">
                        {coverLetter}
                      </div>
                    </CardContent>
                  </Card>

                  {tips.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-amber-600">
                          <Lightbulb className="mr-2 h-5 w-5" />
                          Writing Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {tips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-600 mr-2">•</span>
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your generated cover letter will appear here</p>
                    <p className="text-sm text-gray-400">
                      Fill in the job details and click "Generate Cover Letter" to get started
                    </p>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Review and customize the generated cover letter to match your personal
                  writing style and add specific examples from your experience.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
