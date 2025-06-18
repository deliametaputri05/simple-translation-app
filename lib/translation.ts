import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Create OpenAI provider with explicit API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// GitHub Gist URLs for translation prompts
const PROMPT_URLS = {
  ja: "https://gist.githubusercontent.com/etalasaccounts/da89693d82c63326b4751f3030e61dfd/raw",
  zh: "https://gist.githubusercontent.com/etalasaccounts/e7effd8f7789fa92a4bfa76685665e52/raw",
  ko: "https://gist.githubusercontent.com/etalasaccounts/42a46f928bcae38b9ca1f47b6e95b48f/raw",
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
