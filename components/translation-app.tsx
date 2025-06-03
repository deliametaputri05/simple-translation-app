"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const languages = [
  { id: "zh", name: "Chinese" },
  { id: "ko", name: "Korean" },
  { id: "ja", name: "Japanese" },
]

export default function TranslationApp() {
  const [sourceText, setSourceText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("zh")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate")
      return
    }

    setError(null)
    setIsTranslating(true)
    setIsLoadingPrompt(true)

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage: targetLanguage,
        }),
      })

      setIsLoadingPrompt(false)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Translation failed")
      }

      const data = await response.json()
      setTranslatedText(data.translatedText)
    } catch (err) {
      setError(`Translation failed: ${(err as Error).message}`)
      console.error(err)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                English Text
              </label>
              <Textarea
                id="source"
                placeholder="Enter text to translate..."
                className="min-h-[120px]"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Translate to
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleTranslate} className="w-full bg-rose-600 hover:bg-rose-700" disabled={isTranslating}>
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoadingPrompt ? "Loading prompt..." : "Translating..."}
                </>
              ) : (
                "Translate"
              )}
            </Button>

            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </CardContent>
      </Card>

      {translatedText && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Translation ({languages.find((l) => l.id === targetLanguage)?.name})
              </label>
              <div className="p-4 bg-gray-50 rounded-md min-h-[120px] whitespace-pre-wrap">{translatedText}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
