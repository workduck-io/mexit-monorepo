import { keyframes } from 'styled-components'

export const SlideDownKeyFrames = keyframes`
  0% {
    max-height: 1.5em;
    opacity: 0;
  }

  100% {
    max-height: 10rem;
    opacity: 1;
  }
`

export const SlideUpKeyFrames = keyframes`
  0% {
    max-height: 10rem;
  }

  100% {
    max-height: 1.5em;
  }
`
