import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import tinykeys from 'tinykeys'

import { generateNodeId, mog } from '@mexit/core'

import { Input } from '@mexit/shared'
import { useApi } from '../../Hooks/API/useNodeAPI'

import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import NodeSelect, { QuickLink } from '../NodeSelect/NodeSelect'
import { StyledCombobox, StyledInputWrapper } from '@mexit/shared'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useNewNodes } from '../../Hooks/useNewNodes'

const StyledModal = styled(Modal)`
  z-index: 10010000;
`

const Brackets = styled.span`
  padding: 0.6rem;
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.colors.form.input.bg};
  color: ${(props) => props.theme.colors.text.disabled};
  font-weight: 500;
  opacity: 0.4;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  ${StyledCombobox} {
    ${Input} {
      border-radius: 0;
      padding: ${(props) => props.theme.spacing.medium} 8px;
    }
  }
`

const Lookup = () => {
  const [open, setOpen] = useState(false)

  const { goTo } = useRouting()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showLookup.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showLookup, () => {
          openModal()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

  const { push } = useNavigation()

  const openNode = (quickLink: QuickLink) => {
    const nodeid = quickLink.nodeid

    push(nodeid)
    goTo(ROUTE_PATHS.editor, NavigationType.push, nodeid)

    closeModal()
  }

  const handleSelectItem = (quickLink: QuickLink) => {
    const nodeid = useEditorStore.getState().node.nodeid
    if (quickLink.nodeid === nodeid) {
      mog('This value is already opened', {})
      closeModal()
      return
    }
    openNode(quickLink)
  }

  const { addNodeOrNodesFast } = useNewNodes()

  const handleCreateItem = async (inputValue: QuickLink) => {
    console.log('Input Value: ', inputValue)
    const { id } = addNodeOrNodesFast(inputValue.text, true)
    closeModal()
    mog('Created Hierarchy: ', { nodeid: id, inputValue })
    push(id)
  }

  return (
    <StyledModal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <h1 style={{ textAlign: 'center' }}>Lookup</h1>
      <InputWrapper>
        <Brackets>[[</Brackets>
        <StyledInputWrapper>
          <NodeSelect
            id="lookup"
            name="lookup"
            menuOpen
            showAll
            autoFocus
            prefillRecent
            handleSelectItem={handleSelectItem}
            handleCreateItem={handleCreateItem}
          />
        </StyledInputWrapper>
        <Brackets>]]</Brackets>
      </InputWrapper>
      {/* <LookupInput autoFocus menuOpen handleChange={handleChange} handleCreate={handleCreate} /> */}
    </StyledModal>
  )
}

export default Lookup
