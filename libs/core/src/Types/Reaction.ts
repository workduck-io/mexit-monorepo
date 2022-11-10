import { MIcon } from './Store'

export interface Reaction {
  nodeId: string
  blockId: string
  userId?: string[]
  count: number
  // ICON
  reaction: MIcon
}

export type APIReaction = Omit<Reaction, 'userId' | 'count'>

export interface UserReaction {
  reactions: MIcon[]
  userId: string
}
