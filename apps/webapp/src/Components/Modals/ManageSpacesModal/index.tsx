import { useEffect } from 'react'
import Modal from 'react-modal'

import { isReservedNamespace, ModalsType, useDataStore, useModalStore , userPreferenceStore as useUserPreferenceStore } from '@mexit/core'
import { Description, getMIcon, IconDisplay, MexIcon, PrimaryText } from '@mexit/shared'

import { useUserService } from '../../../Hooks/API/useUserAPI'
import { ModalHeader } from '../../../Style/Refactor'
import { Group } from '../../Editor/Banner/styled'

import { MangeSpacesContainer, SpaceHeader, SpaceItem, SpacesListContainer, StyledIconDisplay, Text } from './styled'

const SpaceListItem: React.FC<{ space: any; onHideSpace: (spaceId: string, hide?: boolean) => void }> = ({
  space,
  onHideSpace
}) => {
  const spacePreferences = useUserPreferenceStore((store) => store.space[space.id])

  return (
    <SpaceItem $hidden={spacePreferences?.hidden}>
      <Group>
        <IconDisplay size={20} icon={space.icon} />
        <Text>{space.name}</Text>
      </Group>
      <MexIcon
        cursor="pointer"
        height={24}
        width={24}
        icon={spacePreferences?.hidden ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
        onClick={(ev) => {
          ev.stopPropagation()
          onHideSpace(space.id, !spacePreferences?.hidden)
        }}
      />
    </SpaceItem>
  )
}

const SpacesList = () => {
  const allSpaces = useDataStore((store) => store.spaces)
  const addSpacePreference = useUserPreferenceStore((store) => store.addSpacePreference)
  const deleteSpace = useDataStore((s) => s.deleteNamespace)
  const addSpace = useDataStore((s) => s.addNamespace)

  const { updateUserPreferences } = useUserService()

  const handleHideSpace = (spaceId: string, hide?: boolean) => {
    addSpacePreference(spaceId, { hidden: hide })
    if (hide) deleteSpace(spaceId, false)
    else {
      const space = useDataStore.getState().spaces.find((s) => s.id === spaceId)
      addSpace(space)
    }
  }

  const savePreferences = () => {
    updateUserPreferences()
  }

  useEffect(() => {
    // * On unmount, save the changes to User preferences
    return () => savePreferences()
  }, [])

  return (
    <SpacesListContainer>
      {allSpaces
        .filter((space) => !isReservedNamespace(space.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((space) => {
          return <SpaceListItem key={space.id} space={space} onHideSpace={handleHideSpace} />
        })}
    </SpacesListContainer>
  )
}

const MangeSpacesModal = () => {
  const open = useModalStore((store) => store.open === ModalsType.manageSpaces)
  const closeModal = useModalStore((store) => store.toggleOpen)

  if (!open) return <></>

  return (
    <Modal
      className={'ModalContent'}
      overlayClassName="ModalOverlay"
      onRequestClose={() => closeModal(undefined)}
      isOpen={open}
    >
      <MangeSpacesContainer>
        <ModalHeader>
          <SpaceHeader>
            <StyledIconDisplay icon={getMIcon('ICON', 'ri:checkbox-multiple-blank-line')} size={28} />
            <Text>
              <PrimaryText>Manage Spaces</PrimaryText>
              <Description>Toggle to hide or show a space</Description>
            </Text>
          </SpaceHeader>
        </ModalHeader>
        <SpacesList />
      </MangeSpacesContainer>
    </Modal>
  )
}

export default MangeSpacesModal
