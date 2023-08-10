import { useShareModalStore, useViewStore } from '@mexit/core'
import { Center, Margin, ShareToggle } from '@mexit/shared'

import { Container } from './styles'

export const PublishModal = ({ id }) => {
  const view = useViewStore((store) => store.views.find((view) => view.id === id))
  const updateShareModalData = useShareModalStore((store) => store.updateData)
  const closeModal = useShareModalStore((store) => store.closeModal)

  const handleOnCopyLink = () => {
    // * Copy the link
  }

  const onClose = () => {
    closeModal()
  }

  const handleOnShareToggle = async () => {
    if (!id) return

    if (view.public)
      updateShareModalData({
        share: false
      })
    else {
      updateShareModalData({
        share: true
      })
    }
  }

  return (
    <Container>
      <Center>
        <h2>Publish View</h2>
      </Center>
      <Center>
        <ShareToggle
          size="sm"
          id="toggle-public"
          value={view.public}
          checked={view.public}
          onChange={handleOnShareToggle}
        />
      </Center>
      <Margin />
      {/* <ModalFooter>
        <SpaceBetween>
          <IconButton title="Copy Link" icon={DefaultMIcons.WEB_LINK.value} onClick={handleOnCopyLink}></IconButton>
        </SpaceBetween>
      </ModalFooter> */}
    </Container>
  )
}
