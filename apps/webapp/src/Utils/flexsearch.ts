import { SearchIndex, GenericSearchData, ILink, parseNode, parseSnippet } from '@mexit/core'
import { Document } from 'flexsearch'

import { indexNames } from '../Data/constants'

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

export const createSearchIndex = (ilinks, initData: Record<indexNames, any[]>): SearchIndex => {
  const initList: Record<indexNames, any> = convertDataToIndexable(ilinks, initData)
  // Pass options corrwectly depending on what fields are indexed ([title, text] for now)
  return {
    node: initList.node ? createGenricSearchIndex(initList.node) : null,
    snippet: initList.snippet ? createGenricSearchIndex(initList.snippet) : null,
    archive: initList.archive ? createGenricSearchIndex(initList.archive) : null
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
    res.node = [...res.node, ...blocks]
  })

  archiveData.forEach((archivedNode) => {
    const blocks = parseNode(archivedNode, titleNodeMap.get(archivedNode.id))
    res.archive = [...res.archive, ...blocks]
  })

  snippetData.forEach((snippet) => {
    res.snippet.push(parseSnippet(snippet))
  })

  return res
}
