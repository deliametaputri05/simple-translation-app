import TranslationApp from "@/components/translation-app"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-rose-50 to-white">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-600">Wedding Translation</h1>
          <p className="text-gray-600 mt-2">Translate your wedding messages with ease</p>
        </div>
        <TranslationApp />
      </div>
    </main>
  )
}
