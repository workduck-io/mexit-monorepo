import create from 'zustand'

interface LayoutState {
  sidebar: { visible: boolean; width: number }
  infobar: { visible: boolean }
  focusMode: boolean
  toggleSidebar: () => void
  toggleFocusMode: () => void
  setSidebarWidth: (width: number) => void
  toggleInfobar: () => void
  showInfobar: () => void
  hideInfobar: () => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebar: {
    width: 300,
    visible: true
  },
  focusMode: false,
  toggleSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, visible: !state.sidebar.visible } })),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  setSidebarWidth: (width) => set((state) => ({ sidebar: { ...state.sidebar, width } })),
  infobar: {
    visible: true
  },
  toggleInfobar: () => set((state) => ({ infobar: { visible: !state.infobar.visible } })),
  showInfobar: () => set({ infobar: { visible: true } }),
  hideInfobar: () => set({ infobar: { visible: false } })
}))
