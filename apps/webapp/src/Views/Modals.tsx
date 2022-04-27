import React from 'react'

import Lookup from '../Components/Modals/Lookup'
import Refactor from '../Components/Refactor'
import Delete from '../Components/Refactor/DeleteModal'
import Rename from '../Components/Refactor/Rename'
import { useAuthStore } from '../Stores/useAuth'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return <></>
  return (
    <>
      <Lookup />
      <Refactor />
      <Rename />
      <Delete />
    </>
  )
}

export default Modals
