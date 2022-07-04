import styled from 'styled-components'
import { animated } from 'react-spring'

export const KeySprite = styled(animated.div)<{
  x: number
  y: number
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 1.5rem;
  font-size: 2rem;
  text-transform: capitalize;
  position: absolute;
  left: ${({ x }) => x + 'px'};
  top: ${({ y }) => y + 'px'};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: 1px 1px 3px black;
`
export const CircleSprite = styled(animated.div)<{
  x: number
  y: number
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  position: absolute;
  left: ${({ x }) => x + 'px'};
  top: ${({ y }) => y + 'px'};
  box-shadow: 1px 1px 3px black;
  background-color: ${({ theme }) => theme.colors.primary};
`
