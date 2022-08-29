import React from 'react'

import { Button } from '@workduck-io/mex-components'

import { useAuthentication } from '../Stores/useAuth'
import Analytics from '../Utils/analytics'

export const Logout = () => {
  const { logout } = useAuthentication()

  const onLogout = async () => {
    await logout()
  }

  return <Button onClick={onLogout}>Logout</Button>
}
