import { ExtInfobarMode, InfobarMode } from '@mexit/shared'

import { StoreIdentifier } from '../Types/Store'
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
  setToggleTop: (height: number) => void

  infobar: { mode: ExtInfobarMode }

  toggleRHSidebar: () => void
  setRHSidebarExpanded: (expanded: boolean) => void
  showRHSidebar: () => void
  hideRHSidebar: () => void
  toggleExtensionSidebar: () => void

  setInfobarMode: (mode: ExtInfobarMode) => void
}

const SidebarWidth = 276

export const layoutStoreConfig = (set, get) => ({
  // Focus mode
  focusMode: { on: false, hover: false },
  toggleTop: 44,
  setToggleTop: (height: number) => set({ toggleTop: height }),
  toggleFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, on: !state.focusMode.on } })),
  setFocusMode: (focusMode) => set({ focusMode }),
  hoverFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: true } })),
  blurFocusMode: () => set((state) => ({ focusMode: { ...state.focusMode, hover: false } })),

  showLoader: false,
  setShowLoader: (showLoader) => set({ showLoader }),
  contextMenu: undefined,
  setContextMenu: (contextMenu: ContextMenu) => set({ contextMenu }),

  // Sidebar
  sidebar: {
    expanded: true,
    show: false,
    width: SidebarWidth
  },
  toggleSidebar: () =>
    set((state) => ({
      sidebar: { ...state.sidebar, expanded: !state.sidebar.expanded, width: state.sidebar.expanded ? 0 : SidebarWidth }
    })),
  showSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: true } })),
  hideSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, show: false } })),

  // RHSidebar
  rhSidebar: {
    expanded: false,
    show: true
  },
  toggleExtensionSidebar: () => set({ rhSidebar: { expanded: false, show: !get().rhSidebar.show } }),
  toggleRHSidebar: () =>
    set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, expanded: !state.rhSidebar.expanded } })),
  setRHSidebarExpanded: (expanded: boolean) =>
    set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, expanded } })),
  showRHSidebar: () => set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, show: true } })),
  hideRHSidebar: () => set((state: LayoutState) => ({ rhSidebar: { ...state.rhSidebar, show: false } })),

  expandSidebar: () => set((state) => ({ sidebar: { ...state.sidebar, expanded: true, width: SidebarWidth } })),

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

  // Infobar
  infobar: {
    visible: true,
    mode: undefined as ExtInfobarMode | InfobarMode
  },
  setInfobarMode: (mode: ExtInfobarMode | InfobarMode) => {
    const curMode: ExtInfobarMode = get().infobar.mode
    if (curMode === mode) return
    set({ infobar: { ...get().infobar, mode } })
  }
})

export const useLayoutStore = createStore(layoutStoreConfig, StoreIdentifier.LAYOUT, false)
