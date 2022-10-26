import Modal from 'react-modal'

import ShortcutTable from '../Components/ShortcutTable'
import { useHelpStore } from '../Stores/useHelpStore'

const HelpModal = () => {
  const open = useHelpStore((store) => store.open)
  const closeModal = useHelpStore((store) => store.closeModal)

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ShortcutTable />
    </Modal>
  )
}

export default HelpModal
