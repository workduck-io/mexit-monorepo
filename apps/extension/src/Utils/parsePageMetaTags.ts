export const parsePageMetaTags = () => {
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
