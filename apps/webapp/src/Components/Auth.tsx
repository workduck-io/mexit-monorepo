import React from 'react'
import { Button } from '@mexit/shared'

import { useAuthentication } from '../Stores/useAuth'
import Analytics from '../Utils/analytics'

export const Logout = () => {
  const { logout } = useAuthentication()

  const onLogout = () => {
    logout()
    Analytics.track('Logged Out')
    Analytics.reset()
  }

  return <Button onClick={onLogout}>Logout</Button>
}
