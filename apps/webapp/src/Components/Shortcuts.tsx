import React from 'react'

import { shade } from 'polished'
import styled from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { getSplitDisplayShortcut } from '@mexit/shared'

const ShortcutWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const ShortcutMid = styled.div`
  opacity: 0.66;
`
const ShortcutBox = styled.div`
  font-size: 0.7rem;
  padding: 4px ${({ theme }) => theme.spacing.tiny};
  border-radius: 4px;
  ${({ theme }) => generateStyle(theme.generic.shortcut)}
`

export interface DisplayShortcutProps {
  shortcut: string
}

export const DisplayShortcut = ({ shortcut }: DisplayShortcutProps) => {
  const keys = getSplitDisplayShortcut(shortcut)
  return (
    <ShortcutWrapper>
      {keys.map((k, i) => (
        <ShortcutWrapper key={k}>
          <ShortcutBox>{k}</ShortcutBox>
        </ShortcutWrapper>
      ))}
    </ShortcutWrapper>
  )
}

const TooltipShortcut = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  ${ShortcutWrapper} {
    gap: 1px;
  }
  ${ShortcutBox} {
    font-size: 0.75rem;
    background-color: ${({ theme }) => shade(0.1, theme.colors.primary)};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`
