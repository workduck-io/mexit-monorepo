import React, { useCallback, useEffect } from 'react'

import arrowRightLine from '@iconify/icons-ri/arrow-right-line'
import { Icon } from '@iconify/react'
import Modal from 'react-modal'

import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { isMatch, isReserved, mog, NodeLink } from '@mexit/core'

import { useInternalLinks } from '../../Hooks/useInternalLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useRefactorStore } from '../../Stores/useRefactorStore'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { ArrowIcon, MockRefactorMap, ModalControls, ModalHeader, MRMHead, MRMRow } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { doesLinkRemain } from './doesLinkRemain'

const Refactor = () => {
  const open = useRefactorStore((store) => store.open)
  const focus = useRefactorStore((store) => store.focus)
  const from = useRefactorStore((store) => store.from)
  const to = useRefactorStore((store) => store.to)
  const fromNS = useRefactorStore((store) => store.fromNS)
  const toNS = useRefactorStore((store) => store.toNS)
  const openModal = useRefactorStore((store) => store.openModal)
  const closeModal = useRefactorStore((store) => store.closeModal)
  const setTo = useRefactorStore((store) => store.setTo)
  const setFrom = useRefactorStore((store) => store.setFrom)
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()

  const mockRefactored = useRefactorStore((store) => store.mockRefactored)
  const setMockRefactored = useRefactorStore((store) => store.setMockRefactored)
  const namespaces = useDataStore((store) => store.namespaces)
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)

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
    const newNS = quickLink.namespace ?? namespaces[0].id
    if (newValue && newNS) {
      setFrom({ path: newValue, namespaceID: newNS })
    }
  }
  const handleToChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    const newNS = quickLink.namespace ?? currentSpace ?? namespaces[0].id
    if (newValue && newNS) {
      setTo({ path: newValue, namespaceID: newNS })
    }
  }

  const handleToCreate = (quickLink: QuickLink) => {
    const inputValue = quickLink.value
    const newNS = quickLink.namespace ?? currentSpace ?? namespaces[0].id
    if (inputValue && newNS) {
      setTo({ path: inputValue, namespaceID: newNS })
    }
  }

  const { getMockRefactor, execRefactorAsync } = useRefactor()

  useEffect(() => {
    // mog('Refactor', { open, to, from })
    if (to && from && !isReserved(from) && !isReserved(to)) {
      // mog('To, from in refactor', { to, from })
      setMockRefactored(getMockRefactor(from, to, true, false))
    }
  }, [to, from, open])

  const handleRefactor = useCallback(async () => {
    // mog('Refactor', { open, to, from })
    if (to && from && !isReserved(from) && !isReserved(to)) {
      const refactored = await execRefactorAsync({ path: from, namespaceID: fromNS }, { path: to, namespaceID: toNS })

      const nodeid = useEditorStore.getState().node.nodeid

      if (doesLinkRemain(nodeid, refactored)) {
        push(nodeid, { savePrev: false })
      }
    }

    closeModal()
  }, [to, from, open, toNS, fromNS])

  useEffect(() => {
    if (open) {
      const unsubscribe = tinykeys(window, {
        '$mod+Enter': (event) => {
          event.preventDefault()
          handleRefactor()
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [shortcuts, shortcutDisabled, open, handleRefactor])

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Refactor</ModalHeader>

      <WrappedNodeSelect
        // defaultValue={from}
        placeholder="Refactor From Node..."
        menuOpen={focus}
        autoFocus={focus}
        autoFocusSelectAll
        defaultValue={
          from
            ? { path: from, namespace: fromNS }
            : {
                path: useEditorStore.getState().node.path,
                namespace: useEditorStore.getState().node.namespace
              }
        }
        highlightWhenSelected
        disallowReserved
        iconHighlight={from !== undefined}
        handleSelectItem={handleFromChange}
      />

      <WrappedNodeSelect
        // defaultValue={to}
        placeholder="Refactor To Node..."
        highlightWhenSelected
        disallowMatch={(path) => isMatch(path, from)}
        createAtTop
        disallowClash
        iconHighlight={to !== undefined}
        defaultValue={to ? { path: to, namespace: toNS } : undefined}
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
        <Button primary autoFocus={!focus} large onClick={handleRefactor}>
          Apply
          <DisplayShortcut shortcut={'$mod+Enter'} />
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Refactor
