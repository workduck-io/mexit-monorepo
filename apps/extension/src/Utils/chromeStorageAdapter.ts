export const asyncLocalStorage = {
  setItem: async (key: string, value: string) => {
    // console.log(`Setting Item: ${key} | Value: ${JSON.stringify(value)}`)
    await chrome.storage.local.set({ [key]: value })
  },
  getItem: async (key: string) => {
    const res = await chrome.storage.local.get([key])
    // console.log(`Getting Item: ${key} | Value ${JSON.stringify(res[key])}`)
    return res[key]
  },
  removeItem: async (key: string) => {
    await chrome.storage.local.remove(key)
  }
}
