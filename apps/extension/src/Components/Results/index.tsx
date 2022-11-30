import { ActionType } from '@mexit/core'
import React from 'react'

import { useSputlitStore } from '../../Stores/useSputlitStore'
import { AvatarRenderer, IFrameActionRenderer, ScreenshotRenderer, SmartCaptureRenderer } from '../Renderers'
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
        [ActionType.MAGICAL]: <SmartCaptureRenderer />,
        [ActionType.AVATAR_GENERATOR]: <AvatarRenderer />
      }[activeItem?.type] || <ResultList results={results} />}
    </StyledResults>
  )
}

export default Results
