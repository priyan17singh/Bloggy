import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

// Helper: delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function generateSummary(title, body, retries = 2) {
  const modelName = 'gemini-flash-latest'
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const prompt = `Generate a concise ~50-word summary for this blog post:\n\nTitle: ${title}\n\nContent: ${body.substring(0, 3000)}\n\nSummary:`
      const result = await model.generateContent(prompt)
      const summary = result.response.text()
      return summary.slice(0, 400)
    } catch (error) {
      // If rate limited (429), wait and retry
      if (error.status === 429 && attempt < retries) {
        console.log(`Rate limited, retrying in ${(attempt + 1) * 2} seconds...`)
        await delay((attempt + 1) * 2000) // 2s, 4s
        continue
      }
      console.error('Gemini API error:', error)
      // Fallback summary from content (no API)
      const cleanBody = body.replace(/<[^>]*>/g, '').trim()
      let fallback = cleanBody.slice(0, 350)
      if (cleanBody.length > 350) fallback += '...'
      return `📝 (Auto-generated) ${fallback}`
    }
  }
  // Final fallback
  return 'Summary temporarily unavailable due to high demand. Please refresh.'
}