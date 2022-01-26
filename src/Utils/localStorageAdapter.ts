export const BGLocalStorage = {
  setItem: (key: string, value: string) => {
    console.log(`Setting Item: ${key} | Value: ${JSON.stringify(value)}`)
    chrome.runtime.sendMessage({
      type: 'STORE_HANDLER',
      subType: 'SET_ITEM',
      data: {
        key: key,
        value: value
      }
    })
  },
  getItem: (key: string) => {
    let res: any
    chrome.runtime.sendMessage(
      {
        type: 'STORE_HANDLER',
        subType: 'GET_ITEM',
        data: {
          key: key
        }
      },
      (response) => {
        res = response.value
      }
    )
    return res
  },
  removeItem: (key: string) => {
    chrome.runtime.sendMessage({
      type: 'STORE_HANDLER',
      subType: 'REMOVE_ITEM',
      data: {
        key: key
      }
    })
  },
  clear: () => {
    chrome.runtime.sendMessage({
      type: 'STORE_HANDLER',
      subType: 'CLEAR_STORE'
    })
  }
}

export const localStorageAdapter = {
  getStorage: () => BGLocalStorage
}
