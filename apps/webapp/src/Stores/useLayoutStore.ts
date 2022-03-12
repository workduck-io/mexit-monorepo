import create from 'zustand'

export interface FocusMode {
  on: boolean
  hover: boolean
}

interface LayoutState {
  sidebar: { visible: boolean; width: number }
  infobar: { visible: boolean }
  focusMode: FocusMode
  toggleSidebar: () => void
  toggleFocusMode: () => void
  setFocusMode: (focusMode: FocusMode) => void
  hoverFocusMode: () => void
  blurFocusMode: () => void
  setSidebarWidth: (width: number) => void
  toggleInfobar: () => void
  showInfobar: () => void
  hideInfobar: () => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // Focus mode
  focusMode: { on: false, hover: false },
  toggleFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, on: !state.focusMode.on } })),
  setFocusMode: (focusMode) => set({ focusMode }),
  hoverFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: true } })),
  blurFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: false } })),

  // Sidebar
  sidebar: {
    width: 300,
    visible: true
  },
  toggleSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, visible: !state.sidebar.visible } })),
  setSidebarWidth: (width) => set((state) => ({ sidebar: { ...state.sidebar, width } })),
  // Infobar
  infobar: {
    visible: true
  },
  toggleInfobar: () => set((state) => ({ infobar: { visible: !state.infobar.visible } })),
  showInfobar: () => set({ infobar: { visible: true } }),
  hideInfobar: () => set({ infobar: { visible: false } })
}))
