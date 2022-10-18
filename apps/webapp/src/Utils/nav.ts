export const showNav = (pathname: string): boolean => {
  if (pathname === '/') return true
  const showNavPaths = [
    '/editor',
    '/search',
    '/snippets',
    '/archive',
    '/tasks',
    '/settings',
    '/tag',
    '/integrations',
    '/reminders'
  ]

  for (const path of showNavPaths) {
    if (pathname.startsWith(path)) return true
  }

  return false
}