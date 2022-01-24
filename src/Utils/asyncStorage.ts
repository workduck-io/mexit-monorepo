export const asyncLocalStorage: Storage = {
  length: localStorage.length,
  key: (index: number) => {
    return localStorage.key(index)
  },
  setItem: async (key: string, value: string) => {
    chrome.storage.local.set({ [key]: value }, () => {
      console.log('set', key, value)
      return
    })
  },
  getItem: (key: string) => {
    let res
    chrome.storage.local.get([key], (result) => {
      console.log('get', key)
      res = result
    })
    return res
  },
  removeItem: (key: string) => {
    chrome.storage.local.remove(key, () => {
      console.log('deleted', key)
    })
  },
  clear: () => {
    chrome.storage.local.clear()
  }
}

export const storageAdapter = {
  getStorage: () => asyncLocalStorage,
  serialize: (obj: any) => Promise.resolve(obj),
  deserialize: () =>
    new Promise<any>((resolve) => {
      let val: any
      resolve(val)
    })
}
