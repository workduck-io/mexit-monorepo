import HighlightSource from 'web-highlighter/dist/model/source'

export type NodeEditorContent = any[]

export interface Content {
  id: string
  content: NodeEditorContent
  range: Partial<HighlightSource>
}

export interface Contents {
  [key: string]: Content[]
}
