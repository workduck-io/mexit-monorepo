// Direct properties are collated in the properties for api
import { BlockMetaDataType } from '../Stores/blockStoreConstructor'
import { ElementHighlightMetadata2 } from '../Types/Highlight'

// and then unfurled when converting back to editor content
export const directPropertyKeys = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'highlight',
  'code',
  'email',
  'url',
  'caption',
  'value',
  'blockValue',
  'checked',
  'blockId',
  'body',
  'align',
  'questionId',
  'question',
  'answer',
  'actionContext',
  'blockMeta',
  'status',
  'priority'
]
export const PropKeysArray = [...directPropertyKeys] as const
export type PropKeys = typeof PropKeysArray[number]
export type DirectProperties = Record<PropKeys, boolean | string>

// Keys that will be replicated as <D-b>
export const directKeys = []

// Keys that will be mapped to different key
export const mappedKeys = {
  text: 'content'
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface HighlightMetaBlock {
  parentTagName: string
  parentIndex: number
  textOffset: number
}

export interface ElementHighlightMetadata {
  type: string
  saveableRange: {
    startMeta: HighlightMetaBlock
    endMeta: HighlightMetaBlock
    text: string
    id: string
  }
  sourceUrl: string
}

export const generateElementMetadata = (elementMetadata: ElementHighlightMetadata2): ElementHighlightMetadata2 => {
  // delete elementMetadata.saveableRange['__isHighlightSource']
  return {
    ...elementMetadata,
    type: 'highlightV1'
  }
}

export const getBlockMetadata = (text: string, meta?: BlockMetaDataType): BlockMetaDataType => {
  const metadata = meta || {}

  // * Origin of the block
  if (!metadata?.origin) return { ...metadata, source: text, origin: text }

  return { ...metadata, source: text }
}

/**
 *
 */
export const getHighlightBlockMap = (nodeId: string, content: any[]) => {
  const nodeBlockMap = {
    nodeId,
    blockIds: []
  }
  content.forEach((item) => {
    if (item?.metadata?.elementMetadata) {
      nodeBlockMap.blockIds.push(item.id)
    }
  })
  return nodeBlockMap
}
