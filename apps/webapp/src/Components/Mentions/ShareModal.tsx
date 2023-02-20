import React from 'react'
import Modal from 'react-modal'

import { useShareModalStore } from '../../Stores/useShareModalStore'

import { InviteModalContent } from './InviteModal'
import { PermissionModalContent } from './PermissionModal'

const ShareModal = () => {
  const open = useShareModalStore((store) => store.open)
  const closeModal = useShareModalStore((store) => store.closeModal)
  const mode = useShareModalStore((store) => store.mode)

  if (!open) return

  return (
    <Modal
      className={mode === 'invite' ? 'ModalContent' : 'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={closeModal}
      isOpen={open}
    >
      {mode === 'invite' ? <InviteModalContent /> : <PermissionModalContent />}
    </Modal>
  )
}

export default ShareModal
