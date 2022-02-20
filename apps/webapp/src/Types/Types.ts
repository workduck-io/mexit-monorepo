export type NodeEditorContent = any[]

export interface CacheTag {
  nodes: string[]
}

export type TagsCache = Record<string, CacheTag>
