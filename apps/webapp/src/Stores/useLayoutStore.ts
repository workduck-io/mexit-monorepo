import create from 'zustand'

export interface FocusMode {
  on: boolean
  hover: boolean
}

export type InfobarMode = 'default' | 'flow' | 'graph' | 'reminders' | 'suggestions'

interface LayoutState {
  sidebar: { expanded: boolean; show: boolean }
  rhSidebar: { expanded: boolean; show: boolean }
  infobar: { mode: InfobarMode }
  focusMode: FocusMode
  toggleSidebar: () => void
  showSidebar: () => void
  hideSidebar: () => void

  toggleRHSidebar: () => void
  setRHSidebarExpanded: (expanded: boolean) => void
  showRHSidebar: () => void
  hideRHSidebar: () => void

  showAllSidebars: () => void
  hideAllSidebars: () => void
  toggleAllSidebars: () => void

  collapseAllSidebars: () => void

  toggleFocusMode: () => void
  setFocusMode: (focusMode: FocusMode) => void
  hoverFocusMode: () => void
  blurFocusMode: () => void
  setInfobarMode: (mode: InfobarMode) => void
  showLoader?: boolean
  setShowLoader?: (showLoader: boolean) => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // Focus mode
  focusMode: { on: false, hover: false },
  toggleFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, on: !state.focusMode.on } })),
  setFocusMode: (focusMode) => set({ focusMode }),
  hoverFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: true } })),
  blurFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: false } })),

  showLoader: false,
  setShowLoader: (showLoader) => set({ showLoader }),

  // Sidebar
  sidebar: {
    expanded: true,
    show: false
  },
  toggleSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, expanded: !state.sidebar.expanded } })),
  showSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: true } })),
  hideSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: false } })),

  // RHSidebar
  rhSidebar: {
    expanded: true,
    show: false
  },
  toggleRHSidebar: () => set((state) => ({ rhSidebar: { ...state.rhSidebar, expanded: !state.rhSidebar.expanded } })),
  setRHSidebarExpanded: (expanded) => set((state) => ({ rhSidebar: { ...state.rhSidebar, expanded } })),
  showRHSidebar: () => set((state) => ({ rhSidebar: { ...state.rhSidebar, show: true } })),
  hideRHSidebar: () => set((state) => ({ rhSidebar: { ...state.rhSidebar, show: false } })),

  collapseAllSidebars: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, expanded: false },
      rhSidebar: { ...state.rhSidebar, expanded: false }
    })),

  showAllSidebars: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, show: true },
      rhSidebar: { ...state.rhSidebar, show: true }
    })),

  hideAllSidebars: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, show: false },
      rhSidebar: { ...state.rhSidebar, show: false }
    })),

  toggleAllSidebars: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, expanded: !state.sidebar.expanded },
      rhSidebar: { ...state.rhSidebar, expanded: !state.rhSidebar.expanded }
    })),

  // Infobar
  infobar: {
    visible: true,
    mode: 'default'
  },
  setInfobarMode: (mode) => {
    const curMode = get().infobar.mode
    if (curMode === mode) return
    set({ infobar: { ...get().infobar, mode } })
  }
}))
