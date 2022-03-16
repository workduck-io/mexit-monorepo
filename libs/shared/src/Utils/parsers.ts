import { GenericSearchData } from '../Types/Search'
import { Snippet } from '../Types/Snippet'

export const parseBlock = (content: any[], join?: string): string => {
  const text: string[] = []
  content.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const childText = parseBlock(n.children)
      text.push(childText)
    }
  })
  return text.join(join ?? '')
}

export const parseNode = (node: any, title: string): GenericSearchData[] => {
  const nodeUID = node.id
  const result: GenericSearchData[] = []

  node.content.forEach((block) => {
    const blockText = parseBlock(block.children)
    if (blockText.length !== 0) {
      const temp: GenericSearchData = { id: block.id, text: blockText, nodeUID: nodeUID, title: title }
      result.push(temp)
    }
  })

  return result
}

export const parseSnippet = (snippet: Snippet): GenericSearchData => {
  const snip: GenericSearchData = {
    id: snippet.id,
    title: snippet.title,
    text: parseBlock(snippet.content)
  }
  return snip
}
