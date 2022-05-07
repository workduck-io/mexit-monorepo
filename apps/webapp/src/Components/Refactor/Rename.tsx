import React, { useEffect } from 'react'
import arrowRightLine from '@iconify/icons-ri/arrow-right-line'
import { Icon } from '@iconify/react'
import Modal from 'react-modal'
import tinykeys from 'tinykeys'

import { isReserved } from '@mexit/core'
import { Button } from '@mexit/shared'

import { useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import useEditorStore from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useRenameStore } from '../../Stores/useRenameStore'
import { ModalHeader, MockRefactorMap, MRMHead, MRMRow, ArrowIcon, ModalControls } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'

const Rename = () => {
  const { execRefactor, getMockRefactor } = useRefactor()
  const { push } = useNavigation()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const open = useRenameStore((store) => store.open)
  const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)

  const openModal = useRenameStore((store) => store.openModal)
  const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const setTo = useRenameStore((store) => store.setTo)
  const setFrom = useRenameStore((store) => store.setFrom)

  const { getNodeidFromPath } = useLinks()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        event.preventDefault()
        // TODO: Fix the shortcut handler (not working after the shortcut is renamed)
        // shortcutHandler(shortcuts.showRename, () => {
        // console.log({ event })
        openModal(useEditorStore.getState().node.id)
        // })
      }
    })
    // console.log(shortcuts.showRename)
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const handleFromChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      setFrom(newValue)
    }
  }

  const handleToChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      setTo(newValue)
    }
  }

  const handleToCreate = (quickLink: QuickLink) => {
    const inputValue = quickLink.value
    if (inputValue) {
      setTo(inputValue)
    }
  }

  // const { from, to, open, mockRefactor } = renameState

  useEffect(() => {
    if (to && from && !isReserved(from) && !isReserved(from)) {
      // mog('To, from in rename', { to, from })
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from])

  const handleRefactor = () => {
    if (to && from) {
      // mog('To, from in rename exec', { to, from })
      const res = execRefactor(from, to)

      // saveDataToPersistentStorage()

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      if (doesLinkRemain(path, res)) {
        push(nodeid, { savePrev: false })
      } else if (res.length > 0) {
        const nodeid = getNodeidFromPath(res[0].to)
        push(nodeid, { savePrev: false })
      }
    }

    closeModal()
  }

  // mog('RenameComponent', { mockRefactored, to, from, ilinks: useDataStore.getState().ilinks })

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Rename</ModalHeader>

      <WrappedNodeSelect
        placeholder="Rename node from..."
        defaultValue={from ?? useEditorStore.getState().node.id}
        disallowReserved
        highlightWhenSelected
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        placeholder="Rename node to..."
        autoFocus={to === undefined}
        menuOpen={to === undefined}
        defaultValue={to}
        disallowClash
        createAtTop
        highlightWhenSelected
        iconHighlight={to !== undefined}
        handleSelectItem={handleToChange}
        handleCreateItem={handleToCreate}
      />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Notes being refactored... </h1>
            <p>{mockRefactored.length} changes</p>
          </MRMHead>
          {mockRefactored.map((t) => (
            <MRMRow key={`MyKeys_${t.from}`}>
              <p>{t.from}</p>
              <ArrowIcon>
                <Icon icon={arrowRightLine}> </Icon>
              </ArrowIcon>
              <p>{t.to}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}

      <ModalControls>
        <Button primary large onClick={handleRefactor}>
          Apply Rename
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Rename
