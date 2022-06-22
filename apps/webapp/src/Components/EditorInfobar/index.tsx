import React from 'react'
import { animated, useSpring } from 'react-spring'
import styled from 'styled-components'
import { useLayoutStore } from '../../Stores/useLayoutStore'

import ShareOptions from './ShareOptions'

const StyledEditorInfo = styled(animated.div)``

const EditorInfoBar = () => {
  const showShareOptions = useLayoutStore((store) => store.showShareOptions)

  const transition = useSpring({
    opacity: showShareOptions ? 1 : 0,
    height: showShareOptions ? '4rem' : '0rem',
    y: showShareOptions ? 0 : 5
  })

  return (
    <StyledEditorInfo style={transition}>
      <ShareOptions />
    </StyledEditorInfo>
  )
}

export default EditorInfoBar
