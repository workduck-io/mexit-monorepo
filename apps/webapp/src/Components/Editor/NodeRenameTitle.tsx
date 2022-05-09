import React, { useEffect, useState } from 'react'
import Tippy from '@tippyjs/react'
import styled from 'styled-components'

import { isReserved, mog, NodeLink } from '@mexit/core'
import { Button, Input } from '@mexit/shared'

import { StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import useEditorStore from '../../Stores/useEditorStore'
import { useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { useAnalysisStore } from '../../Stores/useAnalysis'
import { useRenameStore } from '../../Stores/useRenameStore'

const doesLinkRemain = (id: string, refactored: NodeLink[]): boolean => {
  return refactored.map((r) => r.from).indexOf(id) === -1
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  ${StyledInputWrapper} {
    margin: 0;
  }

  .smallTooltip {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${Input} {
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing.small};
    &:hover,
    &:focus,
    &:active {
      border: 1px solid ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.gray[8]};
    }
  }
`

const ButtonWrapper = styled.div`
  position: absolute;
  top: 100%;
  display: flex;
  padding: ${({ theme }) => theme.spacing.medium} 0;
  z-index: 200;

  ${Button} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const TitleStatic = styled.div`
  border: 1px solid transparent;
  padding: ${({ theme }) => theme.spacing.small} 8px;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-right: ${({ theme }) => theme.spacing.small};

  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.colors.gray[8]};
  }
`

const NodeRenameTitle = () => {
  const { getNodeidFromPath } = useLinks()
  const { execRefactor, getMockRefactor } = useRefactor()

  // const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  // const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)
  const nodeTitle = useAnalysisStore((state) => state.analysis.title)

  const { push } = useNavigation()
  const openModal = useRenameStore((store) => store.openModal)
  // const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const setTo = useRenameStore((store) => store.setTo)
  const nodeFrom = useEditorStore((store) => store.node.id ?? '')
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  // const inpRef = useRef<HTMLInputElement>()
  //

  useEffect(() => {
    if (nodeFrom && isReserved(nodeFrom)) {
      mog('ISRESERVED', { nodeFrom })
    }
  }, [nodeFrom])
  const reset = () => {
    if (editable) modalReset()
    setEditable(false)
  }

  const handleToChange = (newValue: QuickLink) => {
    if (newValue.value) {
      setTo(newValue.value)
    }
  }

  const handleToCreate = (inputValue: QuickLink) => {
    if (inputValue.value) {
      setTo(inputValue.value)
    }
  }

  const onRename: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    console.log('renaming', {})
    if (mockRefactored.length > 1) {
      setFrom(nodeFrom)
      openModal()
      setEditable(false)
      return
    }
    if (to && nodeFrom) {
      const res = execRefactor(nodeFrom, to)

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      setEditable(false)
      if (doesLinkRemain(path, res)) {
        push(nodeid)
      } else if (res.length > 0) {
        const nodeid = getNodeidFromPath(res[0].to)
        push(nodeid)
      }
    }
  }

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    reset()
  }

  useEffect(() => {
    if (to && editable) {
      mog('RenameInput', { id: useEditorStore.getState().node.id, to })
      setMockRefactored(getMockRefactor(useEditorStore.getState().node.id, to))
    }
  }, [to, nodeFrom, editable])

  useEffect(() => {
    reset()
  }, [nodeFrom])

  return (
    <Wrapper>
      {isReserved(nodeFrom) ? (
        <Tippy theme="mex" placement="bottom-start" content="Reserved Node">
          <TitleStatic>{nodeTitle?.length > 0 ? nodeTitle : nodeFrom}</TitleStatic>
        </Tippy>
      ) : editable ? (
        <WrappedNodeSelect
          id="NodeRenameTitleSelect"
          name="NodeRenameTitleSelect"
          createAtTop
          disallowReserved
          disallowClash
          autoFocus
          defaultValue={to ?? nodeFrom}
          handleSelectItem={handleToChange}
          handleCreateItem={handleToCreate}
        />
      ) : (
        <Tippy theme="mex" placement="bottom-start" content="Click to Rename">
          <TitleStatic
            onClick={(e) => {
              e.preventDefault()
              setEditable(true)
            }}
          >
            {nodeTitle?.length > 0 ? nodeTitle : nodeFrom}
          </TitleStatic>
        </Tippy>
      )}
      {editable && (
        <ButtonWrapper>
          <Button primary key="ButtonRename" onClick={onRename}>
            Rename
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}

export default NodeRenameTitle
