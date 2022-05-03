import { NodeEditorContent, NodeMetadata } from '@mexit/core'
import HighlightSource from 'web-highlighter/dist/model/source'

export interface Content {
  id: string
  highlighterId: string
  content: NodeEditorContent
  range: Partial<HighlightSource>
  metaData?: NodeMetadata
}

export interface Contents {
  [key: string]: Content[]
}
