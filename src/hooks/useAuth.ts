import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { getErrorMessage } from '@/api/axios'
import { useSetRecoilState } from 'recoil'
import { userAtom, authErrorAtom } from '@/atoms/authAtom'
import { useEffect } from 'react'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const setUser = useSetRecoilState(userAtom)
  const setError = useSetRecoilState(authErrorAtom)

  const {
    data: user,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getUser,
    retry: false,
  })

  // Update Recoil state when data changes
  useEffect(() => {
    if (user !== undefined) {
      setUser(user || false)
    }
  }, [user, setUser])

  // Update error state when query error occurs
  useEffect(() => {
    if (queryError) {
      setUser(false)
    }
  }, [queryError, setUser])

  const signinMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signin(email, password),
    onSuccess: (data) => {
      setUser(data)
      setError('')
      queryClient.setQueryData(['user'], data)
    },
    onError: (error) => {
      setError(getErrorMessage(error))
    },
  })

  const signupMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signup(email, password),
    onSuccess: (data) => {
      setUser(data)
      setError('')
      queryClient.setQueryData(['user'], data)
    },
    onError: (error) => {
      setError(getErrorMessage(error))
    },
  })

  const signoutMutation = useMutation({
    mutationFn: authApi.signout,
    onSuccess: () => {
      setUser(false)
      setError('')
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
    },
    onError: (error) => {
      setError(getErrorMessage(error))
    },
  })

  return {
    user,
    isLoading,
    signin: signinMutation.mutate,
    signup: signupMutation.mutate,
    signout: signoutMutation.mutate,
    isSigningIn: signinMutation.isPending,
    isSigningUp: signupMutation.isPending,
  }
}
