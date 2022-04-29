import { Center } from '@mexit/shared'
import React from 'react'

import styled, { keyframes, useTheme } from 'styled-components'
import { StyledKey } from '../Style/Shortcut'

const WelcomeHeader = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem; ;
`

export const Height = styled.section`
  display: flex;
  flex-direction: column;
`

export const StyledKeyCap = styled(StyledKey)`
  padding: 4px 8px;
  font-size: 0.8rem;
`

export const StyledTypography = styled.div<{ margin: string; maxWidth: string; color: string; size: string }>`
  margin: ${({ margin }) => margin};
  max-width: ${({ maxWidth }) => maxWidth};
  color: ${({ color }) => color};
  font-size: ${({ size }) => size};
`

const waveAnimation = keyframes`
  0% { transform: rotate(0.0deg) }
  10% { transform: rotate(12.0deg) }
  20% { transform: rotate(-7.0deg) }
  30% { transform: rotate(12.0deg) }
  40% { transform: rotate(-3.0deg) }
  50% { transform: rotate(9.0deg) }
  60% { transform: rotate(0.0deg) }
  100% { transform: rotate(0.0deg) }
`

export const WaterWave = keyframes`
  0% { transform: translateY(1.2rem) rotateZ(0deg)}
  50% {transform: translateY(0.8rem) rotateZ(180deg)}
  100% {transform: translateY(0.6rem) rotateZ(360deg)}
`

export const CompleteWave = keyframes`
  0% { transform: translateY(0.6rem) rotateZ(0deg)}
  50% {transform: translateY(0.3rem) rotateZ(180deg)}
  100% { transform: translateY(0rem) rotateZ(360deg)}

`
const Wave = styled.span`
  display: inline-block;
  animation: ${waveAnimation} 2.5s infinite;
  transform-origin: 70% 70%;
`

const WelcomeSection = () => {
  const theme = useTheme()

  return (
    <Height>
      <Center>
        <StyledTypography size="1.5rem" color={theme.colors.text.default} margin="3rem" maxWidth="100%">
          Hey there, Mex here!
        </StyledTypography>
      </Center>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Happy to finally meet you <Wave>👋</Wave>
        </StyledTypography>
      </WelcomeHeader>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        Before I take you on a journey of all things magical, you will need to bear with me for just a few steps. Let's
        start, shall we?
      </StyledTypography>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        For a seamless experience, all you need to do is remember 3 super easy shortcuts! (Just 3, promise) We can start
        by getting to know you a little ; )
      </StyledTypography>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        Open the browser to the last thought you wanted to quickly capture.
      </StyledTypography>
      <br />
      <Center>
        <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="0.5rem 0 2rem" maxWidth="100%">
          Select it and press <StyledKeyCap>CMD + SHIFT + L </StyledKeyCap>
        </StyledTypography>
      </Center>
    </Height>
  )
}

export default WelcomeSection
