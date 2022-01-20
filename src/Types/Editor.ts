export type NodeEditorContent = any[]

export interface Content {
  content: NodeEditorContent
}

export interface Contents {
  [key: string]: Content
}
