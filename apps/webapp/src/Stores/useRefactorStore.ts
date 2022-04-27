import create from 'zustand'

import { NodeLink } from '@mexit/core'

interface RefactorState {
    open: boolean
    focus: boolean
    mockRefactored: NodeLink[]
    from: string | undefined
    to: string | undefined
    openModal: () => void
    closeModal: () => void
    setMockRefactored: (mR: NodeLink[]) => void
    setFocus: (focus: boolean) => void
    setFrom: (from: string) => void
    setTo: (from: string) => void
    prefillModal: (from: string, to: string) => void
}

export const useRefactorStore = create<RefactorState>((set) => ({
    open: false,
    mockRefactored: [],
    from: undefined,
    to: undefined,
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
