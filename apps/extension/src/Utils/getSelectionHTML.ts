export function getSelectionHTML() {
  let html, url, range

  if (typeof window.getSelection != 'undefined') {
    const selection: Selection | null = window.getSelection()

    if (selection?.rangeCount) {
      url = selection?.anchorNode.baseURI

      const container = document.createElement('div')
      for (let i = 0, len = selection.rangeCount; i < len; ++i) {
        const t = selection.getRangeAt(i).cloneContents()
        container.appendChild(t)
        range = selection.getRangeAt(i)
      }
      console.log('Container: ', container)
      html = container.innerHTML
    }
  }

  return { url, html, range }
}
