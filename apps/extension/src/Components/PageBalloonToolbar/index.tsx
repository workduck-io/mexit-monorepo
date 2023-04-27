import { useState } from 'react'

import { ToolbarButton } from '@udecode/plate'
import { useTheme } from 'styled-components'
import Highlighter from 'web-highlighter'

import { BalloonToolbar, DefaultMIcons, IconDisplay, useAIOptions, useBalloonToolbarStore } from '@mexit/shared'

import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { getElementById } from '../../Utils/cs-utils'
import { getSelectionHTML } from '../../Utils/getSelectionHTML'
import { sanitizeHTML } from '../../Utils/sanitizeHTML'

const PageBallonToolbar = () => {
  const theme = useTheme()
  const [isOptionOpen, setIsOptionOpen] = useState<string | null>(null)
  const closePageToolbar = useBalloonToolbarStore((store) => store.setOpen)
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
      closePageToolbar(false)
    })
  }

  const handleOpenOption = (id: string) => {
    setIsOptionOpen(id)
  }

  return (
    <BalloonToolbar
      portalElement={getElementById('mexit-container')}
      floatingOptions={{ placement: 'top', windowSelection: true }}
    >
      <ToolbarButton
        icon={<IconDisplay color={theme.tokens.colors.primary.hover} size={20} icon={DefaultMIcons.AI} />}
        onMouseDown={onAIPreviewClick}
      />

      <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.HIGHLIGHT} />} onMouseDown={handleHighlight} />
    </BalloonToolbar>
  )
}

export default PageBallonToolbar
