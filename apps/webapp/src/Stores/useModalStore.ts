import create from 'zustand'

export enum ModalsType {
  blocks,
  delete,
  refactor,
  lookup,
  rename,
  releases,
  reminders,
  share,
  help,
  template,
  quickNew
}

type ModalStoreType = {
  open: ModalsType | undefined
  init: ModalsType | undefined
  // Would be better if data is of type [typeof ModalsType]: {whatever data needed for specific modal}
  // Keeping it as any as only template modal data type is known for now
  data: any
  toggleOpen: (modalType: ModalsType, modalData?: any, initialize?: boolean) => void
}

// * Create Unified Store for all Modals
// * This would make sure only one modal is present in DOM at a time.
const useModalStore = create<ModalStoreType>((set, get) => ({
  open: undefined,
  init: undefined,
  data: undefined,
  toggleOpen: (modalType, modalData, initialize) => {
    const open = get().open
    const init = get().init

    // if (init) ipcRenderer.send(IpcAction.SHOW_RELEASE_NOTES)

    const changeModalState = open === modalType ? undefined : modalType
    // As only one modal is going to be open at any time, better to reset data on Modal close
    const updatedModalData = changeModalState ? modalData : undefined
    const initModal = initialize ? modalType : undefined

    set({ open: changeModalState, init: initModal, data: updatedModalData })
  }
}))

export default useModalStore
