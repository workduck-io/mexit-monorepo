export const getCurrentTab = async () => {
  const cTabsArr = await chrome.tabs?.query({ currentWindow: true, active: true })
  const currTab = cTabsArr[0]

  return currTab
}

export const checkMetaParseableURL = (url: string) => {
  /* We can't insert our content script in edge:// or chrome:// like pages */

  if (url.startsWith('edge://') || url.startsWith('chrome://')) return false
  return true
}

export const parsePageMetaTags = (document = window.document) => {
  const metaElements = document.getElementsByTagName('meta')
  const title = document.getElementsByTagName('title')[0]

  const res = []

  for (let i = 0; i < metaElements.length; i++) {
    const name = metaElements[i].getAttribute('name')
    const property = metaElements[i].getAttribute('property')
    const content = metaElements[i].getAttribute('content')

    const tName = name ? name : property
    if (content !== null && tName !== null) {
      res.push({
        name: tName,
        value: content
      })
    }
  }

  res.push({
    name: 'title',
    value: title.innerText
  })
  return res
}
