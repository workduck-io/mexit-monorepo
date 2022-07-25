import styled from 'styled-components'
import { animated } from 'react-spring'

export const Container = styled.div`
  width: 90vw;
  height: 80vh;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  outline: none;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
export const Scoreboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const ScoreText = styled.p`
  font-size: 1.25rem;
`

export const ActionBoard = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
`
export const ActionButton = styled.button<{ action: string }>`
  width: 20%;
  padding: 0.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  letter-spacing: 0.25rem;
  border: none;
  outline: none;
  background-color: ${({ theme, action }) => (action === 'start' ? theme.colors.primary : theme.colors.palette.red)};
`

export const PlayArea = styled.div`
  width: 100%;
  outline: none;
  text-align: center;
`

export const TimeText = styled.h3`
  font-size: 0.75rem;
`

export const TimeContainer = styled(animated.div)`
  width: 50%;
  height: 2rem;
  display: flex;
  justify-content: center;
`

export const LayoverBackground = styled(animated.div)`
  width: 95%;
  height: 95%;
  align-self: center;
  display: flex;
  flex-direction: column;
  background-color: #ffffffaa;
  align-items: center;
  justify-content: center;
  position: absolute;
  overflow: hidden;
`

export const GameOverContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const InstructionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -1rem;
  margin-bottom: -1rem;
`

export const InstructionCardContainer = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const InstructionCard = styled(animated.div)`
  width: 32%;
  min-height: 300px;
  border: 4px solid ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`
export const InsCardHeader = styled.div`
  display: flex;
  flex-shrink: 1;
  flex-grow: 0;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  width: 100%;
`
export const InsCardBody = styled.div`
  display: flex;
  padding: 0.3rem;
  gap: -0.25rem;
  flex-direction: column;
  align-items: center;
`
