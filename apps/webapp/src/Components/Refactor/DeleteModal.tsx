import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { useLocation } from 'react-router-dom'

import archiveLine from '@iconify/icons-ri/archive-line'
import { Icon } from '@iconify/react'
import create from 'zustand'

import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { isReserved } from '@mexit/core'
import { isOnEditableElement } from '@mexit/shared'

import { useKeyListener } from '../../Hooks/useChangeShortcutListener'
import { useDelete } from '../../Hooks/useDelete'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { NavigationType,ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { RefactorPath } from '../../Stores/useRenameStore'
import { DeleteIcon, MockRefactorMap, ModalControls,ModalHeader, MRMHead, MRMRow } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'

interface DeleteStoreState {
  open: boolean
  focus: boolean
  mockRefactored: string[]
  del: RefactorPath | undefined
  openModal: (del?: RefactorPath) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  setDel: (del: RefactorPath) => void
  setMockRefactored: (mr: string[]) => void
  setDelAndRefactored: (del: RefactorPath, mR: string[]) => void
}

export const useDeleteStore = create<DeleteStoreState>((set) => ({
  open: false,
  mockRefactored: [],
  del: undefined,
  focus: true,
  openModal: (del) => {
    if (del) {
      set({ open: true, del })
    } else {
      set({
        open: true
      })
    }
  },
  closeModal: () => {
    set({
      del: undefined,
      mockRefactored: [],
      open: false
    })
  },
  setFocus: (focus) => set({ focus }),
  setDel: (del) => set({ del }),
  setMockRefactored: (mockRefactored) => set({ mockRefactored }),
  setDelAndRefactored: (del, mockRefactored) => set({ del, mockRefactored })
}))

const Delete = () => {
  const { getMockArchive, execArchive } = useDelete()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const location = useLocation()
  const { goTo } = useRouting()

  const openModal = useDeleteStore((store) => store.openModal)
  const closeModal = useDeleteStore((store) => store.closeModal)
  const setDel = useDeleteStore((store) => store.setDel)
  const setMockRefactored = useDeleteStore((store) => store.setMockRefactored)

  const del = useDeleteStore((store) => store.del)
  const open = useDeleteStore((store) => store.open)
  const mockRefactored = useDeleteStore((store) => store.mockRefactored)

  const { saveAndClearBuffer } = useEditorBuffer()
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showArchiveModal.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()
          shortcutHandler(shortcuts.showArchiveModal, () => {
            const node = useEditorStore.getState().node
            goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
            openModal({
              path: useEditorStore.getState().node.path,
              namespaceID: useEditorStore.getState().node.namespace
            })
          })
        }
      },
      '$mod+Enter': (event) => {
        if (open) {
          event.preventDefault()
          handleDelete()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, open, del, shortcutDisabled, location.pathname])

  // console.log({ to, from, open });

  const handleDeleteChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    saveAndClearBuffer()
    if (newValue) {
      setDel({
        path: quickLink.value,
        namespaceID: quickLink.namespace
      })
    }
  }

  // const { del, mockData, open } = deleteState
  useEffect(() => {
    if (del && !isReserved(del.path)) {
      setMockRefactored(getMockArchive(del).archivedNodes.map((item) => item.path))
    }
  }, [del])

  const handleDelete = async () => {
    if (del && !isReserved(del.path)) {
      const res = await execArchive(del.path, del.namespaceID)
      if (res) {
        goTo(ROUTE_PATHS.node, NavigationType.replace, res.toLoad)
      }
    }
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Archive</ModalHeader>
      <WrappedNodeSelect
        autoFocusSelectAll
        autoFocus
        // menuOpen
        disallowReserved
        defaultValue={
          del
            ? { path: del.path, namespace: del.namespaceID }
            : { path: useEditorStore.getState().node.path, namespace: useEditorStore.getState().node.namespace }
        }
        handleSelectItem={handleDeleteChange}
      />

      {mockRefactored.length > 0 && (
        <MockRefactorMap>
          <MRMHead>
            <h1>Please confirm archiving the node(s):</h1>
            <p>{mockRefactored.length} changes</p>
          </MRMHead>
          {mockRefactored.map((d) => (
            <MRMRow key={`DelNodeModal_${d}`}>
              <DeleteIcon>
                <Icon icon={archiveLine}></Icon>
              </DeleteIcon>
              <p>{d}</p>
            </MRMRow>
          ))}
        </MockRefactorMap>
      )}
      <ModalControls>
        <Button large onClick={handleCancel}>
          Cancel
          <DisplayShortcut shortcut={'Esc'} />
        </Button>
        <Button large primary disabled={mockRefactored.length < 1} onClick={handleDelete}>
          Archive
          <DisplayShortcut shortcut={'$mod+Enter'} />
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Delete
