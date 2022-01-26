import { initActions } from '../Utils/actions'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

import { MexitAction, ActionType } from '../Types/Actions'

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
    { name: 'mexit-actions' }
  )
)
