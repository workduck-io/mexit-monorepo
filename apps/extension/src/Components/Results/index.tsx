import React, { useMemo } from 'react'

import { useSpring } from 'react-spring'

import { ActionType } from '@mexit/core'

import { useEditorContext } from '../../Hooks/useEditorContext'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { IFrameActionRenderer, SmartCapture } from '../Renderers'
import { Screenshot } from '../Screenshot/Screenshot'
import ResultList from './ResultList'
import { StyledResults } from './styled'

function Results() {
  const { activeIndex } = useSputlitContext()
  const results = useSputlitStore((s) => s.results)

  const { previewMode } = useEditorContext()

  const activeItem = useSputlitStore((s) => s.activeItem)

  const springProps = useSpring(
    useMemo(() => {
      const style = { width: '100%' }

      if (!previewMode) {
        style.width = '0%'
      }

      if (activeItem?.type === ActionType.RENDER) {
        style.width = '100%'
      }

      return style
    }, [previewMode, activeIndex, results, activeItem])
  )

  return (
    <StyledResults isScreenshot={activeItem?.type === ActionType.SCREENSHOT} style={springProps}>
      {{
        [ActionType.RENDER]: <IFrameActionRenderer />,
        [ActionType.SCREENSHOT]: <Screenshot />,
        [ActionType.MAGICAL]: <SmartCapture />
      }[activeItem?.type] || <ResultList results={results} />}
    </StyledResults>
  )
}

export default Results
