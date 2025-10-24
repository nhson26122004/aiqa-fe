import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scoresApi } from '@/api/scores'

export const useScores = () => {
  const queryClient = useQueryClient()

  const { data: scoreStats = [], isLoading } = useQuery({
    queryKey: ['scores'],
    queryFn: scoresApi.getStats,
  })

  const createScoreMutation = useMutation({
    mutationFn: ({ conversationId, score }: { conversationId: string; score: number }) =>
      scoresApi.create(conversationId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] })
    },
  })

  return {
    scoreStats,
    isLoading,
    createScore: createScoreMutation.mutate,
    isCreating: createScoreMutation.isPending,
  }
}
