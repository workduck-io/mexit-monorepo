import React, { useMemo } from 'react'

import { ActionType } from '@mexit/core'

import { useEditorStore } from '../../Hooks/useEditorStore'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { IFrameActionRenderer, SmartCapture, ScreenshotRenderer, AvatarRenderer } from '../Renderers'
import ResultList from './ResultList'
import { StyledResults } from './styled'

function Results() {
  const results = useSputlitStore((s) => s.results)
  const activeItem = useSputlitStore((s) => s.activeItem)

  return (
    <StyledResults isScreenshot={activeItem?.type === ActionType.SCREENSHOT}>
      {{
        [ActionType.RENDER]: <IFrameActionRenderer />,
        [ActionType.SCREENSHOT]: <ScreenshotRenderer />,
        [ActionType.MAGICAL]: <SmartCapture />,
        [ActionType.AVATAR_GENERATOR]: <AvatarRenderer />
      }[activeItem?.type] || <ResultList results={results} />}
    </StyledResults>
  )
}

export default Results
