import create from 'zustand'

interface GameState {
  open: boolean
  openModal: () => void
  closeModal: () => void
  finalScore: number
  setFinalScore: (f_score: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  open: false,
  openModal: () => set((state) => ({ open: true })),
  closeModal: () => set((state) => ({ open: false })),
  finalScore: 0,
  setFinalScore: (f_score) => set((state) => ({ finalScore: f_score }))
}))
