import { FileText, Copy, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ResumeInputGuide() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          How to Input Your Resume
        </CardTitle>
        <CardDescription>Choose the best method for accurate analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center mb-2">
              <Copy className="h-4 w-4 text-green-600 mr-2" />
              <span className="font-medium text-green-900">Recommended: Copy & Paste</span>
            </div>
            <p className="text-sm text-green-800">
              Copy your resume text and paste it directly for the most accurate analysis.
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center mb-2">
              <Upload className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Text Files (.txt)</span>
            </div>
            <p className="text-sm text-blue-800">Upload plain text files for automatic processing.</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>PDF Support:</strong> PDF extraction is temporarily disabled for better performance. Please copy
            your resume text from your PDF and paste it in the text area below.
          </AlertDescription>
        </Alert>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Quick Steps for PDF Users:</h4>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Open your PDF resume</li>
            <li>Select all text (Ctrl+A or Cmd+A)</li>
            <li>Copy the text (Ctrl+C or Cmd+C)</li>
            <li>Paste it in the text area below</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
