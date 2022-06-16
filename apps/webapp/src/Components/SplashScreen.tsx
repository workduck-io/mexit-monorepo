import React from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react'
import { loader } from '../Data/loader'
import { ModalStyles } from '../Style/Refactor'

const OverlayLoader = styled.div`
  ${ModalStyles}
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 25rem !important;
    width: 25rem !important;
  }
`

const SplashScreen = () => {
  return (
    <OverlayLoader>
      <Lottie autoplay loop animationData={loader} />
      <p>Setting Up Your Workspace For You!</p>
    </OverlayLoader>
  )
}

export default SplashScreen
