import { NextRequest, NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  const configuration = new Configuration({
    // organization: 'org-*',
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant who speaks Japanese Kansai dialect.',
      },
      ...messages,
    ],
  })
  return NextResponse.json({ message: completion.data.choices[0].message })
}
