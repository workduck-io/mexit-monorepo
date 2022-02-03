export interface NodeSearchData {
  nodeUID: string
  title?: string
  text: string
}

export type Activity = any

export interface ActivityNode {
  id: string
  data: Activity[]
  metadata?: any
}
