import { ElementHighlightMetadata } from '../Utils/serializer'

export interface Highlight {
  elementMetadata: ElementHighlightMetadata
  nodeId: string
  shared?: boolean
}

export interface SourceHighlights {
  [blockId: string]: Highlight
}

export interface Highlighted {
  [sourceURL: string]: SourceHighlights
}
