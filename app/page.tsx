'use client'

import { useEffect, useRef, useState } from 'react'
import { CreateChatCompletionRequest } from 'openai'

export default function Home() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<
    CreateChatCompletionRequest['messages']
  >([])
  const [isTyping, setIsTyping] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current!.focus()
  }, [])

  function handleClear() {
    setMessages([])
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value)
    textareaRef.current!.style.height = 'auto'
    textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight}px`
  }

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    setError('')
    setIsTyping(true)

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: text }],
      }),
    })
    const data = await response.json()

    if (response.ok) {
      setMessages([
        ...messages,
        { role: 'user', content: text },
        { role: 'assistant', content: data.message.content },
      ])
      setText('')
    } else {
      setError(data.error)
    }
    setIsTyping(false)
  }

  return (
    <main className="relative mx-auto max-w-3xl px-4">
      <h1 className="my-8 text-center text-4xl">ChatGPT Next.js App Router</h1>
      <div
        style={{
          marginBottom: `${
            textareaRef.current ? textareaRef.current.scrollHeight + 100 : 0
          }px`,
        }}
      >
        {messages.length > 0 && (
          <div className="space-y-1">
            {messages.map((message, index) => (
              <div key={index} className="flex space-x-2">
                <div>{message.role === 'user' ? '👤' : '🤖'}</div>
                <div className={message.role === 'user' ? 'text-blue-400' : ''}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
        {isTyping && <div className="mt-1">typing...</div>}
        {error && <div className="mt-1 text-red-500">{error}</div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto flex max-w-3xl justify-center px-4 pb-8 pt-4">
        <div className="flex w-full items-end space-x-2">
          <button
            onClick={handleClear}
            className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-500"
          >
            Clear
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            className="w-full resize-none overflow-hidden rounded px-2 py-1 text-gray-900 focus:outline-0"
          />
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  )
}
