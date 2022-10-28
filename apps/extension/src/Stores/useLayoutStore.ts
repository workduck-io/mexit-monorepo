import create from 'zustand'

import { ExtInfobarMode } from '@mexit/shared'

interface LayoutState {
  rhSidebar: {
    expanded: boolean
    show: boolean
  }
  toggleTop: number
  setToggleTop: (height: number) => void

  infobar: { mode: ExtInfobarMode }

  toggleRHSidebar: () => void
  setRHSidebarExpanded: (expanded: boolean) => void
  showRHSidebar: () => void
  hideRHSidebar: () => void

  setInfobarMode: (mode: ExtInfobarMode) => void
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // RHSidebar
  rhSidebar: {
    expanded: false,
    show: true
  },
  toggleTop: 44,
  setToggleTop: (height) => set({ toggleTop: height }),
  toggleRHSidebar: () => set((state) => ({ rhSidebar: { ...state.rhSidebar, expanded: !state.rhSidebar.expanded } })),
  setRHSidebarExpanded: (expanded) => set((state) => ({ rhSidebar: { ...state.rhSidebar, expanded } })),
  showRHSidebar: () => set((state) => ({ rhSidebar: { ...state.rhSidebar, show: true } })),
  hideRHSidebar: () => set((state) => ({ rhSidebar: { ...state.rhSidebar, show: false } })),

  // Infobar
  infobar: {
    visible: true,
    mode: 'context'
  },
  setInfobarMode: (mode) => {
    const curMode = get().infobar.mode
    if (curMode === mode) return
    set({ infobar: { ...get().infobar, mode } })
  }
}))
