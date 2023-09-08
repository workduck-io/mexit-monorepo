type StoreSubscribeWithSelector<T> = {
  subscribe: {
    (listener: (selectedState: T, previousSelectedState: T) => void): () => void
    <U>(
      selector: (state: T) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean
        fireImmediately?: boolean
      }
    ): () => void
  }
}

export function syncWithStore<T, K extends keyof T>(
  fieldKey: K,
  storeAPI: StoreSubscribeWithSelector<T>,
  onChangeCallback: ({ timestamp, state }) => void
) {
  let externalUpdate = false
  let timestamp = 0

  storeAPI.subscribe(
    (state) => state[fieldKey],
    (state) => {
      if (!externalUpdate) {
        timestamp = Date.now()
        onChangeCallback({ timestamp, state })
      }
      externalUpdate = false
    }
  )
}
