import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { CategoryType, createNodeWithUid, getNewDraftKey, ListItemType, MexitAction, NodeProperties } from '@mexit/core'

import { VisualState, TooltipState } from '../Hooks/useSputlitContext'

export type SearchType = {
  value: string
  type: CategoryType
}

interface SputlitStore {
  // * Search Query
  search: SearchType
  changeSearchType: (type: CategoryType) => void
  setSearch: (query: SearchType) => void

  input: string
  setInput: (val: string) => void

  highlightTooltipState?: TooltipState
  setHighlightTooltipState: (state: TooltipState) => void

  // * Selection from page
  selection?: any
  setSelection: (selection?: any) => void

  // * Current node
  node: NodeProperties
  setNode: (node: NodeProperties) => void

  // * Search Results
  results?: Array<ListItemType>
  setResults: (items: Array<ListItemType>) => void

  child?: any
  setChild: (child?: any) => void

  // * Current Active action item from `items`
  activeItem?: ListItemType | MexitAction
  setActiveItem: (item?: ListItemType | MexitAction) => void

  screenshot?: string
  setScreenshot: (image?: string) => void

  // * Reset app State
  reset: () => void
}

export const useSputlitStore = create<SputlitStore>(
  devtools((set, get) => ({
    search: { value: '', type: CategoryType.action },
    changeSearchType: (type) => {
      const search = get().search
      set({ search: { ...search, type } })
    },
    setSearch: (query) => set({ search: query }),

    node: createNodeWithUid(getNewDraftKey(), ''),
    setNode: (node) => set({ node }),

    highlightTooltipState: {
      visualState: VisualState.hidden
    },
    setHighlightTooltipState: (state) => set({ highlightTooltipState: state }),

    input: '',
    setInput: (value) => set({ input: value }),

    results: [],
    setResults: (results) => set({ results }),

    setSelection: (selection) => set({ selection }),
    setChild: (child) => set({ child }),

    setScreenshot: (image) => set({ screenshot: image }),

    setActiveItem: (item) => set({ activeItem: item }),
    reset: () =>
      set({
        search: { value: '', type: CategoryType.action },
        activeItem: undefined,
        results: [],
        selection: undefined,
        screenshot: undefined,
        input: ''
      })
  }))
)
