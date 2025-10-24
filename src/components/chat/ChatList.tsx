import React, { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { ChatMessage } from './ChatMessage'

interface ChatListProps {
  messages: Message[]
}

export const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Start a conversation by asking a question about the document.</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <ChatMessage key={message.id || index} message={message} />
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  )
}
