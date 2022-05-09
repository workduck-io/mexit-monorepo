import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import tinykeys from 'tinykeys'

import { generateNodeId, mog } from '@mexit/core'

import { Input } from '../../Style/Form'
import { useApi } from '../../Hooks/useApi'

import useEditorStore from '../../Stores/useEditorStore'
import { useNavigation } from '../../Hooks/useNavigation'
import { useNodes } from '../../Hooks/useNodes'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import NodeSelect, { QuickLink } from '../NodeSelect/NodeSelect'
import { StyledCombobox, StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'
import useDataStore from '../../Stores/useDataStore'

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
  const { saveNewNodeAPI } = useApi()
  const checkValidILink = useDataStore((store) => store.checkValidILink)

  const { goTo } = useRouting()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const LOOKUP_SHORTCUT = '$mod+L'

  useEffect(() => {
    console.log('Setting up a keyboard shortcut: ', LOOKUP_SHORTCUT)
    const unsubscribe = tinykeys(window, {
      [LOOKUP_SHORTCUT]: (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

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

  const handleCreateItem = async (inputValue: QuickLink) => {
    checkValidILink(inputValue.text)
    const nodeID = generateNodeId()
    const node = await saveNewNodeAPI(nodeID, inputValue.text)
    push(nodeID)
    mog("Created Hierarchy: ", { node, inputValue })
    closeModal()
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
