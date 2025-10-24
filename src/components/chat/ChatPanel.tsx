import React, { useState, useEffect } from 'react'
import { useConversations } from '@/hooks/useConversations'
import { ChatInput } from './ChatInput'
import { ChatList } from './ChatList'
import { ConversationSelect } from './ConversationSelect'
import { Alert } from '../common/Alert'
import { useRecoilValue } from 'recoil'
import { chatErrorAtom } from '@/atoms/chatAtom'
import { fetchEventSource } from '@microsoft/fetch-event-source'

interface ChatPanelProps {
  documentId: string
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ documentId }) => {
  const [useStreaming, setUseStreaming] = useState(localStorage.getItem('streaming') === 'true')
  const [isStreaming, setIsStreaming] = useState(false)
  const [localMessages, setLocalMessages] = useState<any[]>([])

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    sendMessageAsync,
    isSending,
  } = useConversations(documentId)

  const error = useRecoilValue(chatErrorAtom)

  // Use local messages if available, otherwise fall back to activeConversation messages
  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const displayMessages =
    localMessages.length > 0 ? localMessages : activeConversation?.messages || []

  // Reset local messages when activeConversationId changes
  useEffect(() => {
    setLocalMessages([])
  }, [activeConversationId])

  useEffect(() => {
    localStorage.setItem('streaming', useStreaming ? 'true' : '')
  }, [useStreaming])

  const handleSubmit = async (text: string) => {
    if (!activeConversationId) return

    if (useStreaming) {
      // Add pending message to local state immediately
      const tempId = Date.now().toString()
      const newMessages = [
        ...displayMessages,
        { id: tempId, role: 'user' as const, content: text },
        { id: `${tempId}-pending`, role: 'pending' as const, content: 'Thinking...' },
      ]
      setLocalMessages(newMessages)

      setIsStreaming(true)
      let accumulatedResponse = ''

      try {
        await fetchEventSource(`/api/conversations/${activeConversationId}/messages?stream=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ input: text }),
          onmessage(ev) {
            if (ev.data === '[DONE]') {
              // Remove pending message from local state
              setLocalMessages((messages) => messages.filter((m) => m.role !== 'pending'))
              setIsStreaming(false)
              return
            }

            const data = JSON.parse(ev.data)
            if (data.content) {
              accumulatedResponse += data.content
              // Update assistant message in local state
              setLocalMessages((messages) => {
                const filteredMessages = messages.filter((m) => m.role !== 'pending')
                const lastMessage = filteredMessages[filteredMessages.length - 1]
                if (lastMessage?.role === 'assistant' && !lastMessage.id) {
                  // Update existing assistant message
                  return [
                    ...filteredMessages.slice(0, -1),
                    { ...lastMessage, content: accumulatedResponse },
                  ]
                } else {
                  // Add new assistant message
                  return [
                    ...filteredMessages,
                    { role: 'assistant' as const, content: accumulatedResponse },
                  ]
                }
              })
            }
          },
          onerror(err) {
            console.error('Streaming error:', err)
            setIsStreaming(false)
            throw err
          },
        })
      } catch (error) {
        console.error('Chat error:', error)
        setIsStreaming(false)
        // Remove pending message on error from local state
        setLocalMessages((messages) => messages.filter((m) => m.role !== 'pending'))
      }
    } else {
      // Non-streaming
      // Add user message to local state immediately
      const tempId = Date.now().toString()
      const newMessages = [...displayMessages, { id: tempId, role: 'user' as const, content: text }]
      setLocalMessages(newMessages)

      try {
        const response = await sendMessageAsync({
          conversationId: activeConversationId,
          input: text,
          stream: false,
        })

        // Add assistant response to local state
        setLocalMessages((messages) => [
          ...messages,
          { role: 'assistant' as const, content: response.content },
        ])
      } catch (error) {
        console.error('Send message error:', error)
        // Remove user message on error from local state
        setLocalMessages((messages) => messages.filter((m) => m.id !== tempId))
      }
    }
  }

  const handleNewChat = () => {
    createConversation()
  }

  return (
    <div
      style={{ height: 'calc(100vh - 80px)' }}
      className="flex flex-col bg-slate-50 border rounded-xl shadow"
    >
      <div className="rounded-lg border-b px-3 py-2 flex flex-row items-center justify-between">
        <div className="opacity-40">
          <input
            id="chat-type"
            type="checkbox"
            checked={useStreaming}
            onChange={(e) => setUseStreaming(e.target.checked)}
          />
          <label htmlFor="chat-type" className="italic ml-2">
            Streaming
          </label>
        </div>
        <div className="flex gap-2">
          {activeConversationId && (
            <ConversationSelect
              conversations={conversations}
              activeId={activeConversationId}
              onChange={setActiveConversationId}
            />
          )}
          <button
            className="rounded text-sm border border-blue-500 px-2 py-0.5"
            onClick={handleNewChat}
          >
            New Chat
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        {error && error.length < 200 && (
          <div className="p-4">
            <Alert type="error" onDismiss={() => {}}>
              {error}
            </Alert>
          </div>
        )}
        <ChatList messages={displayMessages} />
        <ChatInput onSubmit={handleSubmit} disabled={isSending || isStreaming} />
      </div>
    </div>
  )
}
