// TODO: add more domains and their supported types
import toast from 'react-hot-toast'

import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'

import {
  convertContentToRawText,
  convertToCopySnippet,
  defaultCopyConverter,
  defaultCopyFilter,
  ELEMENT_TAG,
  mog,
  Snippet
} from '@mexit/core'
import { isInputElement } from '@mexit/shared'

import { CopyTag } from '../Editor/components/Tags/CopyTag'
import { generateEditorPluginsWithComponents } from '../Editor/plugins/index'

// Also a better matching for the domains
export const supportedDomains: Record<string, 'plain' | 'html'> = {
  'https://mail.google.com': 'html',
  'https://www.figma.com': 'plain',
  'https://keep.google.com': 'plain'
}

export const copySnippetToClipboard = async (item: Snippet, notify = true) => {
  const text = convertContentToRawText(item.content, '\n')
  let html = text

  try {
    const filterdContent = convertToCopySnippet(item.content)
    const convertedContent = convertToCopySnippet(filterdContent, {
      filter: defaultCopyFilter,
      converter: defaultCopyConverter
    })

    const tempEditor = createPlateEditor({
      plugins: generateEditorPluginsWithComponents(
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

  await copyToClipboard(text, html)
  if (notify) toast.success('Snippet copied to clipboard!')
}

export const copyToClipboard = async (text: string, html: string) => {
  // Copying both the html and text in clipboard
  const textBlob = new Blob([text], { type: 'text/plain' })
  const htmlBlob = new Blob([html], { type: 'text/html' })
  const data = [new ClipboardItem({ ['text/plain']: textBlob, ['text/html']: htmlBlob })]

  try {
    await navigator.clipboard.write(data)
  } catch (err) {
    console.error('Unable to write on Clipboard', { err })
  }
}

export const getElement = (element: Node) => {
  if (!element) return

  if (element?.textContent && isInputElement(element)) {
    return element
  }

  //@ts-ignore
  if (element.children) {
    //@ts-ignore
    for (const node of element.children) {
      // @ts-ignore
      if (isInputElement(node) && (node.value || node.textContent)) {
        return node
      }
    }
  }
}

// This functions provides the 'to be' range and text content
// Needed because keydown event happens before there is a selection or content change
export function getUpcomingData(selection: Selection) {
  const ogRange = selection.getRangeAt(0)
  mog('selection', { selection })
  // Shifitng both start and end offset to simulate backwards caret movement
  const range = ogRange.cloneRange()
  range.setStart(ogRange.startContainer, ogRange.startOffset - 1)
  range.setEnd(ogRange.endContainer, ogRange.endOffset - 1)

  // delete last character of current content
  const text = selection.anchorNode.textContent.slice(0, -1)

  return { range, text }
}

export const simulatePaste = () => {
  document.execCommand('paste')
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
