import { useState } from 'react'

import { ToolbarButton } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { BallonOptionsUnwrapper, BalloonToolbar, DefaultMIcons, IconDisplay, useAIOptions } from '@mexit/shared'

import { getElementById } from '../../Utils/cs-utils'
import { getSelectionHTML } from '../../Utils/getSelectionHTML'

const PageBallonToolbar = () => {
  const theme = useTheme()
  const [isOptionOpen, setIsOptionOpen] = useState<string | null>(null)

  const { handleOpenAIPreview } = useAIOptions()

  const onAIPreviewClick = (event) => {
    event.preventDefault()

    const content = getSelectionHTML()

    handleOpenAIPreview(content.html, 'html')
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
      <BallonOptionsUnwrapper
        id="capture"
        icon={DefaultMIcons.HIGHLIGHT}
        onClick={handleOpenOption}
        active={isOptionOpen}
      >
        <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.ADD} />} onMouseDown={onAIPreviewClick} />
        <ToolbarButton icon={<IconDisplay size={20} icon={DefaultMIcons.ADD} />} onMouseDown={onAIPreviewClick} />
      </BallonOptionsUnwrapper>
    </BalloonToolbar>
  )
}

export default PageBallonToolbar
