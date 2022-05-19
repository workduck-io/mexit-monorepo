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
    height: 28px;
    width: 28px;
  }
`

export const CollapseHeader = styled.div<{ collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;

  gap: ${({ theme }) => theme.spacing.tiny};

  :hover {
    ${CollapseToggle} {
      svg {
        background-color: ${({ theme }) => theme.colors.gray[8]};
      }
    }
  }
  h2 {
    flex-grow: 1;
    font-size: 14px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.fade};
    margin: 0;
  }

  ${({ collapsed }) =>
    collapsed &&
    css`
      ${CollapseToggle} {
        svg {
          color: ${({ theme }) => theme.colors.text.fade};
        }
      }
    `}
`

export const CollapseContent = styled(animated.div)`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
`
