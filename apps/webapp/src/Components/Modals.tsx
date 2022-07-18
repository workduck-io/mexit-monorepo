import React from 'react'

import Lookup from './Modals/Lookup'
import Refactor from './Refactor'
import Delete from './Refactor/DeleteModal'
import { useAuthStore } from '../Stores/useAuth'
import HelpModal from '../Views/HelpModal'
import CreateReminderModal from './Reminders/CreateReminderModal'
import BlockModal from '../Editor/Components/Blocks/BlockModal'
import ShareModal from './Mentions/ShareModal'
import GameModal from '../Views/GameModal'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return null

  return (
    <>
      <Lookup />
      <Refactor />
      <Delete />
      <HelpModal />
      <GameModal />
      <BlockModal />
      <CreateReminderModal />
      <ShareModal />
    </>
  )
}

export default Modals
