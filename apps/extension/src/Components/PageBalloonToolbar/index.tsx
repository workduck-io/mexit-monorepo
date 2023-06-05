import Highlighter from 'web-highlighter'

import { useLinkStore } from '@mexit/core'
import {
  BallonToolbaWithoutEvent,
  ButtonSeparator,
  DefaultMIcons,
  IconButtonWrapper,
  IconDisplay,
  useAIOptions,
  useBalloonToolbarStore
} from '@mexit/shared'

import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useLinkURLs } from '../../Hooks/useURLs'
import { getElementById } from '../../Utils/cs-utils'
import { getSelectionHTML } from '../../Utils/getSelectionHTML'
import { sanitizeHTML } from '../../Utils/sanitizeHTML'

const PageBallonToolbar = () => {
  const closePageToolbar = useBalloonToolbarStore((store) => store.setOpen)

  const { saveLink } = useLinkURLs()
  const { handleOpenAIPreview } = useAIOptions()
  const { saveHighlightEntity } = useSaveChanges()

  const onAIPreviewClick = (event) => {
    event.preventDefault()

    const content = getSelectionHTML()

    handleOpenAIPreview(content.html, 'html')
  }

  const handleHighlight = () => {
    const { html } = getSelectionHTML()
    const selectionRange = window.getSelection().getRangeAt(0)
    const content = sanitizeHTML(html)

    const highlighter = new Highlighter({
      style: {
        className: 'mexit-highlight'
      }
    })

    const saveableRange = highlighter.fromRange(selectionRange)

    saveHighlightEntity({
      html: content,
      range: saveableRange
    }).then((res) => {
      const links = useLinkStore.getState().links
      if (!links?.find((l) => l.url === window.location.href)) {
        const link = { url: window.location.href, title: document.title }
        saveLink(link)
      }

      closePageToolbar(false)
    })
  }

  return (
    <BallonToolbaWithoutEvent
      portalElement={getElementById('mexit-container')}
      floatingOptions={{ placement: 'top', windowSelection: true }}
    >
      <IconButtonWrapper onMouseDown={handleHighlight}>
        <IconDisplay size={20} icon={DefaultMIcons.HIGHLIGHT} />
        <span>Capture</span>
      </IconButtonWrapper>
      <ButtonSeparator />
      <IconButtonWrapper onMouseDown={onAIPreviewClick}>
        <IconDisplay size={20} icon={DefaultMIcons.AI} />
        <span>Enhance</span>
      </IconButtonWrapper>
    </BallonToolbaWithoutEvent>
  )
}

export default PageBallonToolbar
