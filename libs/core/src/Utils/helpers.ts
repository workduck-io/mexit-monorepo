import { SuperBlocks } from '../Types'
import { NodeContent, NodeProperties } from '../Types/Editor'

import { ELEMENT_PARAGRAPH } from './editorElements'
import { generateNodeUID, generateTempId, SEPARATOR } from './idGenerator'

export function wrapErr<T>(f: (result: T) => void) {
  return (err: any, result: T) => {
    if (err) {
      console.error({ error: JSON.stringify(err) })
      return
    } else f(result)
  }
}

export const defaultContent: NodeContent = {
  type: 'init',
  content: [
    {
      id: generateTempId(),
      type: SuperBlocks.CONTENT,
      children: [{ type: ELEMENT_PARAGRAPH, id: generateTempId(), children: [{ text: '' }] }]
    }
  ],
  version: -1
}

export const getBasicContent = (type: string = ELEMENT_PARAGRAPH) => ({
  type,
  id: generateTempId(),
  children: [{ text: '' }]
})

export const URL_DOMAIN_REG = /:\/\/(.[^/]+)/

export const getDefaultContent = (type: string = SuperBlocks.CONTENT) => ({
  ...defaultContent.content[0],
  type,
  id: generateTempId()
})

export const typeInvert = (type: string) => (type === 'from' ? 'to' : 'from')

// Returns an array of unique values via Set
export const Settify = <T>(arr: T[]): T[] => Array.from(new Set(arr))

export const createNodeWithUid = (key: string, namespace: string): NodeProperties => ({
  title: key.split(SEPARATOR).slice(-1)[0],
  id: key,
  nodeid: generateNodeUID(),
  path: key,
  namespace
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
