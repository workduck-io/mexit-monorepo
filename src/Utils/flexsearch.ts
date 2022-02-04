import { Document } from 'flexsearch'
import { BlockIndexData, Node } from '../Types/data'

export const createFlexsearchIndex = (initList: BlockIndexData[]) => {
  const options = {
    document: {
      id: 'blockUID',
      index: ['text']
    },
    tokenize: 'full'
  }

  const index = Document(options)
  initList.forEach((i) => index.add(i))

  return index
}

export const flexIndexKeys = [
  'title.cfg',
  'title.ctx',
  'title.map',
  'text.cfg',
  'text.ctx',
  'text.map',
  'reg',
  'store',
  'tag'
]

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

export const parseNode = (node: Node): BlockIndexData[] => {
  const nodeUID = node.id
  const result: BlockIndexData[] = []

  node.content.forEach((block) => {
    const blockText = parseBlock(block.children)
    if (blockText.length !== 0) {
      const temp: BlockIndexData = { blockUID: block.id, text: blockText, nodeUID: nodeUID }
      result.push(temp)
    }
  })

  return result
}
