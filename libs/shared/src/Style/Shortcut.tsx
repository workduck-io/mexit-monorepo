import styled, { css } from 'styled-components'

type ContentType = {
  justifyContent?: string
}

export const Draggable = css`
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`

export const StyledShortcuts = styled.section<ContentType>`
  ${Draggable}
  display: flex;
  width: 100%;
  margin-top: 0.5rem;
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: center;
`

export const Shortcut = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.fade};
  font-weight: bold;
`

export const StyledKey = styled.span`
  padding: 0 4px;
  border-radius: 5px;
  margin: 0 5px;
  color: ${({ theme }) => theme.colors.background.card};
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 2px 2px 2px ${({ theme }) => theme.colors.gray[9]};
`
