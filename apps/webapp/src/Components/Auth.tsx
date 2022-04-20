import React from 'react'
import mixpanel from 'mixpanel-browser'

import { Button } from '@mexit/shared'
import { useAuthentication } from '../Stores/useAuth'

export const Logout = () => {
  const { logout } = useAuthentication()

  const onLogout = () => {
    logout()
    mixpanel.track('Logged Out')
    mixpanel.reset()
  }

  return <Button onClick={onLogout}>Logout</Button>
}
