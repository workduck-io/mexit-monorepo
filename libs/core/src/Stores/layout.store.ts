import { ExtInfobarMode, InfobarMode } from '@mexit/shared'

import { ContextMenu, Drawer, DrawerType } from '../Types/Layout'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

interface LayoutState {
  rhSidebar: {
    expanded: boolean
    show: boolean
  }
  toggleTop: number
  drawer: DrawerType
  setDrawer: (drawer?: DrawerType) => void
  infobar: { mode: ExtInfobarMode }
  showRHSidebar: () => void
  hideRHSidebar: () => void
  toggleRHSidebar: () => void
  toggleExtensionSidebar: () => void
  setToggleTop: (height: number) => void
  setInfobarMode: (mode: ExtInfobarMode) => void
  setRHSidebarExpanded: (expanded: boolean) => void
}

const SIDEBAR_WIDTH = 276

const initializeLayoutStore = () => ({
  // Focus mode
  toggleTop: -500,
  showLoader: false,
  contextMenu: undefined as ContextMenu | undefined,
  focusMode: { on: false, hover: false },

  // Quick Action Drawer
  drawer: undefined as Drawer | undefined,

  // Infobar
  infobar: {
    visible: true,
    mode: undefined as ExtInfobarMode | InfobarMode
  },
  // Sidebar
  sidebar: {
    expanded: true,
    show: false,
    width: SIDEBAR_WIDTH
  },
  // RHSidebar
  rhSidebar: {
    expanded: false,
    show: true
  }
})

const layoutStoreConfig = (set, get) => ({
  ...initializeLayoutStore(),
  setToggleTop: (height: number) => set({ toggleTop: height }),
  toggleFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, on: !state.focusMode.on } })),
  setFocusMode: (focusMode) => set({ focusMode }),
  hoverFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: true } })),
  blurFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: false } })),
  setShowLoader: (showLoader) => set({ showLoader }),
  setContextMenu: (contextMenu: ContextMenu) => set({ contextMenu }),
  toggleSidebar: () =>
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        expanded: !state.sidebar.expanded,
        width: state.sidebar.expanded ? 0 : SIDEBAR_WIDTH
      }
    })),
  setDrawer: (drawer?: Drawer) => set({ drawer }),

  showSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: true } })),
  hideSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: false } })),
  toggleExtensionSidebar: () => set({ rhSidebar: { expanded: false, show: !get().rhSidebar.show } }),
  toggleRHSidebar: () =>
    set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, expanded: !state.rhSidebar.expanded } })),
  setRHSidebarExpanded: (expanded: boolean) =>
    set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, expanded } })),
  showRHSidebar: () => set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, show: true } })),
  hideRHSidebar: () => set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, show: false } })),
  expandSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, expanded: true, width: SIDEBAR_WIDTH } })),
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
      rhSidebar: { ...state.rhSidebar, show: false, expanded: false }
    })),
  toggleAllSidebars: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, expanded: !state.sidebar.expanded },
      rhSidebar: { ...state.rhSidebar, expanded: state.rhSidebar.show && !state.rhSidebar.expanded }
    })),
  setInfobarMode: (mode: ExtInfobarMode | InfobarMode) => {
    const infobar = get().infobar
    if (infobar.mode === mode) return
    set({ infobar: { ...infobar, mode } })
  },
  reset: () => {
    const initLayoutState = initializeLayoutStore()
    set(initLayoutState)
  }
})

export const useLayoutStore = createStore(layoutStoreConfig, StoreIdentifier.LAYOUT, false)
