import { FloatingLink } from '@udecode/plate-link'
import styled, { css } from 'styled-components'

export const FloatingDivider = styled.div`
  width: 1px;
  height: 100%;
  background: ${({ theme }) => theme.colors.gray[7]};
`

export const PlateFloatingCssDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: 4px;
`

export const FloatingLinkInputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 330px;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.small};
`

const InputCss = css`
  border: none;
  background: transparent;
  background-color: transparent !important;
  height: 24px;
  flex-grow: 1;
  padding: 0;
  &:focus {
    outline: none;
  }
  line-height: 24px;
`

export const TextInput = styled(FloatingLink.TextInput)`
  ${InputCss}
`
export const UrlInput = styled(FloatingLink.UrlInput)`
  ${InputCss}
`

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  svg {
    color: ${({ theme }) => theme.colors.text.fade};
  }
`

const ToolbarButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.fade};
  background: transparent;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  gap: ${({ theme }) => theme.spacing.tiny};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray[7]};
  }
`

export const OpenLinkButton = styled(FloatingLink.OpenLinkButton)`
  ${ToolbarButtonStyles};
`
export const EditButton = styled(FloatingLink.EditButton)`
  ${ToolbarButtonStyles};
`
export const UnlinkButton = styled(FloatingLink.UnlinkButton)`
  ${ToolbarButtonStyles};
`

const RootCss = css`
  display: flex;
  background: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: rgb(15 15 15 / 5%) 0 0 0 1px, rgb(15 15 15 / 10%) 0 3px 6px, rgb(15 15 15 / 20%) 0 9px 24px;
  z-index: 20;
  width: max-content;
`

export const FloatingLinkInsertRoot = styled(FloatingLink.InsertRoot)`
  ${RootCss}
`
export const FloatingLinkEditRoot = styled(FloatingLink.EditRoot)`
  ${RootCss}
`
