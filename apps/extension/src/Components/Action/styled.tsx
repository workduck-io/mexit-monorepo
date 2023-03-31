import styled, { css } from 'styled-components'

import { IconDisplay } from '@mexit/shared'

export const StyledAction = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 0.5em 0.75em;
  color: ${({ theme }) => theme.tokens.text.fade};
  border-left: 2px solid transparent;
  border-radius: 10px;

  min-height: 53.61px;

  ${({ $active }) =>
    $active &&
    css`
      background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    `}
`

export const Container = styled.div`
  display: flex;
  flex-direction: row;
`

export const ActionIcon = styled(IconDisplay)`
  margin-right: 0.75em;
  align-self: center;
`

export const ActionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  max-width: 200px;
`

export const Title = styled.h3`
  font-size: 1.1em;
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
`

export const Description = styled.p`
  font-size: 0.85em;
  margin: 0.25em 0 0.5em 0;
  opacity: 0.7;

  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

export const ShortcutContainer = styled.div`
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const ShortcutText = styled.div`
  margin-bottom: 2px;
  display: flex;
  justify-content: flex-end;

  .text {
    display: flex;
    align-items: center;
    margin-left: 4px;
    white-space: nowrap;
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`
