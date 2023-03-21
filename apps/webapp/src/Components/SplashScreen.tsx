import Lottie from 'lottie-react'
import styled from 'styled-components'

import { hintsData, useAppStore } from '@mexit/core'
import { BodyFont, fadeIn, Group, Hints } from '@mexit/shared'

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

const RefreshLink = styled.span`
  font-weight: bolder;
  border-radius: ${({ theme }) => theme.spacing.tiny};

  :hover {
    transition: background 0.2s ease;
    cursor: pointer;
    color: ${({ theme }) => theme.tokens.colors.primary.hover};
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }

  padding: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

const RefreshGroup = styled(Group)`
  display: flex;
  ${BodyFont}
  animation: ${fadeIn} 0.5s;
  color: ${({ theme }) => theme.tokens.text.fade};
  padding: ${({ theme }) => theme.spacing.small};
`

const CenteredGroup = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
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
  const manualReload = useAppStore((s) => s.manualReload)
  const setManualReload = useAppStore((s) => s.setManualReload)

  const onManualReload = () => {
    setManualReload(false)
    window.location.reload()
  }

  return (
    <OverlayLoader>
      <VerticallyCenter>
        <Lottie autoplay loop animationData={loader} />
      </VerticallyCenter>
      {showHints && (
        <CenteredGroup>
          {manualReload && (
            <RefreshGroup>
              Taking too long...
              <RefreshLink onClick={onManualReload}>Refresh</RefreshLink>
            </RefreshGroup>
          )}
          <HintsContainer>
            <Hints hints={hintsData} show />
          </HintsContainer>
        </CenteredGroup>
      )}
    </OverlayLoader>
  )
}

export default SplashScreen
