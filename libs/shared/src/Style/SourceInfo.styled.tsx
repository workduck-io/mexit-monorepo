import { transparentize } from 'polished'
import styled, { css, keyframes } from 'styled-components'

import { FadeInOut } from '..'

export const TemplateCss = css`
  margin: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};
  user-select: none;
`

export const ProjectIconContainer = styled.span<{ isView: boolean }>`
  ${TemplateCss}
  ${(props) =>
    props.isView
      ? css`
          width: 100%;
          margin: 0.25rem 0;
        `
      : css`
          display: flex;
          align-items: center;
        `}

  font-size: 0.9rem;

  img {
    border-radius: 50%;
    padding: 4px;
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`
export const Element = styled.span<{ show: boolean }>`
  border-radius: ${(props) => props.theme.borderRadius.tiny};
  margin: 4px 0;
  background-color: ${(props) => props.show && transparentize(0.05, props.theme.colors.background.highlight)};
`

export const MoveIt = keyframes`
  0% { transform: translateX(-0.5rem);}
  100% { transform: translateX(0rem);}
`

export const BlockElement = styled.div`
  user-select: none;
  background-color: ${({ theme }) => transparentize(0.75, theme.colors.background.highlight)};
  border-radius: ${(props) => props.theme.borderRadius.small};
  margin-bottom: ${(props) => props.theme.spacing.small};
  animation: ${MoveIt} 0.1s ease-out;
  display: flex;
  align-items: center;
`

export const BlockSelectorInput = styled.input`
  border-radius: 50% !important;

  margin: 0 ${(props) => props.theme.spacing.medium} !important;
  border: none;

  :focus {
    outline: none !important;
  }
`

export const SourceInfoWrapper = styled.div`
  position: relative;
  user-select: none;
`

export const StyledSource = styled.div<{ $isVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  user-select: none;

  * {
    box-sizing: border-box;
  }

  ${({ $isVisible }) => FadeInOut($isVisible)}

  img {
    height: calc(16px + ${({ theme }) => theme.spacing.tiny});
    width: calc(16px + ${({ theme }) => theme.spacing.tiny});
    border-radius: 50%;
    padding: ${({ theme }) => theme.spacing.tiny};
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

export const BlockModal = styled.div``
