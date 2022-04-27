import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

export const CollapseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const CollapseToggle = styled.div`
  svg {
    padding: ${({ theme }) => theme.spacing.tiny};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    color: ${({ theme }) => theme.colors.primary};
    height: 2rem;
    width: 2rem;
  }
`

export const CollapseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;

  gap: ${({ theme }) => theme.spacing.small};

  :hover {
    ${CollapseToggle} {
      svg {
        background-color: ${({ theme }) => theme.colors.gray[8]};
      }
    }
  }
  h2 {
    flex-grow: 1;
    font-size: 1.5rem;
  }
`

export const CollapseContent = styled(animated.div)`
  overflow-y: auto;
  overflow-x: hidden;
`
