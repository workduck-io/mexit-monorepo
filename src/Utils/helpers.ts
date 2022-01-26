export function wrapErr<T>(f: (result: T) => void) {
  return (err: any, result: T) => {
    if (err) {
      console.error({ error: JSON.stringify(err) })
      return
    } else f(result)
  }
}
// TODO: make actions for these, copy omni

export const reloadTab = () => {
  chrome.tabs.reload()
}

export const clearBrowsingData = () => {
  chrome.browsingData.removeHistory({ since: 0 })
}

export const clearLocalStorage = () => {
  chrome.browsingData.removeLocalStorage({ since: 0 })
}

export const openIncognito = () => {
  chrome.windows.create({ incognito: true })
}

export const closeWindow = (id) => {
  chrome.windows.remove(id)
}

export const closeTab = (tab) => {
  chrome.tabs.remove(tab.id)
}
