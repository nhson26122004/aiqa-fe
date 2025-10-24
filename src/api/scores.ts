import api from './axios'
import { Score, ScoreStats } from '@/types'

export const scoresApi = {
  create: async (conversationId: string, score: number): Promise<Score> => {
    const { data } = await api.post<Score>(`/scores?conversation_id=${conversationId}`, { score })
    return data
  },

  getStats: async (): Promise<ScoreStats[]> => {
    const { data } = await api.get<ScoreStats[]>('/scores')
    return data
  },
}
