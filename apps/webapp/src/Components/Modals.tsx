import React from 'react'

import BlockModal from '../Editor/Components/Blocks/BlockModal'
import { useAuthStore } from '../Stores/useAuth'
import HelpModal from '../Views/HelpModal'
import FleetContainer from './FleetContainer'
import ShareModal from './Mentions/ShareModal'
import CreateTodoModal from './Modals/CreateTodoModal'
import Lookup from './Modals/Lookup'
import PreviewNoteModal from './PreviewNoteModal'
import Refactor from './Refactor'
import Delete from './Refactor/DeleteModal'
import CreateReminderModal from './Reminders/CreateReminderModal'
import TaskViewModal from './TaskViewModal'

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
      <ShareModal />
      <CreateReminderModal />
      <CreateTodoModal />
      <TaskViewModal />
      <PreviewNoteModal />
      <FleetContainer />
    </>
  )
}

export default Modals
