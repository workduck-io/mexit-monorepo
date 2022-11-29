import { NodeLink } from '@mexit/core'
import create from 'zustand'

import { RefactorPath } from './useRenameStore'

interface RefactorState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
  fromNS: string | undefined
  toNS: string | undefined
  openModal: () => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: RefactorPath) => void
  setTo: (from: RefactorPath) => void
  prefillModal: (from: RefactorPath, to?: RefactorPath) => void
}

export const useRefactorStore = create<RefactorState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  to: undefined,
  fromNS: undefined,
  toNS: undefined,
  focus: true,
  openModal: () =>
    set({
      open: true
    }),
  closeModal: () => {
    set({
      from: undefined,
      to: undefined,
      mockRefactored: [],
      open: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setMockRefactored: (mockRefactored: NodeLink[]) => {
    set({ mockRefactored })
  },
  setFrom: (from: RefactorPath) => set({ from: from.path, fromNS: from.namespaceID }),
  setTo: (to: RefactorPath) => set({ to: to.path, toNS: to.namespaceID }),
  prefillModal: (from: RefactorPath, to?: RefactorPath) =>
    set({
      from: from.path,
      fromNS: from.namespaceID,
      to: to?.path,
      toNS: to?.namespaceID,
      open: true,
      focus: false
    })
}))
