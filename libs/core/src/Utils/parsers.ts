import { GenericSearchData, SearchRepExtra } from '../Types/Search'
import { Snippet } from '../Types/Snippet'
import { ELEMENT_EXCALIDRAW } from './editorElements'
import { convertContentToRawText } from './parseData'

export const parseBlock = (content: any[], join?: string): string => {
  const text: string[] = []
  content?.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const childText = parseBlock(n.children)
      text.push(childText)
    }
  })
  return text.join(join ?? ' ')
}

export const parseNode = (nodeId: string, contents: any[], title = '', extra?: SearchRepExtra): GenericSearchData[] => {
  const result: GenericSearchData[] = []
  const extraKeys = extra ? Object.keys(extra) : []
  contents.forEach((block) => {
    if (block.type === ELEMENT_EXCALIDRAW) return

    let blockText = ''
    if (block.value && block.value !== '') blockText += `${block.value}`
    if (block.url && block.url !== '') blockText += ` ${block.url}`
    blockText += ' ' + convertContentToRawText(block.children, ' ', { extra })

    if (extraKeys.includes(block.type)) {
      if (extra[block.type]) {
        const blockKey = extra[block.type].keyToIndex
        blockText = extra[block.type].replacements[block[blockKey]]
      }
    }

    // if (block.type === ELEMENT_ACTION_BLOCK) blockText = camelCase(block.actionContext?.actionGroupId)

    if (blockText.trim().length !== 0) {
      const temp: GenericSearchData = { id: nodeId, text: blockText, blockId: block.id, title, data: block }
      result.push(temp)
    }
  })

  return result
}

export const parseSnippet = (snippet: Snippet): GenericSearchData => {
  const snip: GenericSearchData = {
    id: snippet.id,
    title: snippet.title,
    text: parseBlock(snippet.content, ' ')
  }
  return snip
}
