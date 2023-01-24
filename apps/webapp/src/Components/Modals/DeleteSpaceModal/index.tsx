import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from 'react-modal'

import { useTheme } from 'styled-components'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'

import { API, DefaultMIcons } from '@mexit/core'
import { Group, IconDisplay, PrimaryText } from '@mexit/shared'

import { useDataStore } from '../../../Stores/useDataStore'
import { useLayoutStore } from '../../../Stores/useLayoutStore'
import useModalStore, { ModalsType } from '../../../Stores/useModalStore'
import { ModalControls } from '../../../Style/Refactor'

import MoveToSpace, { SelectedOption } from './MoveToSpace'
import { DeletionWarning, Header, ModalSectionContainer, Title } from './styled'

const DeleteSpaceModal = () => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [successorSpace, setSuccessorSpace] = useState<SelectedOption | undefined>()
  const isOpen = useModalStore((store) => store.open === ModalsType.deleteSpace)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const space = useLayoutStore((store) => store.contextMenu?.item)
  const deleteSpaceFromStore = useDataStore((s) => s.deleteNamespace)

  const onRequestClose = () => {
    setOpen(undefined)
  }

  const onDelete = async () => {
    setIsLoading(true)
    try {
      if (space?.id) {
        await API.namespace.delete(space.id, {
          ...(successorSpace ? { successorNamespaceID: successorSpace.id } : {})
        })
        deleteSpaceFromStore(space.id)
        setIsLoading(false)
        onRequestClose()
      }
    } catch (err) {
      setIsLoading(false)
      onRequestClose()
      toast('Unable to Delete')
      console.error('Unable To Delete Space', { namespaceID: space.id, successorNamespaceID: successorSpace?.id })
    }
  }

  const onSuccessorSpaceSelection = (space: SelectedOption) => {
    setSuccessorSpace(space)
  }

  if (!isOpen) return

  const notesSize = space.list?.items?.length

  return (
    <Modal
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <ModalSectionContainer>
        <Header>
          <Group>
            <Title>
              Delete Space{' '}
              <Group>
                <IconDisplay icon={space.icon} size={28} color={theme.tokens.colors.primary.default} />{' '}
                <PrimaryText>{space.label}</PrimaryText>
              </Group>{' '}
              ?
            </Title>
          </Group>
        </Header>
        <DeletionWarning>
          All (<PrimaryText>{notesSize}</PrimaryText>) Note(s) created within this Space will be permanently deleted.{' '}
          {!!notesSize && <>You can also move Notes to another Space before deleting this Space.</>}
        </DeletionWarning>
        {!!notesSize && (
          <MoveToSpace selected={successorSpace} onChange={onSuccessorSpaceSelection} currentSpaceId={space.id} />
        )}
        <ModalControls>
          <Button large onClick={onRequestClose}>
            Cancel
          </Button>
          <LoadingButton
            style={{ marginLeft: '1rem' }}
            primary
            autoFocus={true}
            large
            loading={isLoading}
            onClick={onDelete}
            disabled={false}
          >
            <Group>
              <IconDisplay icon={DefaultMIcons.DELETE} size={20} /> Delete
              <DisplayShortcut shortcut={'$mod+Enter'} />
            </Group>
          </LoadingButton>
        </ModalControls>
      </ModalSectionContainer>
    </Modal>
  )
}

export default DeleteSpaceModal
