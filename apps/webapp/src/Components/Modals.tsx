import React from 'react'

import Lookup from './Modals/Lookup'
import Refactor from './Refactor'
import Delete from './Refactor/DeleteModal'
import { useAuthStore } from '../Stores/useAuth'
import HelpModal from '../Views/HelpModal'
import { BlockModal } from '../Editor/Styles/Block'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return null
  return (
    <>
      <Lookup />
      <Refactor />
      <Delete />
      <HelpModal />
      <BlockModal />
    </>
  )
}

export default Modals
