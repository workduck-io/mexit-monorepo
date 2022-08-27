import React, { useEffect } from 'react'

import archiveLine from '@iconify/icons-ri/archive-line'
import { Icon } from '@iconify/react'
import { isReserved, mog, USE_API } from '@mexit/core'
import { Button } from '@workduck-io/mex-components'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { useLocation } from 'react-router-dom'
import create from 'zustand'

import { tinykeys } from '@workduck-io/tinykeys'

import { isReserved, mog, USE_API } from '@mexit/core'


import { useDelete } from '../../Hooks/useDelete'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import useLoad from '../../Hooks/useLoad'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { ModalHeader, MockRefactorMap, MRMHead, MRMRow, DeleteIcon, ModalControls } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'

interface DeleteStoreState {
  open: boolean
  focus: boolean
  mockRefactored: string[]
  del: string | undefined
  openModal: (id?: string) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  setDel: (del: string) => void
  setMockRefactored: (mr: string[]) => void
  setDelAndRefactored: (del: string, mR: string[]) => void
}

export const useDeleteStore = create<DeleteStoreState>((set) => ({
  open: false,
  mockRefactored: [],
  del: undefined,
  focus: true,
  openModal: (id) => {
    if (id) {
      set({ open: true, del: id })
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
  const { getMockDelete, execDelete } = useDelete()
  const { loadNode } = useLoad()
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
        event.preventDefault()
        shortcutHandler(shortcuts.showArchiveModal, () => {
          const node = useEditorStore.getState().node
          goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
          openModal(useEditorStore.getState().node.id)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, location.pathname])

  const handleDeleteChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    saveAndClearBuffer()
    if (newValue) {
      setDel(newValue)
    }
  }

  // const { del, mockData, open } = deleteState
  useEffect(() => {
    if (del && !isReserved(del)) {
      setMockRefactored(getMockDelete(del).archivedNodes.map((item) => item.path))
    }
  }, [del])

  const handleDelete = () => {
    const { toLoad } = execDelete(del)

    // Load this node after deletion
    mog('handling delete', { toLoad, del })
    loadNode(toLoad, { savePrev: false, fetch: USE_API() })
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Archive</ModalHeader>

      <WrappedNodeSelect
        autoFocus
        // menuOpen
        disallowReserved
        defaultValue={del ?? useEditorStore.getState().node.path}
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
        </Button>
        <Button large primary disabled={mockRefactored.length < 1} onClick={handleDelete}>
          Archive
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default Delete
