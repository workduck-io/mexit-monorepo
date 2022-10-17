import { NodeContent, NodeEditorContent, NodeProperties } from '../Types/Editor'
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
  content: [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

/*
 * The following regex is used to validate the format of the alias
 *
 * Rules: AlphaNumeric, no spaces, - and _ as spearator,
 * separator cannot be in the beginning or end of the alias
 *
 * See: https://stackoverflow.com/a/1223146/
 */
export const ALIAS_REG = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/

export const URL_DOMAIN_REG = /:\/\/(.[^/]+)/

export const getDefaultContent = () => ({ ...defaultContent.content[0], id: generateTempId() })

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
