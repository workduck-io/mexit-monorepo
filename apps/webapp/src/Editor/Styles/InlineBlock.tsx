import styled, { css } from 'styled-components'

export const MainFont = css`
  font-size: 14px;
`

export const StyledMessage = styled.div`
  border: none;
  border-radius: 0.7rem;
  margin-left: 0.5rem;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  padding: 0.5rem 1rem;
`

export type InlineBlockType = {
  selected?: boolean
}

export const StyledInlineBlockPreview = styled.div`
  max-height: 25vh;
  overflow-y: auto;
  overflow-x: hidden;
  ${MainFont};
`

export const InlineFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SpaceBetween = styled(InlineFlex)`
  justify-content: space-between;
`

export const StyledInlineBlock = styled.section<InlineBlockType>`
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.small} 0;
  padding: 1px;

  transition: transform 0.2s ease-in;

  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};

  ${({ selected }) =>
    selected
      ? css`
          border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
          padding: 0px;
        `
      : css`
          :hover {
            transform: translateY(-5px);
          }
        `}

  box-shadow: ${({ theme }) => theme.tokens.shadow.small};

  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.small}`};
  ${InlineFlex} svg {
    width: 16px;
    height: 16px;
    margin-left: ${({ theme }) => theme.spacing.small};
    fill: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const StyledViewBlock = styled(StyledInlineBlock)`
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
`

export const InlineBlockHeading = styled.div`
  color: ${({ theme }) => theme.tokens.text.disabled};
  font-size: large;
`

export const InlineBlockText = styled.div`
  margin-left: ${({ theme }) => theme.spacing.tiny};
  font-size: large;
  color: ${({ theme }) => theme.tokens.text.heading};
`

export const Chip = styled(StyledMessage)`
  cursor: pointer;
  background: transparent;
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  padding: 0.25rem 0.75rem;
  font-size: 0.95rem;
  &:hover {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing.medium};
`
