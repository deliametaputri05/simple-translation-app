import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Create OpenAI provider with explicit API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// GitHub Gist URLs for translation prompts
const PROMPT_URLS = {
  ja: "https://gist.githubusercontent.com/eresytter/aaad090927b325ab7e19c0036b714330/raw",
  zh: "https://gist.githubusercontent.com/eresytter/bb712687dc2a143c653aa092577c84bd/raw",
  ko: "https://gist.githubusercontent.com/eresytter/7152f6eec7e71fdb29e5000b40418d2f/raw",
}

// Cache for prompts to avoid fetching them repeatedly
const promptCache: Record<string, string> = {}

/**
 * Fetches a translation prompt from GitHub
 */
async function fetchPrompt(language: string): Promise<string> {
  // Return cached prompt if available
  if (promptCache[language]) {
    return promptCache[language]
  }

  const url = PROMPT_URLS[language as keyof typeof PROMPT_URLS]
  if (!url) {
    throw new Error(`No prompt URL available for language: ${language}`)
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt: ${response.statusText}`)
    }

    const prompt = await response.text()
    promptCache[language] = prompt
    return prompt
  } catch (error) {
    console.error(`Error fetching prompt for ${language}:`, error)
    throw new Error(`Failed to fetch translation prompt for ${language}`)
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    // Fetch the prompt from GitHub
    const prompt = await fetchPrompt(targetLanguage)

    const { text: translatedText } = await generateText({
      model: openai("gpt-4o"),
      system: prompt,
      prompt: text,
    })

    return translatedText
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error("Failed to translate text")
  }
}
