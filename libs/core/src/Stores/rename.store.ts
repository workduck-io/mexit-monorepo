import { NodeLink } from '../Types/Editor';
import { StoreIdentifier } from '../Types/Store';
import { createStore } from '../Utils/storeCreator'

export interface RefactorPath {
  path: string
  namespaceID?: string
}

export const renameStoreConfig = (set) => ({
  open: false,
  mockRefactored: [],
  from: undefined,
  fromNS: undefined,
  to: undefined,
  toNS: undefined,
  focus: true,
  openModal: (id) => {
    if (id) {
      set({ open: true, from: id })
    } else {
      set({
        open: true
      })
    }
  },
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
  prefillModal: (from: string, to: string) =>
    set({
      from,
      to,
      open: true,
      focus: false
    })
})

const useRenameStore = createStore(renameStoreConfig, StoreIdentifier.RENAME , false)

export { useRenameStore }