import { UserDetails } from './Auth'

export interface SelfMention extends UserDetails {
  type: 'self'
}
export interface IUser {
  email: string
  alias: string
  access: AccessMap
}

export interface InvitedUser extends IUser {
  type: 'invite'
}

export type AccessLevel = 'MANAGE' | 'WRITE' | 'READ' | 'OWNER'

export const permissionOptions: {
  value: AccessLevel
  label: string
}[] = [
  { value: 'MANAGE', label: 'Manage' },
  { value: 'WRITE', label: 'Edit' },
  { value: 'READ', label: 'View' }
]

export const DefaultPermission = 'MANAGE'
export const DefaultPermissionValue = { value: 'MANAGE', label: 'Manage' }

export interface AccessMap {
  [nodeid: string]: AccessLevel
}

export interface Mentionable extends IUser {
  type: 'mentionable'
  userID: string
  name: string
}

export interface MentionData {
  mentionable: Mentionable[]
  invitedUsers: InvitedUser[]
}
