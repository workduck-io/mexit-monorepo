export type CalendarProviderType = {
  actionGroupId: string
  authConfig: {
    authURL: string
  }
  icon: string
  name: string
  description: string
}

export type PersistAuth = {
  accessToken: string
  refreshToken: string
  email: string
  expiresIn: number
}
