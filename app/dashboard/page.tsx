"use client"

import { useState } from "react"
import { Brain, FileText, TrendingUp, Users, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/components/layout/header"

interface AnalysisHistory {
  id: string
  date: string
  fileName: string
  overallScore: number
  jobMatchScore?: number
  status: "completed" | "processing" | "failed"
}

export default function DashboardPage() {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([
    {
      id: "1",
      date: "2024-01-15",
      fileName: "Software_Engineer_Resume.pdf",
      overallScore: 85,
      jobMatchScore: 78,
      status: "completed",
    },
    {
      id: "2",
      date: "2024-01-10",
      fileName: "Frontend_Developer_Resume.pdf",
      overallScore: 72,
      jobMatchScore: 65,
      status: "completed",
    },
    {
      id: "3",
      date: "2024-01-08",
      fileName: "Full_Stack_Resume.pdf",
      overallScore: 90,
      status: "completed",
    },
  ])

  const stats = {
    totalAnalyses: analysisHistory.length,
    averageScore: Math.round(
      analysisHistory.reduce((acc, item) => acc + item.overallScore, 0) / analysisHistory.length,
    ),
    bestScore: Math.max(...analysisHistory.map((item) => item.overallScore)),
    improvementTrend: "+12%",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Track your resume improvement journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">Resumes analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}/100</div>
              <p className="text-xs text-muted-foreground">Across all resumes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bestScore}/100</div>
              <p className="text-xs text-muted-foreground">Your highest score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.improvementTrend}</div>
              <p className="text-xs text-muted-foreground">From last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>View and manage your previous resume analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisHistory.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{analysis.fileName}</h4>
                      <p className="text-sm text-gray-500">
                        Analyzed on {new Date(analysis.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">Score: {analysis.overallScore}/100</div>
                      {analysis.jobMatchScore && (
                        <div className="text-sm text-gray-500">Job Match: {analysis.jobMatchScore}/100</div>
                      )}
                    </div>

                    <Badge variant={analysis.status === "completed" ? "default" : "secondary"}>{analysis.status}</Badge>

                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/analyze">
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze New Resume
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Improvement Tips
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Compare with Industry Standards
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Add more quantified achievements</p>
                  <p className="text-xs text-blue-700">Resumes with metrics get 40% more interviews</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Your technical skills section improved</p>
                  <p className="text-xs text-green-700">+15 points from your last analysis</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-900">Consider adding cloud certifications</p>
                  <p className="text-xs text-orange-700">High demand skill in your field</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
