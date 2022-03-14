import { Snippet } from './../Stores/useSnippetStore'
import { Document } from 'flexsearch'
import { BlockIndexData, Node } from '../Types/Data'

import { indexNames } from '../Data/constants'
import { GenericSearchData, GenericSearchResult, SearchIndex } from '../Types/Search'
import { ILink } from '../Types/Data'

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

export const parseNode = (node: Node, title: string): GenericSearchData[] => {
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

export const createSearchIndex = (ilinks, initData: Record<indexNames, any[]>): SearchIndex => {
  const initList: Record<indexNames, any> = convertDataToIndexable(ilinks, initData)
  // Pass options corrwectly depending on what fields are indexed ([title, text] for now)
  return {
    node: createGenricSearchIndex(initList.node),
    snippet: createGenricSearchIndex(initList.snippet),
    archive: createGenricSearchIndex(initList.archive)
  }
}

export const createGenricSearchIndex = (
  initList: GenericSearchData[],
  options: any = {
    document: {
      id: 'id',
      index: ['title', 'text']
    },
    tokenize: 'full'
  }
): Document<GenericSearchData> => {
  const index = new Document<GenericSearchData>(options)
  initList.forEach((i) => index.add(i))
  return index
}

export const convertDataToIndexable = (
  ilinks: ILink[],
  data: Record<indexNames, any[]>
): Record<indexNames, GenericSearchData[]> => {
  const titleNodeMap = new Map<string, string>()

  ilinks.forEach((ilink) => {
    titleNodeMap.set(ilink.nodeid, ilink.path)
  })

  const nodeData = data.node
  const archiveData = data.archive
  const snippetData = data.snippet

  const res = {
    node: [],
    archive: [],
    snippet: []
  }

  nodeData.forEach((node) => {
    const blocks = parseNode(node, titleNodeMap.get(node.id))
    res.node.concat(blocks)
  })

  archiveData.forEach((archivedNode) => {
    const blocks = parseNode(archivedNode, titleNodeMap.get(archivedNode.id))
    res.archive.concat(blocks)
  })

  snippetData.forEach((snippet) => {
    res.snippet.push(parseSnippet(snippet))
  })

  return res
}
