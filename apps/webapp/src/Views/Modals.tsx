import React from 'react'

import Lookup from '../Components/Modals/Lookup'
import { useAuthStore } from '../Stores/useAuth'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return <></>
  return (
    <>
      <Lookup />
    </>
  )
}

export default Modals
