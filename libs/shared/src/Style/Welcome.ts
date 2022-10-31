import styled, { keyframes } from 'styled-components'

import { StyledKey } from './Shortcut'

export const WelcomeHeader = styled.section`
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

export const waveAnimation = keyframes`
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
export const Wave = styled.span`
  display: inline-block;
  animation: ${waveAnimation} 2.5s infinite;
  transform-origin: 70% 70%;
`
