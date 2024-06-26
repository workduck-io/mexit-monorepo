import { useAuthStore } from '@mexit/core'

import BlockModal from '../Editor/Components/Blocks/BlockModal'
import HelpModal from '../Views/HelpModal'

import ShareModal from './Mentions/ShareModal'
import CreateTodoModal, { CreateNewSection } from './Modals/CreateTodoModal'
import DeleteSpaceModal from './Modals/DeleteSpaceModal'
import Lookup from './Modals/Lookup'
import MangeSpacesModal from './Modals/ManageSpacesModal'
import Delete from './Refactor/DeleteModal'
import CreateReminderModal from './Reminders/CreateReminderModal'
import TemplateModal from './Template/TemplateModal'
import FleetContainer from './FleetContainer'
import PreviewNoteModal from './PreviewNoteModal'
import TaskViewModal from './TaskViewModal'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return null

  return (
    <>
      <Lookup />
      <Delete />
      <HelpModal />
      <BlockModal />
      <ShareModal />
      <CreateReminderModal />
      <CreateTodoModal>
        <CreateNewSection />
      </CreateTodoModal>
      <TaskViewModal />
      <PreviewNoteModal />
      <MangeSpacesModal />
      <FleetContainer />
      <TemplateModal />
      <DeleteSpaceModal />
    </>
  )
}

export default Modals
