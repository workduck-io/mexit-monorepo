import create from 'zustand'

export const useInitStore = create<any>((set, get) => ({
  iframeAdded: false,
  setIframeAdded: (value: boolean) => {
    set((state) => ({ ...state, iframeAdded: value }))
  }
}))
