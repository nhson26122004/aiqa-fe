import api from './axios'
import { Conversation } from '@/types'

export const conversationsApi = {
  list: async (pdfId: string): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>(`/conversations?pdf_id=${pdfId}`)
    return data
  },

  create: async (pdfId: string): Promise<Conversation> => {
    const { data } = await api.post<Conversation>(`/conversations?pdf_id=${pdfId}`)
    return data
  },

  sendMessage: async (
    conversationId: string,
    input: string,
    stream: boolean = false
  ): Promise<{ role: string; content: string }> => {
    const { data } = await api.post(`/conversations/${conversationId}/messages?stream=${stream}`, {
      input,
    })
    return data
  },
}
