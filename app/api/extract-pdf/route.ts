import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    try {
      // Simple PDF text extraction using basic parsing
      const text = await extractTextFromPDF(uint8Array)

      if (text && text.length > 20) {
        return NextResponse.json({
          text: text,
          success: true,
          method: "basic_extraction",
        })
      } else {
        throw new Error("No readable text found")
      }
    } catch (pdfError) {
      console.error("PDF extraction failed:", pdfError)

      return NextResponse.json(
        {
          error:
            "Could not extract text from PDF. This might be a scanned document or have complex formatting. Please copy and paste the text manually.",
          success: false,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("PDF processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process PDF file",
        success: false,
      },
      { status: 500 },
    )
  }
}

async function extractTextFromPDF(buffer: Uint8Array): Promise<string> {
  // Convert buffer to string for basic text extraction
  const pdfString = new TextDecoder("latin1").decode(buffer)

  // Look for text objects in PDF
  const textRegex = /BT\s*(.*?)\s*ET/gs
  const streamRegex = /stream\s*(.*?)\s*endstream/gs
  const textContentRegex = /$$(.*?)$$/g
  const tjRegex = /\[(.*?)\]/g

  let extractedText = ""
  const textLines: string[] = []

  // Method 1: Extract from BT...ET blocks (text objects)
  let match
  while ((match = textRegex.exec(pdfString)) !== null) {
    const textBlock = match[1]

    // Extract text from parentheses
    let textMatch
    while ((textMatch = textContentRegex.exec(textBlock)) !== null) {
      const text = textMatch[1]
      if (text && text.length > 0) {
        textLines.push(cleanPDFText(text))
      }
    }

    // Extract text from TJ arrays
    while ((textMatch = tjRegex.exec(textBlock)) !== null) {
      const arrayContent = textMatch[1]
      const parts = arrayContent.split(/\s+/)
      for (const part of parts) {
        if (part.startsWith("(") && part.endsWith(")")) {
          const text = part.slice(1, -1)
          if (text && text.length > 0) {
            textLines.push(cleanPDFText(text))
          }
        }
      }
    }
  }

  // Method 2: Extract from streams
  while ((match = streamRegex.exec(pdfString)) !== null) {
    const streamContent = match[1]

    // Look for readable text patterns
    const readableText = streamContent.match(/[A-Za-z][A-Za-z0-9\s@.,\-_()]{3,}/g)
    if (readableText) {
      for (const text of readableText) {
        if (text.trim().length > 3) {
          textLines.push(cleanPDFText(text.trim()))
        }
      }
    }
  }

  // Method 3: Simple text extraction for basic PDFs
  if (textLines.length === 0) {
    const simpleTextRegex = /[A-Za-z][A-Za-z0-9\s@.,\-_()]{10,}/g
    const matches = pdfString.match(simpleTextRegex)
    if (matches) {
      for (const match of matches) {
        const cleaned = cleanPDFText(match)
        if (cleaned.length > 5 && !cleaned.includes("obj") && !cleaned.includes("endobj")) {
          textLines.push(cleaned)
        }
      }
    }
  }

  // Remove duplicates and join
  const uniqueLines = [...new Set(textLines)]
  extractedText = uniqueLines.join("\n")

  // Clean up the final text
  extractedText = extractedText
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim()

  return extractedText
}

function cleanPDFText(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\(.)/g, "$1")
    .replace(/[^\x20-\x7E\n\r\t]/g, "")
    .trim()
}
