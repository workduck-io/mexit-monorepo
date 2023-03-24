import Modal from 'react-modal'

import { useHelpStore } from '@mexit/core'

import ShortcutTable from '../Components/ShortcutTable'

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
