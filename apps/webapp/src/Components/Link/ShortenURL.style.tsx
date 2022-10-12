import { ShowOnHoverIconStyles } from '@mexit/shared'
import { Button } from '@workduck-io/mex-components'
import { ComponentPropsWithRef } from 'react'
import styled from 'styled-components'

export const ShortenButton = styled(Button)<ComponentPropsWithRef<typeof Button> & { isShortend: boolean }>`
  color: ${({ isShortend, theme }) => (isShortend ? theme.colors.secondary : theme.colors.text.fade)};
  svg {
    flex-shrink: 0;
  }
`

export const ShortenSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  ${ShowOnHoverIconStyles}
`
