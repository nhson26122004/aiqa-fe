import React, { useState } from 'react'
import { Button } from '../common/Button'

interface ChatInputProps {
  onSubmit: (text: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, disabled = false }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={disabled || !input.trim()}>
          Send
        </Button>
      </div>
    </form>
  )
}
