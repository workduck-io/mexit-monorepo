// TODO: add more domains and their supported types
import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'
import toast from 'react-hot-toast'

import {
  Snippet,
  convertContentToRawText,
  convertToCopySnippet,
  defaultCopyFilter,
  defaultCopyConverter,
  ELEMENT_TAG,
  mog
} from '@mexit/core'

import { CopyTag } from '../Editor/components/Tags/CopyTag'
import getPlugins from '../Editor/plugins/index'

// Also a better matching for the domains
export const supportedDomains: Record<string, 'plain' | 'html'> = {
  'https://mail.google.com': 'html',
  'https://www.figma.com': 'plain',
  'https://keep.google.com': 'plain'
}

export const copySnippetToClipboard = async (item: Snippet) => {
  const text = convertContentToRawText(item.content, '\n')

  let html = text

  try {
    const filterdContent = convertToCopySnippet(item.content)
    const convertedContent = convertToCopySnippet(filterdContent, {
      filter: defaultCopyFilter,
      converter: defaultCopyConverter
    })

    const tempEditor = createPlateEditor({
      plugins: getPlugins(
        createPlateUI({
          [ELEMENT_TAG]: CopyTag as any
        }),
        {
          exclude: { dnd: true }
        }
      )
    })

    html = serializeHtml(tempEditor, {
      nodes: convertedContent
    })
  } catch (err) {
    mog('Something went wrong', { err })
  }

  //Copying both the html and text in clipboard
  const textBlob = new Blob([text], { type: 'text/plain' })
  const htmlBlob = new Blob([html], { type: 'text/html' })
  const data = [new ClipboardItem({ ['text/plain']: textBlob, ['text/html']: htmlBlob })]

  await navigator.clipboard.write(data)

  toast.success('Snippet copied to clipboard!')
}

// This functions provides the 'to be' range and text content
// Needed because keydown event happens before there is a selection or content change
export function getUpcomingData(selection: Selection) {
  const ogRange = selection.getRangeAt(0)

  // Shifitng both start and end offset to simulate backwards caret movement
  const range = ogRange.cloneRange()
  range.setStart(ogRange.startContainer, ogRange.startOffset - 1)
  range.setEnd(ogRange.endContainer, ogRange.endOffset - 1)

  // delete last character of current content
  const text = selection.anchorNode.textContent.slice(0, -1)

  return { range, text }
}

export function simulateOnChange() {
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: false
  })

  const changeEvent = new Event('change', {
    bubbles: true,
    cancelable: false
  })

  document.activeElement.dispatchEvent(inputEvent)
  document.activeElement.dispatchEvent(changeEvent)
}
