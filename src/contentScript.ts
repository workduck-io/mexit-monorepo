// Any kind of DOM manipulation is done here.

console.log('Setting Up Listener')

const parsePageMetaTags = () => {
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.method === 'GetPageMetaTags') {
    const res = parsePageMetaTags()
    sendResponse({ metaTags: res })
    return true
  }
})

export {}
