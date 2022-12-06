import { isEmpty, isEqual } from 'lodash'
import { State, StoreApi } from 'zustand'

import { BroadcastSyncedChannel, PartialSyncStateType, SyncField } from '@mexit/core'

import { MessageType } from './messageHandler'

export function storeChangeHandler<T extends State, K extends keyof T>(
  store: StoreApi<T>,
  options: { sync: SyncField<K>[]; name: BroadcastSyncedChannel; init?: boolean },
  onChangeCallback: (message: MessageType) => void
) {
  store.subscribe((currentStoreState, prevStoreState) => {
    const lastSyncedStateTimestamp = +new Date()

    const partialState: Record<string, PartialSyncStateType> = options.sync.reduce((prev, current) => {
      const field = current.field
      const storeState = currentStoreState[field]

      const canUpdateAtomicField = typeof storeState === 'object' && current.atomicField

      if (!isEqual(storeState, prevStoreState[field])) {
        return {
          ...prev,
          [field]: canUpdateAtomicField
            ? { state: storeState[current.atomicField], atomicField: current.atomicField }
            : { state: storeState }
        }
      }

      return prev
    }, {} as Record<string, PartialSyncStateType>)

    if (!isEmpty(partialState)) {
      onChangeCallback({
        msgId: options.name,
        updatedAt: lastSyncedStateTimestamp,
        state: partialState
      })
    }
  })
}
