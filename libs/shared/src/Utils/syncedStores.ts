import type { StoreApi, State } from 'zustand'

export function syncWithStore<T extends State, K extends keyof T>(
  fieldKey: K,
  storeAPI: StoreApi<T>,
  onChangeCallback: ({ timestamp, state }) => void
) {
  let externalUpdate = false
  let timestamp = 0

  storeAPI.subscribe(
    (state) => {
      if (!externalUpdate) {
        timestamp = Date.now()
        onChangeCallback({ timestamp, state })
      }
      externalUpdate = false
    },
    (state) => state[fieldKey]
  )
}
