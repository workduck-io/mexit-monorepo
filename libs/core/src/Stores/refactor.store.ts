import { NodeLink } from '../Types/Editor'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

import { RefactorPath } from './rename.store'

export const refactorStoreConfig = (set) => ({
  open: false,
  mockRefactored: [] as NodeLink[],
  from: undefined as string | undefined,
  to: undefined as string | undefined,
  fromNS: undefined as string | undefined,
  toNS: undefined as string | undefined,
  focus: true,
  openModal: () =>
    set({
      open: true
    }),
  closeModal: () => {
    set({
      from: undefined,
      to: undefined,
      mockRefactored: [],
      open: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setMockRefactored: (mockRefactored: NodeLink[]) => {
    set({ mockRefactored })
  },
  setFrom: (from: RefactorPath) => set({ from: from.path, fromNS: from.namespaceID }),
  setTo: (to: RefactorPath) => set({ to: to.path, toNS: to.namespaceID }),
  prefillModal: (from: RefactorPath, to?: RefactorPath) =>
    set({
      from: from.path,
      fromNS: from.namespaceID,
      to: to?.path,
      toNS: to?.namespaceID,
      open: true,
      focus: false
    })
})

export const useRefactorStore = createStore(refactorStoreConfig, StoreIdentifier.REFACTOR, false)
