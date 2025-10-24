import { atom } from 'recoil'
import { Pdf } from '@/types'

export const documentsAtom = atom<Pdf[]>({
  key: 'documentsAtom',
  default: [],
})

export const documentsLoadingAtom = atom<boolean>({
  key: 'documentsLoadingAtom',
  default: false,
})

export const documentsErrorAtom = atom<string>({
  key: 'documentsErrorAtom',
  default: '',
})
