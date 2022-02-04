export interface BlockIndexData {
  blockUID: string
  nodeUID: string
  text: string
}

export interface Metadata {
  createdBy: string
  createdAt: number
  lastEditedBy: string
  updatedAt: number
}
export interface Block {
  id: string // Block ID of form `BLOCK_`
  nodeUID: string // UID of node to which this block belongs
  children: any[]
  metadata?: Metadata // Block level metadata
  type?: string
}

export interface Node {
  id: string
  content: Block[]
  metadata?: Metadata // Node level metadata
}

export interface FlexSearchResult {
  blockUID: string
  nodeUID: string
  text: string
  matchField: string[]
}
