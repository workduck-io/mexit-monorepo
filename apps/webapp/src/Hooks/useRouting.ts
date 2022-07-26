import { useEffect } from 'react'

import { matchPath, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

export const ROUTE_PATHS = {
  home: '/',
  auth: '/auth',
  login: '/auth/login',
  register: '/auth/register',
  archive: '/archive',
  tasks: '/tasks',
  reminders: '/reminders',
  tag: '/tag', // * /tag/:tag
  editor: '/editor',
  node: '/editor', // * /node/:nodeid
  search: '/search',
  settings: '/settings',
  //   integrations: '/integrations',
  snippets: '/snippets',
  snippet: '/snippets/node', // * /snippets/node/:snippetid
  chotu: '/chotu',
  actions: '/actions',
  oauth: '/oauth',
  oauthdesktop: '/oauth/desktop',
  share: '/share',
  forgotpassword: '/auth/forgotpassword',
  integrations: '/integrations'
}

export enum NavigationType {
  push,
  replace
}

export const useRouting = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const goTo = (basePath: string, type: NavigationType, id?: string, query?: Record<string, any>) => {
    const path = id ? `${basePath}/${id}` : basePath
    const state = { from: location.pathname, ...query }

    if (type === NavigationType.push) navigate(path, { state })

    if (type === NavigationType.replace) navigate(path, { replace: true, state })
  }

  const getParams = (path: string) => {
    const match = matchPath(location.pathname, path)

    return match?.params
  }

  return { goTo, location, params, getParams }
}
