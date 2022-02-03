import { Document } from 'flexsearch'
import { NodeSearchData, ActivityNode } from '../Types/data'

export const createFlexsearchIndex = (initList: NodeSearchData[]) => {
  const options = {
    document: {
      id: 'ID',
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

export const convertContentToRawText = (content: any[], join?: string): string => {
  const text: string[] = []
  content.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children)
      text.push(childText)
    }
  })
  return text.join(join ?? '')
}

export const convertEntryToRawText = (nodeUID: string, entry: any[]): NodeSearchData => {
  return { nodeUID: nodeUID, title: '', text: convertContentToRawText(entry) }
}

export const convertDataToRawText = (activityNode: ActivityNode): NodeSearchData[] => {
  const result: NodeSearchData[] = []
  const titleNodeMap = new Map<string, string>()
  data.ilinks.forEach((entry) => {
    titleNodeMap.set(entry.uid, entry.text)
  })

  Object.entries(data.contents).forEach(([k, v]) => {
    if (v.type === 'editor' && k !== '__null__') {
      const temp: NodeSearchData = convertEntryToRawText(k, v.content)
      temp.title = titleNodeMap.get(k)
      result.push(temp)
    }
  })
  return result
}
