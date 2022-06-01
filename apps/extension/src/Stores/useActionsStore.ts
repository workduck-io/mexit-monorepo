import { MexitAction, initActions } from '@mexit/core'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageAdapter } from '@mexit/core'

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
