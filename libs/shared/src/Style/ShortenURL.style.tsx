import { ComponentPropsWithRef } from 'react'

import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { ShowOnHoverIconStyles } from './Helpers'
import { BodyFont } from './Search'

export const ShortenButton = styled(Button)<ComponentPropsWithRef<typeof Button> & { isShortend: boolean }>`
  color: ${({ isShortend, theme }) => (isShortend ? theme.tokens.colors.secondary : theme.tokens.text.default)};
  box-shadow: none;
  ${BodyFont};
  background-color: ${({ theme }) => theme.tokens.surfaces.app};

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
