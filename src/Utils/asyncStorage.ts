export const asyncLocalStorage = {
  setItem: (key: string, value: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        chrome.storage.local.set({ [key]: value }, function () {
          console.log('set', key, value)
          resolve()
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  getItem: (key: string) => {
    return new Promise<string>((resolve, reject) => {
      try {
        chrome.storage.local.get([key], function (result) {
          console.log('get', key, result[key])
          resolve(result[key])
        })
      } catch (error) {
        reject(error)
      }
    })
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
