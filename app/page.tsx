import { Upload, Brain, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ResumeAI</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/analyze" className="text-gray-600 hover:text-gray-900">
              Analyze Resume
            </Link>
            <Link href="/advanced-analysis" className="text-gray-600 hover:text-gray-900">
              Advanced Analysis
            </Link>
            <Link href="/resume-builder" className="text-gray-600 hover:text-gray-900">
              Resume Builder
            </Link>
            <Link href="/cover-letter" className="text-gray-600 hover:text-gray-900">
              Cover Letter
            </Link>
            <Link href="/skill-assessment" className="text-gray-600 hover:text-gray-900">
              Skill Assessment
            </Link>
            <Button asChild>
              <Link href="/analyze">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">AI-Powered Resume Analysis</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your resume and get instant AI-powered feedback, skill analysis, and personalized recommendations to
            land your dream job.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-3">
            <Link href="/analyze">
              <Upload className="mr-2 h-5 w-5" />
              Analyze Your Resume
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Smart Analysis</CardTitle>
                <CardDescription>AI-powered resume analysis with ATS scoring and industry insights</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>
                  Build professional resumes with guided templates and real-time preview
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Skill Assessment</CardTitle>
                <CardDescription>Test your knowledge and get personalized learning recommendations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Industry Insights</CardTitle>
                <CardDescription>Market analysis, salary insights, and trending skills in your field</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose ResumeAI?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Target className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Skill Gap Analysis</h4>
                    <p className="text-gray-600">Identify missing skills for your target roles</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Brain className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">AI-Powered Insights</h4>
                    <p className="text-gray-600">Get intelligent recommendations based on industry trends</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Instant Results</h4>
                    <p className="text-gray-600">Receive detailed analysis in seconds</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-4">Ready to improve your resume?</h4>
              <p className="text-gray-600 mb-6">
                Join thousands of job seekers who have improved their resumes with AI-powered analysis.
              </p>
              <Button asChild className="w-full">
                <Link href="/analyze">Start Analysis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-lg font-semibold">ResumeAI</span>
          </div>
          <p className="text-gray-400">Powered by AI to help you land your dream job</p>
        </div>
      </footer>
    </div>
  )
}
