import { MIcon } from './Store'

export interface Reaction {
  nodeId: string
  blockId: string
  userId?: string
  // ICON
  reaction: MIcon
}

export type APIReaction = Omit<Reaction, 'userId'>

export interface UserReaction {
  reactions: MIcon[]
  userId: string
}
