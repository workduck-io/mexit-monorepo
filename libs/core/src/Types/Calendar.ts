export type CalendarProviderType = {
  actionGroupId: string
  authConfig: {
    authURL: string
  }
  icon: string
  name: string
  description: string
}

export type CalendarStoreType = {
  providers: Array<CalendarProviderType>
  setCalendarProviders: (providers: Array<CalendarProviderType>) => void
  reset: () => void
}

export type PersistAuth = {
  accessToken: string
  refreshToken: string
  email: string
  expiresIn: number
}
