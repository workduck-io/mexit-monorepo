import { State } from 'zustand'

import { MIcon } from './Store'

export interface LoginFormData {
  email: string
  password: string
}

export interface Option {
  label: string
  value: string
}

export interface Workspace {
  id: string
  name?: string
  icon?: MIcon
  createdAt?: string
  updatedAt?: string
}

export interface RegisterFormData {
  name: string
  roles: Option[]
  email: string
  password: string
  confirmPassword?: string
  alias: string
  invite?: string
}

export interface ForgotPasswordFormData {
  email: string
  newpassword: string
  confirmNewPassword: string
}
export interface VerifyFormData {
  code: string
}

export const UserRoleValues = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'testing', label: 'Testing' }
]

export interface UserCred {
  email: string
  userId: string
  token: string
  expiry: number
  url: string
}

export interface UserDetails {
  email?: string
  id?: string
  name: string
  alias: string
  roles?: Array<string>
}

export interface WorkspaceDetails {
  name: string
  id: string
}

export interface UpdatableUserDetails {
  name?: string
  alias?: string
}

export enum AppInitStatus {
  START,
  RUNNING,
  COMPLETE,
  ERROR,
  SWITCH
}

export interface AuthStoreState extends State {
  isForgottenPassword: boolean
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  appInitStatus?: AppInitStatus
  setAppInitStatus: (appInitStatus: AppInitStatus) => void
  setIsUserAuthenticated: () => void
  setAuthenticated: (userDetails: UserDetails, workspaceDetails: WorkspaceDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  setIsForgottenPassword: (val: boolean) => void
  getWorkspaceId: () => string | undefined
  updateUserDetails: (userDetails: UpdatableUserDetails) => void
}

export interface MexUser {
  name: string
  email: string
  userID: string
}
