export const getCurrentTab = async () => {
  const cTabsArr = await chrome.tabs.query({ currentWindow: true, active: true })
  const currTab = cTabsArr[0]

  return currTab
}

export const checkMetaParseableURL = (url: string) => {
  /* We can't insert our content script in edge:// or chrome:// like pages */

  if (url.startsWith('edge://') || url.startsWith('chrome://')) return false
  return true
}
