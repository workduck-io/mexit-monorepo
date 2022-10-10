import React, { useEffect, useState } from 'react'

import Modal from 'react-modal'
import styled from 'styled-components'

import { tinykeys } from '@workduck-io/tinykeys'

import { mog, QuickLinkType } from '@mexit/core'
import { Input, StyledInputWrapper } from '@mexit/shared'
import { StyledCombobox } from '@mexit/shared'

import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import NodeSelect, { QuickLink } from '../NodeSelect/NodeSelect'

const StyledModal = styled(Modal)`
  z-index: 10010000;
  width: 40rem;
`

export const Brackets = styled.span`
  padding: 0.6rem;
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.colors.form.input.bg};
  color: ${(props) => props.theme.colors.text.disabled};
  font-weight: 500;
  opacity: 0.4;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: ${({ theme }) => theme.spacing.large} 0;
  transition: all 0.2s ease-in-out;
  width: 440px;

  ${StyledCombobox} {
    ${Input}, ${StyledInputWrapper} {
      width: auto;
      flex-shrink: 1;
      flex-grow: 1;
      border: 1px solid ${({ theme }) => theme.colors.form.input.bg};
    }
    ${Input} {
      border-radius: 0;
      padding: ${(props) => props.theme.spacing.medium} 8px;
    }
  }
`

const Lookup = () => {
  const [open, setOpen] = useState(false)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const { goTo, location } = useRouting()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { createNewNote } = useCreateNewNote()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

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
  }, [shortcuts, shortcutDisabled, shortcutHandler])

  const { push } = useNavigation()

  const openNode = (quickLink: QuickLink) => {
    if (quickLink.type === QuickLinkType.snippet) {
      loadSnippet(quickLink.nodeid)
      goTo(ROUTE_PATHS.snippet, NavigationType.push, quickLink.nodeid)
    } else {
      const nodeid = quickLink.nodeid

      push(nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
    closeModal()
  }

  const handleSelectItem = (quickLink: QuickLink) => {
    const path = location.pathname
    if (`${ROUTE_PATHS.node}/${quickLink.nodeid}` === path) {
      // mog('This value is already opened', {})
      closeModal()
      return
    }
    openNode(quickLink)
  }

  const handleCreateItem = async (inputValue: QuickLink) => {
    createNewNote({ path: inputValue.value, namespace: inputValue?.namespace })
    closeModal()
  }

  return (
    <StyledModal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <InputWrapper>
        <Brackets>[[</Brackets>
        <NodeSelect
          id="lookup"
          name="lookup"
          menuOpen
          showAll
          autoFocus
          prefillRecent
          menuOverlay={false}
          handleSelectItem={handleSelectItem}
          handleCreateItem={handleCreateItem}
        />
        <Brackets>]]</Brackets>
      </InputWrapper>
    </StyledModal>
  )
}

export default Lookup
