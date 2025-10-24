import api from './axios'
import { User } from '@/types'

export const authApi = {
  getUser: async (): Promise<User | null> => {
    const { data } = await api.get<User | null>('/auth/user')
    return data
  },

  signin: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<User>('/auth/signin', { email, password })
    return data
  },

  signup: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<User>('/auth/signup', { email, password })
    return data
  },

  signout: async (): Promise<void> => {
    await api.post('/auth/signout')
  },
}
