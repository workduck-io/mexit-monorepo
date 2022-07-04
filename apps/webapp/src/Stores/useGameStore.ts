import create from 'zustand'

interface GameState {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

export const useGameStore = create<GameState>((set) => ({
  open: false,
  openModal: () => set((state) => ({ open: true })),
  closeModal: () => set((state) => ({ open: false }))
}))
