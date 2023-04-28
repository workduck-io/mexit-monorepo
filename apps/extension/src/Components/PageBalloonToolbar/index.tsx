import { useState } from 'react'

import { useTheme } from 'styled-components'
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
  const [isOptionOpen, setIsOptionOpen] = useState<string | null>(null)
  const closePageToolbar = useBalloonToolbarStore((store) => store.setOpen)

  const theme = useTheme()
  const { saveLink } = useLinkURLs()
  const { handleOpenAIPreview } = useAIOptions()
  const { saveHighlightEntity } = useSaveChanges()

  const onAIPreviewClick = (event) => {
    setIsOptionOpen(null)
    event.preventDefault()

    const content = getSelectionHTML()

    handleOpenAIPreview(content.html, 'html')
  }

  const handleHighlight = () => {
    setIsOptionOpen(null)

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

  const handleOpenOption = (id: string) => {
    setIsOptionOpen(id)
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

      {/* <ToolbarButton
        icon={<IconDisplay color={theme.tokens.colors.primary.hover} size={20} icon={DefaultMIcons.AI} />}
        onMouseDown={onAIPreviewClick}
      />
      <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.HIGHLIGHT} />} onMouseDown={handleHighlight} /> */}

      {/* <BallonOptionsUnwrapper active={isOptionOpen} onClick={handleOpenOption} id="Add To">
        <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.SNIPPET} />} onMouseDown={handleThese} />
        <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.NOTE} />} onMouseDown={handleThese} />
        <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.TASK} />} onMouseDown={handleThese} />
      </BallonOptionsUnwrapper> */}
    </BallonToolbaWithoutEvent>
  )
}

export default PageBallonToolbar
