"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Loader2, Brain, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ResumeInputGuide } from "@/components/resume-input-guide"
import { EnhancedTextarea } from "@/components/enhanced-textarea"
import { Header } from "@/components/layout/header"

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
      setError(
        "PDF upload is currently disabled due to reliability issues. Please copy and paste your resume text in the text area below for the best analysis results.",
      )
      return
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
      console.log("Starting analysis...")

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim() || undefined,
        }),
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Analysis completed:", result)
        setAnalysis(result)
        setError("")
      } else {
        console.error("Response not OK:", response.status)
        throw new Error(`Server error (${response.status})`)
      }
    } catch (err) {
      console.error("Analysis error:", err)
      setError("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Sample resume for PHP developer
  const loadSampleResume = () => {
    const sampleText = `John Smith
PHP Laravel Developer
Email: john.smith@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced PHP Laravel developer with 4+ years building web applications. Led development of e-commerce platform serving 50k+ users and improved application performance by 35%.

EXPERIENCE
Senior PHP Developer | WebTech Solutions | 2021-2024
• Developed and maintained Laravel applications with 100k+ monthly users
• Built RESTful APIs using Laravel and integrated with Vue.js frontend
• Implemented MySQL database optimization reducing query time by 40%
• Led team of 3 junior developers and conducted code reviews
• Deployed applications using Docker and AWS EC2

PHP Developer | StartupCorp | 2020-2021
• Created responsive web applications using PHP, Laravel, HTML, CSS, JavaScript
• Collaborated with design team to implement user interfaces
• Integrated payment gateways and third-party APIs
• Optimized database queries improving response time by 25%

EDUCATION
Bachelor of Science in Computer Science | Tech University | 2020

SKILLS
PHP, Laravel, MySQL, JavaScript, Vue.js, HTML, CSS, Git, Docker, AWS, REST API, Composer, Bootstrap`

    setResumeText(sampleText)
    setError("")
  }

  // Sample Java job description
  const loadJavaJob = () => {
    const javaJob = `Senior Java Developer Position

We are looking for an experienced Java developer to join our team.

Requirements:
- 3+ years of Java development experience
- Strong knowledge of Spring Framework and Spring Boot
- Experience with Maven or Gradle build tools
- Proficiency in SQL and database design (MySQL, PostgreSQL)
- Knowledge of RESTful web services and microservices architecture
- Experience with Git version control
- Familiarity with Docker and containerization
- Understanding of Agile development methodologies
- Experience with JUnit testing framework
- Knowledge of AWS cloud services is a plus

Responsibilities:
- Develop and maintain Java applications using Spring Boot
- Design and implement RESTful APIs
- Work with databases and optimize SQL queries
- Collaborate with cross-functional teams
- Write unit tests and ensure code quality
- Deploy applications to cloud environments`

    setJobDescription(javaJob)
  }

  // Sample PHP job description
  const loadPHPJob = () => {
    const phpJob = `Senior PHP Laravel Developer Position

We are seeking a skilled PHP Laravel developer to join our development team.

Requirements:
- 3+ years of PHP development experience
- Strong expertise in Laravel framework
- Proficiency in MySQL database design and optimization
- Experience with JavaScript and Vue.js or React
- Knowledge of RESTful API development
- Familiarity with Git version control
- Experience with Docker and AWS deployment
- Understanding of Agile development practices
- Knowledge of Composer and package management
- Experience with HTML, CSS, and responsive design

Responsibilities:
- Develop and maintain Laravel web applications
- Build RESTful APIs and integrate with frontend frameworks
- Optimize database queries and application performance
- Collaborate with frontend developers and designers
- Deploy applications to cloud environments
- Conduct code reviews and mentor junior developers`

    setJobDescription(phpJob)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
              <ResumeInputGuide />

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
                    <Label htmlFor="resume-file">Upload Text File</Label>
                    <Input id="resume-file" type="file" accept=".txt" onChange={handleFileUpload} className="mt-1" />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">💡 Pro Tip</h4>
                    <p className="text-sm text-blue-800">
                      For the most accurate analysis, copy and paste your resume text directly. This ensures all
                      formatting and content is preserved correctly.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="resume-text">Or Paste Resume Text</Label>
                    <Button variant="outline" size="sm" onClick={loadSampleResume} type="button">
                      Try Sample Resume
                    </Button>
                  </div>
                  <EnhancedTextarea
                    value={resumeText}
                    onChange={setResumeText}
                    placeholder="Paste your resume content here..."
                    rows={10}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description (Optional)</CardTitle>
                  <CardDescription>Add a job description for targeted analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" onClick={loadJavaJob} type="button">
                      Load Java Job
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadPHPJob} type="button">
                      Load PHP Job
                    </Button>
                  </div>
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
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  analysis.jobMatchScore >= 70
                                    ? "bg-green-600"
                                    : analysis.jobMatchScore >= 50
                                      ? "bg-yellow-600"
                                      : "bg-red-600"
                                }`}
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
                    <p className="text-sm text-gray-400">
                      Try the "Load PHP Developer Resume" button to see how it works
                    </p>
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
