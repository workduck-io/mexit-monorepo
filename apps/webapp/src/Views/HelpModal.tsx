import React, { useEffect } from 'react'

import Modal from 'react-modal'

import { tinykeys } from '@workduck-io/tinykeys'

import ShortcutTable from '../Components/ShortcutTable'
import { useKeyListener } from '../Hooks/useShortcutListener'
import { useHelpStore } from '../Stores/useHelpStore'

const HelpModal = () => {
  const open = useHelpStore((store) => store.open)
  const toggleModal = useHelpStore((store) => store.toggleModal)
  const closeModal = useHelpStore((store) => store.closeModal)

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showHelp.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showHelp, () => {
          toggleModal()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ShortcutTable />
    </Modal>
  )
}

export default HelpModal
