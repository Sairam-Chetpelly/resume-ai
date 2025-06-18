"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Loader2, Brain, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface AnalysisResult {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  skillsFound: string[]
  missingSkills: string[]
  recommendations: string[]
  jobMatchScore: number
}

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExtractingPdf, setIsExtractingPdf] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type === "application/pdf") {
      setIsExtractingPdf(true)
      setError("")

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          setResumeText(result.text)
          setError("PDF text extracted successfully. Please review and edit the text below if needed.")
        } else {
          setError(result.error || "Failed to extract text from PDF")
        }
      } catch (err) {
        console.error("PDF extraction error:", err)
        setError("Failed to process PDF file. Please try copying and pasting the text manually.")
      } finally {
        setIsExtractingPdf(false)
      }
    } else if (file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setResumeText(text)
        setError("")
      }
      reader.readAsText(file)
    } else {
      setError("Please upload a PDF or text file")
    }
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please provide your resume text")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalysis(null)

    try {
      console.log("=== Starting Resume Analysis ===")
      console.log("Resume text length:", resumeText.length)
      console.log("Job description length:", jobDescription.length)

      const requestBody = {
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim() || undefined,
      }

      console.log("Sending request to API...")

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("API response status:", response.status)
      console.log("API response headers:", Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        console.log("Response OK, parsing JSON...")
        const result = await response.json()
        console.log("Analysis result received:", result)

        if (result.error) {
          throw new Error(result.error)
        }

        setAnalysis(result)
        setError("")
        console.log("✓ Analysis completed successfully")
      } else {
        console.error("Response not OK:", response.status)

        let errorMessage = `Server error (${response.status})`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          console.error("Error response data:", errorData)
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError)
          const textResponse = await response.text()
          console.error("Raw error response:", textResponse)
        }

        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error("=== Analysis Error ===", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze resume"
      setError(`${errorMessage}. Please try again.`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Sample resume text for testing
  const loadSampleResume = () => {
    const sampleText = `John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing web applications using JavaScript, React, and Node.js. Led team of 4 developers and increased application performance by 40%.

EXPERIENCE
Senior Software Engineer | Tech Company | 2020-2024
• Developed and maintained React applications serving 100k+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Led code reviews and mentored junior developers
• Built RESTful APIs using Node.js and Express

Software Engineer | StartupCo | 2018-2020
• Created responsive web applications using HTML, CSS, JavaScript
• Collaborated with design team to implement user interfaces
• Optimized database queries improving response time by 25%

EDUCATION
Bachelor of Science in Computer Science | University Name | 2018

SKILLS
JavaScript, React, Node.js, Python, SQL, Git, Docker, AWS, MongoDB, HTML, CSS`

    setResumeText(sampleText)
    setError("")
    console.log("Sample resume loaded")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ResumeAI</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resume Analysis</h2>
            <p className="text-gray-600">
              Upload your resume and get AI-powered insights to improve your job prospects
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Resume Input
                  </CardTitle>
                  <CardDescription>Upload a PDF/text file or paste your resume text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resume-file">Upload Resume File (PDF or TXT)</Label>
                    <Input
                      id="resume-file"
                      type="file"
                      accept=".txt,.pdf"
                      onChange={handleFileUpload}
                      className="mt-1"
                      disabled={isExtractingPdf}
                    />
                    {isExtractingPdf && (
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting text from PDF...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="resume-text">Or Paste Resume Text</Label>
                    <Button variant="outline" size="sm" onClick={loadSampleResume} type="button">
                      Load Sample Resume
                    </Button>
                  </div>
                  <Textarea
                    id="resume-text"
                    placeholder="Paste your resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={10}
                    className="mt-1"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description (Optional)</CardTitle>
                  <CardDescription>Add a job description for targeted analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the job description you're targeting..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                  />
                </CardContent>
              </Card>

              {/* Status Messages */}
              {error && !error.includes("PDF") && !error.includes("extracted successfully") && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {error && (error.includes("PDF") || error.includes("extracted successfully")) && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={analyzeResume} disabled={isAnalyzing || !resumeText.trim()} className="w-full" size="lg">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div>
              {analysis ? (
                <div className="space-y-6">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Analysis Complete:</strong> Your resume has been thoroughly analyzed using advanced AI
                      algorithms.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Overall Score:</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${analysis.overallScore}%` }}
                            ></div>
                          </div>
                          <span className="font-bold">{analysis.overallScore}/100</span>
                        </div>
                      </div>

                      {jobDescription && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Job Match:</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${analysis.jobMatchScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold">{analysis.jobMatchScore}/100</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Skills Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skillsFound.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {analysis.missingSkills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-orange-600">Suggested Skills to Add</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-purple-600">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Upload your resume to see analysis results here</p>
                    <p className="text-sm text-gray-400">Try the "Load Sample Resume" button to see how it works</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
