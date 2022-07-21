import create from 'zustand'

interface GameState {
  open: boolean
  openModal: () => void
  closeModal: () => void
  score: number
  setScore: (increment: number) => void
  cleanScore: () => void
}

export const useGameStore = create<GameState>((set) => ({
  open: false,
  openModal: () => set((state) => ({ open: true })),
  closeModal: () => set((state) => ({ open: false })),
  score: 0,
  setScore: (increment) => set((state) => ({ score: state.score + increment })),
  cleanScore: () => set((state) => ({ score: 0 }))
}))
