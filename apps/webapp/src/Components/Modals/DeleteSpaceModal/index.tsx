import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Modal from 'react-modal'

import { useTheme } from 'styled-components'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import {
  API,
  ModalsType,
  useDataStore,
  useLayoutStore,
  useModalStore,
  userPreferenceStore as useUserPreferenceStore
} from '@mexit/core'
import { DefaultMIcons, Group, IconDisplay, MexIcon, PrimaryText } from '@mexit/shared'

import { useNamespaceApi } from '../../../Hooks/API/useNamespaceAPI'
import { useNamespaces } from '../../../Hooks/useNamespaces'
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
  const { getNamespace } = useNamespaceApi()
  const { getDefaultNamespaceId } = useNamespaces()
  const updateActiveNamespace = useUserPreferenceStore((s) => s.setActiveNamespace)
  const updateNamespaceOfILinks = useDataStore((s) => s.updateNamespaceOfILinks)

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

        updateActiveNamespace(getDefaultNamespaceId())

        if (successorSpace) {
          getNamespace(successorSpace.id)
            .then((res) => {
              if (res) {
                updateNamespaceOfILinks(successorSpace.id, res.nodeHierarchy)
              }
            })
            .catch((err) => {
              console.error('Unable To Update ILinks Namespace', { err })
            })
        }
        setIsLoading(false)
        onRequestClose()
      }
    } catch (err) {
      setIsLoading(false)
      onRequestClose()
      toast('Unable to Delete')
      console.error('Unable To Delete Space', { namespaceID: space.id, successorNamespaceID: successorSpace?.id, err })
    }
  }

  const onSuccessorSpaceSelection = (space: SelectedOption) => {
    setSuccessorSpace(space)
  }

  useEffect(() => {
    if (open) {
      const unsubscribe = tinykeys(window, {
        '$mod+Enter': (event) => {
          event.preventDefault()
          onDelete()
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [open])

  if (!isOpen && !space) return

  const notesSize = space?.list?.items?.length

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
          <MexIcon
            color={theme.tokens.text.fade}
            $cursor
            height={24}
            width={24}
            icon={DefaultMIcons.CLEAR.value}
            onClick={onRequestClose}
          />
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
