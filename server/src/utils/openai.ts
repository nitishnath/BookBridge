import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not defined in environment variables')
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

// Generate book summary
export const generateBookSummary = async (content: string): Promise<string> => {
  try {
    // Limit content length to avoid token limit issues
    const truncatedContent = content.slice(0, 15000)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes books concisely.'
        },
        {
          role: 'user',
          content: `Please provide a comprehensive summary of the following book content, highlighting key themes, major plot points, and important insights. Keep the summary concise but informative:\n\n${truncatedContent}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.5
    })

    return response.choices[0]?.message?.content || 'Summary could not be generated.'
  } catch (error) {
    console.error('Error generating summary:', error)
    return 'Error generating summary. Please try again later.'
  }
} 