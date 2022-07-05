// Direct properties are collated in the properties for api
// and then unfurled when converting back to editor content
export const directPropertyKeys = [
  'bold',
  'italic',
  'underline',
  'highlight',
  'code',
  'url',
  'value',
  'blockValue',
  'checked',
  'blockId',
  'body'
]
export const PropKeysArray = [...directPropertyKeys] as const
export type PropKeys = typeof PropKeysArray[number]
export type DirectProperties = Record<PropKeys, boolean | string>

// Keys that will be replicated as is
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

export const generateElementMetadata = (
  elementMetadata: PartialBy<ElementHighlightMetadata, 'type'>
): ElementHighlightMetadata => {
  delete elementMetadata.saveableRange['__isHighlightSource']
  return {
    ...elementMetadata,
    type: 'highlight'
  }
}