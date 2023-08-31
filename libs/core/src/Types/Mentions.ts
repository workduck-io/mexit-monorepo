import { UserDetails } from './Auth'

export interface SelfMention extends UserDetails {
  type: 'self'
}

export type UserAccessTable = {
  [key in ShareContext]: { [entityid: string]: AccessLevel }
}

export interface IUser {
  email: string
  alias: string
  access: UserAccessTable
}

export interface InvitedUser extends IUser {
  type: 'invite'
}

export type AccessLevel = 'MANAGE' | 'WRITE' | 'READ' | 'OWNER'

export enum AccessLevelPrority {
  READ,
  WRITE,
  MANAGE,
  OWNER
}

export const permissionOptions: {
  value: AccessLevel
  label: string
}[] = [
  { value: 'MANAGE', label: 'Can manage' },
  { value: 'WRITE', label: 'Can edit' },
  { value: 'READ', label: 'Can view' }
]

export const DefaultPermission = 'MANAGE'
export const DefaultPermissionValue = { value: 'MANAGE', label: 'Can manage' }

export interface AccessMap {
  [nodeid: string]: AccessLevel
}

export interface Mentionable extends IUser {
  type: 'mentionable'
  id: string
  name: string
}

export type ShareContext = 'note' | 'space' | 'view'

export interface MentionData {
  mentionable: Mentionable[]
  invitedUsers: InvitedUser[]
}

export const emptyAccessTable: UserAccessTable = {
  note: {},
  space: {},
  view: {}
}
