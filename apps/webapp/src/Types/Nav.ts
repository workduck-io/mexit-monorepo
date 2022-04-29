export interface NavLinkData {
  path: string
  title: string
  icon?: React.ReactNode
  shortcut?: string
  count?: number
  isComingSoon?: boolean
}

export type NavProps = {
  links: NavLinkData[]
}
