import { type NextRequest, NextResponse } from "next/server"
import { translateText } from "@/lib/translation"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const translatedText = await translateText(text, targetLanguage)

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ error: "Failed to translate text", details: (error as Error).message }, { status: 500 })
  }
}
