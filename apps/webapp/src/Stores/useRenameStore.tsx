import create from 'zustand'

import { NodeLink } from '@mexit/core'

export interface RefactorPath {
  path: string
  namespaceID?: string
}

interface RenameStoreState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  fromNS: string | undefined
  to: string | undefined
  toNS: string | undefined
  openModal: (id?: string) => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: RefactorPath) => void
  setTo: (to: RefactorPath) => void
  prefillModal: (from: string, to: string) => void
}

export const useRenameStore = create<RenameStoreState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  fromNS: undefined,
  to: undefined,
  toNS: undefined,
  focus: true,
  openModal: (id) => {
    if (id) {
      set({ open: true, from: id })
    } else {
      set({
        open: true
      })
    }
  },
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
  prefillModal: (from: string, to: string) =>
    set({
      from,
      to,
      open: true,
      focus: false
    })
}))
