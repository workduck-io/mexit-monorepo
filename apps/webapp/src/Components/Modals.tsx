import React from 'react'

import Lookup from './Modals/Lookup'
import Refactor from './Refactor'
import Delete from './Refactor/DeleteModal'
import { useAuthStore } from '../Stores/useAuth'
import HelpModal from '../Views/HelpModal'
import CreateReminderModal from './Reminders/CreateReminderModal'
import BlockModal from '../Editor/Components/Blocks/BlockModal'

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
      <CreateReminderModal />
    </>
  )
}

export default Modals
