import React from 'react'

import Lookup from './Modals/Lookup'
import Refactor from './Refactor'
import Delete from './Refactor/DeleteModal'
import Rename from './Refactor/Rename'
import { useAuthStore } from '../Stores/useAuth'
import HelpModal from '../Views/HelpModal'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return null
  return (
    <>
      <Lookup />
      <Refactor />
      <Rename />
      <Delete />
      <HelpModal />
    </>
  )
}

export default Modals
