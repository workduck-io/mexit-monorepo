import { NodeContent, NodeEditorContent, NodeProperties } from '../Types/Editor'
import { generateNodeUID, SEPARATOR } from './idGenerator'
import { convertContentToRawText } from './parseData'

export function wrapErr<T>(f: (result: T) => void) {
  return (err: any, result: T) => {
    if (err) {
      console.error({ error: JSON.stringify(err) })
      return
    } else f(result)
  }
}

export const ELEMENT_PARAGRAPH = 'p'

export const defaultContent: NodeContent = {
  type: 'init',
  content: [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

export const typeInvert = (type: string) => (type === 'from' ? 'to' : 'from')

// Returns an array of unique values via Set
export const Settify = <T>(arr: T[]): T[] => Array.from(new Set(arr))

export const createNodeWithUid = (key: string): NodeProperties => ({
  title: key,
  id: key,
  nodeid: generateNodeUID(),
  path: key
})

/*
 * Checks for links that start with  the separator (.) and returns key and whether it is a child node i.e. starting with the separator
 * Also removes multiple separator invocations like "a.b....c..d"
 */
export const withoutContinuousDelimiter = (text: string, delimiter = SEPARATOR) => {
  const key = text
    .split(delimiter)
    .filter((ch) => ch.trim() !== '')
    .map((ch) => ch.trim())
    .join(delimiter)

  if (text?.startsWith(delimiter) && key.length > 0) return { key: `${delimiter}${key}`, isChild: true }
  return { key, isChild: false }
}

export const getBlocks = (content: NodeEditorContent): Record<string, any> | undefined => {
  if (content) {
    const blocks: Record<string, any> = {}
    let insertOp = false

    content.map((block) => {
      if (block.id) {
        if (!insertOp) insertOp = true
        const desc = convertContentToRawText(block.children)
        blocks[block.id] = { block, desc }
      }
    })

    if (insertOp) return blocks
  }

  return undefined
}
