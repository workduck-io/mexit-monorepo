import { storageAdapter } from '../Utils/chromeStorageAdapter'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { MexitAction } from '../Types/Actions'
import { initActions } from '../Utils/actions'

interface ActionsStore extends State {
  actions: MexitAction[]
  addAction: (action: MexitAction) => void
}

export const useActionsStore = create<ActionsStore>(
  persist(
    (set, get) => ({
      actions: initActions,
      addAction: (action: MexitAction) => {
        set({
          actions: [...get().actions, action]
        })
      }
    }),
    { name: 'mexit-actions', ...storageAdapter }
  )
)
