import { atom } from 'recoil'
import { User } from '@/types'

export const userAtom = atom<User | null | false>({
  key: 'userAtom',
  default: null,
})

export const authLoadingAtom = atom<boolean>({
  key: 'authLoadingAtom',
  default: false,
})

export const authErrorAtom = atom<string>({
  key: 'authErrorAtom',
  default: '',
})
