import { atom } from 'recoil'
import { Conversation } from '@/types'

export const conversationsAtom = atom<Conversation[]>({
  key: 'conversationsAtom',
  default: [],
})

export const activeConversationIdAtom = atom<string | null>({
  key: 'activeConversationIdAtom',
  default: null,
})

export const chatErrorAtom = atom<string>({
  key: 'chatErrorAtom',
  default: '',
})

export const chatLoadingAtom = atom<boolean>({
  key: 'chatLoadingAtom',
  default: false,
})
