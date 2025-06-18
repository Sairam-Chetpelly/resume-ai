"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Target, TrendingUp, Shield, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { SkillRadarChart } from "@/components/charts/skill-radar-chart"

interface ATSAnalysis {
  atsScore: number
  formatStrengths: string[]
  formatIssues: string[]
  keywordDensity: number
  recommendations: string[]
  passesATS: boolean
}

interface IndustryAnalysis {
  detectedIndustry: string
  industryData: {
    keySkills: string[]
    averageSalary: string
    growthRate: string
    topCompanies: string[]
    trends: string[]
  }
  analysis: {
    skillCoverage: number
    presentSkills: string[]
    missingSkills: string[]
    industryFit: string
    recommendations: string[]
  }
  marketInsights: {
    salaryRange: string
    jobGrowth: string
    topEmployers: string[]
    emergingTrends: string[]
    competitiveness: string
    demandLevel: string
  }
}

export default function AdvancedAnalysisPage() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [targetIndustry, setTargetIndustry] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [atsAnalysis, setATSAnalysis] = useState<ATSAnalysis | null>(null)
  const [industryAnalysis, setIndustryAnalysis] = useState<IndustryAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("ats")

  const runATSAnalysis = async () => {
    if (!resumeText.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      if (response.ok) {
        const result = await response.json()
        setATSAnalysis(result)
      }
    } catch (error) {
      console.error("ATS analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const runIndustryAnalysis = async () => {
    if (!resumeText.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/industry-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetIndustry }),
      })

      if (response.ok) {
        const result = await response.json()
        setIndustryAnalysis(result)
      }
    } catch (error) {
      console.error("Industry analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
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
• Migrated legacy systems to microservices architecture

Software Engineer | StartupXYZ | 2019-2021
• Created responsive web applications using React, HTML, CSS, JavaScript
• Collaborated with product team to implement user-centered features
• Integrated third-party APIs and payment systems
• Optimized database queries reducing load time by 35%

EDUCATION
Bachelor of Science in Computer Science | Tech University | 2019

SKILLS
JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git, CI/CD, Microservices, REST APIs`)

    setJobDescription(`Senior Full Stack Developer Position

We are seeking an experienced Full Stack Developer to join our engineering team.

Requirements:
- 4+ years of software development experience
- Strong proficiency in JavaScript, React, and Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
- Knowledge of database design and optimization
- Familiarity with Docker and containerization
- Experience with CI/CD pipelines and DevOps practices
- Understanding of microservices architecture
- Strong problem-solving and communication skills

Responsibilities:
- Develop and maintain full-stack web applications
- Design and implement scalable backend services
- Collaborate with cross-functional teams
- Optimize application performance and scalability
- Mentor junior developers and conduct code reviews`)
  }

  const skillsData = industryAnalysis
    ? industryAnalysis.analysis.presentSkills.map((skill) => ({
        skill,
        level: Math.floor(Math.random() * 40) + 60, // Mock skill levels
      }))
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ResumeAI</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/analyze" className="text-gray-600 hover:text-gray-900">
              Basic Analysis
            </Link>
            <Link href="/resume-builder" className="text-gray-600 hover:text-gray-900">
              Resume Builder
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Resume Analysis</h2>
            <p className="text-gray-600">
              Get comprehensive insights with ATS scoring, industry analysis, and market intelligence
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume & Job Details</CardTitle>
                  <CardDescription>Provide your resume and target job information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="resume-text">Resume Text</Label>
                      <Button variant="outline" size="sm" onClick={loadSampleData}>
                        Load Sample
                      </Button>
                    </div>
                    <Textarea
                      id="resume-text"
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="job-description">Job Description (Optional)</Label>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description for targeted analysis..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="target-industry">Target Industry</Label>
                    <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Product Management">Product Management</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={runATSAnalysis} disabled={isAnalyzing || !resumeText.trim()} className="flex-1">
                      {isAnalyzing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Shield className="mr-2 h-4 w-4" />
                      )}
                      ATS Analysis
                    </Button>
                    <Button
                      onClick={runIndustryAnalysis}
                      disabled={isAnalyzing || !resumeText.trim()}
                      variant="outline"
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Target className="mr-2 h-4 w-4" />
                      )}
                      Industry Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ats">ATS Compatibility</TabsTrigger>
                  <TabsTrigger value="industry">Industry Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="ats" className="space-y-6">
                  {atsAnalysis ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            ATS Compatibility Score
                            {atsAnalysis.passesATS ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                ATS Friendly
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Needs Improvement
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">ATS Score</span>
                                <span className="font-bold text-2xl">{atsAnalysis.atsScore}/100</span>
                              </div>
                              <Progress value={atsAnalysis.atsScore} className="h-3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{atsAnalysis.keywordDensity}</div>
                                <div className="text-sm text-blue-800">Keywords Found</div>
                              </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {atsAnalysis.formatStrengths.length}
                                </div>
                                <div className="text-sm text-green-800">Format Strengths</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-green-600">Format Strengths</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {atsAnalysis.formatStrengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-red-600">Format Issues</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {atsAnalysis.formatIssues.map((issue, index) => (
                                <li key={index} className="flex items-start">
                                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-purple-600">ATS Optimization Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {atsAnalysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-purple-600 mr-2">•</span>
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <CardContent className="text-center">
                        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Run ATS analysis to see compatibility results</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="industry" className="space-y-6">
                  {industryAnalysis ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Industry Fit Analysis</CardTitle>
                          <CardDescription>
                            Detected Industry: <Badge variant="outline">{industryAnalysis.detectedIndustry}</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {industryAnalysis.analysis.skillCoverage}%
                              </div>
                              <div className="text-sm text-blue-800">Skill Coverage</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {industryAnalysis.analysis.industryFit}
                              </div>
                              <div className="text-sm text-green-800">Industry Fit</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {industryAnalysis.marketInsights.demandLevel}
                              </div>
                              <div className="text-sm text-purple-800">Market Demand</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Skills Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {skillsData.length > 0 && <SkillRadarChart skills={skillsData} className="mb-4" />}
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium text-green-600 mb-2">Present Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {industryAnalysis.analysis.presentSkills.map((skill) => (
                                    <Badge key={skill} variant="default" className="bg-green-100 text-green-800">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-orange-600 mb-2">Missing Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {industryAnalysis.analysis.missingSkills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="border-orange-300 text-orange-700">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Market Insights</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-1">Salary Range</h4>
                              <p className="text-2xl font-bold text-green-600">
                                {industryAnalysis.marketInsights.salaryRange}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Job Growth</h4>
                              <p className="text-lg font-semibold text-blue-600">
                                {industryAnalysis.marketInsights.jobGrowth}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Top Employers</h4>
                              <div className="flex flex-wrap gap-1">
                                {industryAnalysis.marketInsights.topEmployers.map((company) => (
                                  <Badge key={company} variant="outline">
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Emerging Trends</h4>
                              <ul className="text-sm space-y-1">
                                {industryAnalysis.marketInsights.emergingTrends.map((trend) => (
                                  <li key={trend} className="flex items-center">
                                    <TrendingUp className="h-3 w-3 text-purple-600 mr-2" />
                                    {trend}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-blue-600">Industry Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {industryAnalysis.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <CardContent className="text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Run industry analysis to see market insights</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
