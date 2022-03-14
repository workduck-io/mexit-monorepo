import { useLocation, useNavigate } from 'react-router-dom'

export const ROUTE_PATHS = {
  home: '/',
  login: '/login',
  register: '/register',
  //   archive: '/archive',
  tag: '/tag', // * /tag/:tag
  editor: '/editor',
  node: '/editor', // * /node/:nodeid
  search: '/search',
  settings: '/settings',
  //   tasks: '/tasks',
  //   integrations: '/integrations',
  snippets: '/snippets',
  snippet: '/snippets/node', // * /snippets/node/:snippetid
  chotu: '/chotu',
  actions: '/actions'
}

export enum NavigationType {
  push,
  replace
}

export const useRouting = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const goTo = (basePath: string, type: NavigationType, id?: string) => {
    const path = id ? `${basePath}/${id}` : basePath
    const state = { from: location.pathname }

    if (type === NavigationType.push) navigate(path, { state })

    if (type === NavigationType.replace) navigate(path, { replace: true, state })
  }

  return { goTo }
}
