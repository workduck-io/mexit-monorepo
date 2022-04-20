import { NodeLink } from '@mexit/core'
import create from 'zustand'

interface RenameStoreState {
  open: boolean
  focus: boolean
  mockRefactored: NodeLink[]
  from: string | undefined
  to: string | undefined
  openModal: (id?: string) => void
  closeModal: () => void
  setMockRefactored: (mR: NodeLink[]) => void
  setFocus: (focus: boolean) => void
  setFrom: (from: string) => void
  setTo: (from: string) => void
  prefillModal: (from: string, to: string) => void
}

export const useRenameStore = create<RenameStoreState>((set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  to: undefined,
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
  setFrom: (from: string) => set({ from }),
  setTo: (to: string) => set({ to }),
  prefillModal: (from: string, to: string) =>
    set({
      from,
      to,
      open: true,
      focus: false
    })
}))
