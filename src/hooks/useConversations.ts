import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationsApi } from '@/api/conversations'
import { getErrorMessage } from '@/api/axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { conversationsAtom, activeConversationIdAtom, chatErrorAtom } from '@/atoms/chatAtom'
import { useEffect } from 'react'

export const useConversations = (pdfId: string) => {
  const queryClient = useQueryClient()
  const [conversations, setConversations] = useRecoilState(conversationsAtom)
  const [activeConversationId, setActiveConversationId] = useRecoilState(activeConversationIdAtom)
  const setError = useSetRecoilState(chatErrorAtom)

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['conversations', pdfId],
    queryFn: () => conversationsApi.list(pdfId),
    enabled: !!pdfId,
  })

  const createMutation = useMutation({
    mutationFn: () => conversationsApi.create(pdfId),
    onSuccess: (data) => {
      setConversations([data, ...conversations])
      setActiveConversationId(data.id)
      queryClient.invalidateQueries({ queryKey: ['conversations', pdfId] })
    },
    onError: (error) => {
      setError(getErrorMessage(error))
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({
      conversationId,
      input,
      stream,
    }: {
      conversationId: string
      input: string
      stream: boolean
    }) => conversationsApi.sendMessage(conversationId, input, stream),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', pdfId] })
    },
    onError: (error) => {
      setError(getErrorMessage(error))
    },
  })

  // Reset activeConversationId when pdfId changes
  useEffect(() => {
    setActiveConversationId(null)
  }, [pdfId, setActiveConversationId])

  // Update Recoil state when data changes and auto-create conversation if needed
  useEffect(() => {
    if (data) {
      setConversations(data)
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id)
      } else if (data.length === 0 && !activeConversationId && !createMutation.isPending) {
        // Auto-create conversation if no conversations exist
        createMutation.mutate()
      }
    }
  }, [data, activeConversationId, setConversations, setActiveConversationId, createMutation])

  // Update error state when query error occurs
  useEffect(() => {
    if (queryError) {
      setError(getErrorMessage(queryError))
    }
  }, [queryError, setError])

  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  const updateActiveConversationMessages = (messageUpdater: (messages: any[]) => any[]) => {
    console.log('updateActiveConversationMessages called')
    setConversations((convs) => {
      console.log('Current conversations:', convs)
      const updated = convs.map((conv) => {
        if (conv.id === activeConversationId) {
          const updatedMessages = messageUpdater(conv.messages)
          console.log(
            'Updated messages for conversation',
            activeConversationId,
            ':',
            updatedMessages
          )
          return {
            ...conv,
            messages: updatedMessages,
          }
        }
        return conv
      })
      console.log('Updated conversations:', updated)
      return updated
    })
  }

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    createConversation: createMutation.mutate,
    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    updateConversations: setConversations,
    updateActiveConversationMessages,
  }
}
