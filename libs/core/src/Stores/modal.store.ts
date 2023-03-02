import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

export enum ModalsType {
  blocks,
  delete,
  deleteSpace,
  refactor,
  lookup,
  rename,
  releases,
  reminders,
  share,
  help,
  todo,
  template,
  manageSpaces,
  quickNew,
  previewNote
}
// * Create Unified Store for all Modals
// * This would make sure only one modal is present in DOM at a time.
const modalStoreConfig = (set, get) => ({
  open: undefined,
  init: undefined,
  data: undefined,
  setData: (modalData) => set({ data: modalData }),
  toggleOpen: (modalType: ModalsType, modalData?, initialize?: boolean) => {
    const open = get().open

    const changeModalState = open === modalType ? undefined : modalType
    // As only one modal is going to be open at any time, better to reset data on Modal close
    const updatedModalData = changeModalState ? modalData : undefined
    const initModal = initialize ? modalType : undefined

    set({ open: changeModalState, init: initModal, data: updatedModalData })
  }
})

export const useModalStore = createStore(modalStoreConfig, StoreIdentifier.MODAL, false)