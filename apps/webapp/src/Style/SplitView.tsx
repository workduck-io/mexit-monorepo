import { animated } from 'react-spring'
import styled from 'styled-components'

export const SplitWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
`

export const SplitPreviewWrapper = styled(animated.div)`
  position: relative;
  white-space: pre-wrap;
`
