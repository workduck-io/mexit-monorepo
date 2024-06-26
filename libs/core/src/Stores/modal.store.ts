import { ModalsType } from '../Types'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

// * Create Unified Store for all Modals
// * This would make sure only one modal is present in DOM at a time.
const modalStoreConfig = (set, get) => ({
  open: undefined as ModalsType | undefined,
  init: undefined as ModalsType | undefined,
  data: undefined as any,
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
