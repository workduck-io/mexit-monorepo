import React, { useEffect } from 'react'

import arrowRightLine from '@iconify/icons-ri/arrow-right-line'
import { Icon } from '@iconify/react'
import Modal from 'react-modal'

import { Button } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { isReserved, NodeLink } from '@mexit/core'

import { useInternalLinks } from '../../Hooks/useInternalLinks'
import { useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useRefactorStore } from '../../Stores/useRefactorStore'
import { ModalControls, ModalHeader, MRMHead, MRMRow } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'

const Refactor = () => {
  const open = useRefactorStore((store) => store.open)
  const focus = useRefactorStore((store) => store.focus)
  const to = useRefactorStore((store) => store.to)
  const from = useRefactorStore((store) => store.from)
  const mockRefactored = useRefactorStore((store) => store.mockRefactored)

  const openModal = useRefactorStore((store) => store.openModal)
  const closeModal = useRefactorStore((store) => store.closeModal)
  const setMockRefactored = useRefactorStore((store) => store.setMockRefactored)
  const setTo = useRefactorStore((store) => store.setTo)
  const setFrom = useRefactorStore((store) => store.setFrom)
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()

  const { push } = useNavigation()

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRefactor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showRefactor, () => {
          openModal()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

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

  const { getMockRefactor, execRefactor } = useRefactor()
  const { getNodeidFromPath } = useLinks()

  useEffect(() => {
    // mog('Refactor', { open, to, from })
    if (to && from && !isReserved(from) && !isReserved(to)) {
      // mog('To, from in refactor', { to, from })
      setMockRefactored(getMockRefactor(from, to))
    }
  }, [to, from, open])

  // console.log({ mockRefactored });

  const handleRefactor = async () => {
    const { addedILinks, removedILinks } = (await execRefactor(from, to)) as any

    updateILinksFromAddedRemovedPaths(addedILinks?.ilinks, removedILinks?.ilinks)

    // const path = useEditorStore.getState().node.path
    // const nodeid = useEditorStore.getState().node.nodeid

    // if (doesLinkRemain(path, res)) {
    //   push(nodeid, { savePrev: false })
    // } else if (res.length > 0) {
    //   const nodeid = getNodeidFromPath(res[0].to)
    //   push(nodeid, { savePrev: false })
    // }

    closeModal()
  }

  // mog('Refactor', { open, focus, to, from, mockRefactored })
  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Refactor</ModalHeader>

      <WrappedNodeSelect
        // defaultValue={from}
        placeholder="Refactor From Node..."
        menuOpen={focus}
        autoFocus={focus}
        defaultValue={from ?? useEditorStore.getState().node.id}
        highlightWhenSelected
        disallowReserved
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        // defaultValue={to}
        placeholder="Refactor To Node..."
        highlightWhenSelected
        createAtTop
        disallowClash
        iconHighlight={to !== undefined}
        defaultValue={to ?? ''}
        handleSelectItem={handleToChange}
        handleCreateItem={handleToCreate}
      />

      {/* TODO: Mock refactored is returning the wrong results */}
      {/* {mockRefactored.length > 0 && (
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
      )} */}
      <ModalControls>
        <Button primary autoFocus={!focus} large onClick={handleRefactor}>
          Apply Refactor
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Refactor
