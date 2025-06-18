"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, CheckCircle, X, Trophy, Target, Sparkles, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"

interface Question {
  question: string
  options: string[]
  correct: number
  difficulty: string
}

interface AssessmentResult {
  skill: string
  score: number
  level: string
  correct: number
  total: number
  recommendations: string[]
}

const AVAILABLE_SKILLS = ["JavaScript", "React", "Python", "Node.js", "SQL", "TypeScript", "CSS"]

export default function SkillAssessmentPage() {
  const [selectedSkill, setSelectedSkill] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useAI, setUseAI] = useState(false) // Default to false to avoid quota issues
  const [error, setError] = useState("")
  const [questionSource, setQuestionSource] = useState<"ai" | "static">("static")
  const [aiAvailable, setAiAvailable] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Check AI availability on component mount
  useEffect(() => {
    checkAiAvailability()
  }, [])

  const checkAiAvailability = async () => {
    try {
      const response = await fetch("/api/skill-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "JavaScript", useAI: true }),
      })

      const data = await response.json()

      if (data.aiAvailable === false) {
        setAiAvailable(false)
        setAiError(data.aiError || "AI generation unavailable")
        setUseAI(false) // Force disable AI if not available
      } else {
        setAiAvailable(true)
        setAiError(null)
      }
    } catch (error) {
      console.error("Failed to check AI availability:", error)
      setAiAvailable(false)
      setUseAI(false)
    }
  }

  const startAssessment = async (skill: string) => {
    setIsLoading(true)
    setError("")

    try {
      console.log(`Starting assessment for ${skill} with AI: ${useAI}`)

      const response = await fetch("/api/skill-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, useAI: useAI && aiAvailable }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log(`Received ${data.questions?.length || 0} questions, source: ${data.source}`)

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions received from server")
      }

      setQuestions(data.questions)
      setQuestionSource(data.source || "static")
      setSelectedSkill(skill)
      setCurrentQuestion(0)
      setAnswers([])
      setSelectedAnswer(null)
      setShowResult(false)

      // Update AI availability if it changed
      if (data.aiAvailable === false && aiAvailable) {
        setAiAvailable(false)
        setAiError(data.aiError || "AI generation unavailable")
      }
    } catch (error) {
      console.error("Failed to load questions:", error)
      setError(`Failed to load questions: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishAssessment(newAnswers)
    }
  }

  const finishAssessment = async (finalAnswers: number[]) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/skill-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: selectedSkill, answers: finalAnswers }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      setResult(result)
      setShowResult(true)
    } catch (error) {
      console.error("Failed to submit assessment:", error)
      setError(`Failed to submit assessment: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const resetAssessment = () => {
    setSelectedSkill("")
    setQuestions([])
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
    setResult(null)
    setError("")
    setQuestionSource("static")
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button onClick={resetAssessment}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                </div>
                <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
                <CardDescription>
                  Here are your {result.skill} assessment results
                  <Badge variant="outline" className="ml-2">
                    {questionSource === "ai" ? (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </>
                    ) : (
                      "Curated Questions"
                    )}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{result.score}%</div>
                  <Badge
                    variant={
                      result.level === "Advanced"
                        ? "default"
                        : result.level === "Intermediate"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-lg px-4 py-1"
                  >
                    {result.level}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {result.correct}/{result.total} correct
                    </span>
                  </div>
                  <Progress value={result.score} className="h-3" />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button onClick={resetAssessment} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Take Another Assessment
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/analyze">Analyze Resume</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length > 0 && !showResult) {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  {selectedSkill} Assessment
                  <Badge variant="outline" className="ml-2">
                    {questionSource === "ai" ? (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generated
                      </>
                    ) : (
                      "Curated"
                    )}
                  </Badge>
                </h2>
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{question.question}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="capitalize">
                    {question.difficulty}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full p-4 text-left border rounded-lg transition-colors ${
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                        >
                          {selectedAnswer === index && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={resetAssessment}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={submitAnswer} disabled={selectedAnswer === null || isLoading}>
                    {currentQuestion + 1 === questions.length ? "Finish Assessment" : "Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Skill Assessment</h2>
            <p className="text-gray-600 mb-4">
              Test your knowledge with our curated questions and get personalized recommendations
            </p>

            {aiAvailable ? (
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="useAI" className="text-sm font-medium">
                    Use AI-Generated Questions
                  </label>
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            ) : (
              <Alert className="mb-6 max-w-lg mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">AI question generation is currently unavailable.</span>
                  {aiError && <span className="block text-sm mt-1 text-gray-500">{aiError}</span>}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Alert className="mb-8">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              {useAI && aiAvailable ? (
                <>
                  <strong>AI Mode:</strong> Each assessment features unique, dynamically generated questions tailored to
                  test your understanding of key concepts. Questions are created fresh every time!
                </>
              ) : (
                <>
                  <strong>Standard Mode:</strong> Assessment uses our curated question bank with proven questions
                  designed to evaluate your understanding of key concepts.
                </>
              )}
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_SKILLS.map((skill) => (
              <Card key={skill} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {skill}
                    <div className="flex gap-1">
                      <Badge variant="outline">Quiz</Badge>
                      {useAI && aiAvailable && (
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Test your {skill} knowledge with {useAI && aiAvailable ? "AI-generated" : "curated"} questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => startAssessment(skill)} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {useAI && aiAvailable ? "Generating Questions..." : "Loading..."}
                      </>
                    ) : (
                      "Start Assessment"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Enhanced Assessment Features</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {aiAvailable && (
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-medium mb-2">AI-Generated Questions</h4>
                  <p className="text-sm text-gray-600">
                    Fresh, unique questions generated for each assessment using advanced AI
                  </p>
                </div>
              )}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-medium mb-2">Adaptive Difficulty</h4>
                <p className="text-sm text-gray-600">
                  Questions span beginner to advanced levels to accurately assess your skills
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <Brain className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-medium mb-2">Smart Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Get personalized learning paths based on your performance and skill gaps
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <RefreshCw className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-medium mb-2">Varied Question Bank</h4>
                <p className="text-sm text-gray-600">
                  Extensive library of questions covering all aspects of each technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
