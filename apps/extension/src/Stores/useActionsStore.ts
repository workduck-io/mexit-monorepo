import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

import { initActions, MexitAction } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

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
    { name: 'mexit-actions', getStorage: () => asyncLocalStorage }
  )
)
