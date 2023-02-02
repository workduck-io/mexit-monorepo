import Lottie from 'lottie-react'
import styled from 'styled-components'

import { hintsData } from '@mexit/core'
import { fadeIn, Hints } from '@mexit/shared'

import { loader } from '../Data/loader'

const OverlayLoader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999999997;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(${({ theme }) => theme.rgbTokens.surfaces.app}, 0.5);
  backdrop-filter: blur(20px);
  align-items: center;
  justify-content: center;

  svg {
    height: 25rem !important;
    width: 25rem !important;
  }
`

const VerticallyCenter = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  justify-content: center;
`

const HintsContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.large} 0;
  opacity: 0;

  animation: ${fadeIn} 2s;
  animation-delay: 1s;
  animation-fill-mode: forwards;
`

type SplashScreenProps = {
  showHints?: boolean
}

const SplashScreen: React.FC<SplashScreenProps> = ({ showHints = false }) => {
  return (
    <OverlayLoader>
      <VerticallyCenter>
        <Lottie autoplay loop animationData={loader} />
      </VerticallyCenter>
      {showHints && (
        <HintsContainer>
          <Hints hints={hintsData} show />
        </HintsContainer>
      )}
    </OverlayLoader>
  )
}

export default SplashScreen
