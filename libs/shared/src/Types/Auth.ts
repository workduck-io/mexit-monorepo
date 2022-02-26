import { State } from 'zustand'

export interface LoginFormData {
  email: string
  password: string
}

export interface Option {
  label: string
  value: string
}

export interface RegisterFormData {
  name: string
  roles: Option[]
  email: string
  password: string
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
  email: string
  userId: string
  activityNodeUID?: string
}

export interface WorkspaceDetails {
  name: string
  id: string
}

export interface AuthStoreState extends State {
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  setAuthenticated: (userDetails: UserDetails, workspaceDetails: WorkspaceDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  getWorkspaceId: () => string | undefined
}
