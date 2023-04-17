import { ROUTE_PATHS } from '../Hooks/useRouting'

export const showNav = (pathname: string): boolean => {
  if (pathname === '/') return true
  const showNavPaths = [
    '/editor',
    '/search',
    '/snippets',
    '/archive',
    '/view',
    '/settings',
    '/tag',
    '/integrations',
    '/reminders',
    '/personal',
    ROUTE_PATHS.links
  ]

  for (const path of showNavPaths) {
    if (pathname.startsWith(path)) return true
  }

  return false
}
