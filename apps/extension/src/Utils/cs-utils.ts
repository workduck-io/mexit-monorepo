// Content Script Utils

export const styleSlot = document.createElement('div')
styleSlot.id = 'style-sheet-target'

export const getElementById = (id: string) => {
  return document.getElementById('mexit').shadowRoot.getElementById(id)
}
