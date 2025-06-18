import { type NextRequest, NextResponse } from "next/server"

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Please use a PDF under 5MB or copy-paste the text manually." },
        { status: 400 },
      )
    }

    // For now, return a helpful message suggesting manual text input
    // This is more reliable than trying to parse complex PDFs
    return NextResponse.json(
      {
        error:
          "PDF text extraction is temporarily unavailable. Please copy and paste your resume text manually for the best results.",
        success: false,
        suggestion: "manual_input",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("PDF processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process PDF file. Please copy and paste your resume text manually.",
        success: false,
        suggestion: "manual_input",
      },
      { status: 500 },
    )
  }
}
