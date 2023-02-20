import BlockModal from '../Editor/Components/Blocks/BlockModal'
import { useAuthStore } from '../Stores/useAuth'
import HelpModal from '../Views/HelpModal'

import ShareModal from './Mentions/ShareModal'
import CreateTodoModal from './Modals/CreateTodoModal'
import DeleteSpaceModal from './Modals/DeleteSpaceModal'
import Lookup from './Modals/Lookup'
import MangeSpacesModal from './Modals/ManageSpacesModal'
// import Refactor from './Refactor'
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
      <CreateTodoModal />
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
