import { ExtInfobarMode, InfobarMode } from '@mexit/shared'

import { StoreIdentifier } from '../Types/Store'
import { getLocalStorage } from '../Utils/storage'
import { createStore } from '../Utils/storeCreator'

export interface FocusMode {
  on: boolean
  hover: boolean
}

export enum ContextMenuType {
  NOTES_TREE = 'NOTES_TREE',
  NOTE_PLUS_BUTTON = 'NOTE_PLUS_BUTTON',
  ARCHIVE_TREE = 'ARCHIVE_TREE',
  SNIPPETS_LIST = 'SNIPPETS_LIST',
  PROMPTS_LIST = 'PROMPTS_LIST',
  NOTE_NAMESPACE = 'NOTE_NAMESPACE',
  VIEW_LIST = 'VIEW_LIST',
  EDITOR = 'EDITOR'
}

export type ContextMenu = {
  item: any
  type: ContextMenuType
  coords: { x: number; y: number }
}

interface LayoutState {
  rhSidebar: {
    expanded: boolean
    show: boolean
  }
  toggleTop: number
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
  toggleTop: 44,
  showLoader: false,
  contextMenu: undefined as ContextMenu | undefined,
  focusMode: { on: false, hover: false },
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

export const layoutStoreConfig = (set, get) => ({
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

export const useLayoutStore = createStore(layoutStoreConfig, StoreIdentifier.LAYOUT, true, {
  storage: {
    web: getLocalStorage()
  }
})
