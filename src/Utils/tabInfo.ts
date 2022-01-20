export const getCurrentTab = async () => {
  const cTabsArr = await chrome.tabs.query({ currentWindow: true, active: true })
  const currTab = cTabsArr[0]

  return currTab
}
