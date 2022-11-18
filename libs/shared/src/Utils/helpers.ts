import React from 'react'

import toast from 'react-hot-toast'

import { NodeContent } from '@mexit/core'

export async function copyTextToClipboard(text: any) {
  await navigator.clipboard
    .writeText(String(text))
    .then(() => {
      toast.success('Copied to Clipboard!')
    })
    .catch((err) => {
      toast.error('An error occurred. Please try again later')
    })
}

// https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
export function getScrollbarWidth() {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'auto'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode!.removeChild(outer)
  return scrollbarWidth
}

export const resize = (ref: React.RefObject<HTMLElement>) => {
  window.parent.postMessage({ type: 'height-init', height: ref.current.clientHeight }, '*')
}
