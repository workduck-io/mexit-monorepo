import React, { useState } from 'react'
import mixpanel from 'mixpanel-browser'

import { useAuthentication, useAuthStore } from '../Hooks/useAuth'
import { Button } from '../Style/Buttons'

export const Logout = () => {
  const { logout } = useAuthentication()

  const onLogout = () => {
    logout()
    mixpanel.track('Logged Out')
    mixpanel.reset()
  }

  return <Button onClick={onLogout}>Logout</Button>
}
