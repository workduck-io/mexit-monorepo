import styled from 'styled-components'

import { Input } from '@mexit/shared'

export const InputBoxContainer = styled.div<{ transparent?: boolean; $error?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  background: none;
  padding: 0 ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid
    ${({ theme, $error }) => `rgba(${$error ? theme.rgbTokens.colors.red : theme.rgbTokens.surfaces.separator}, 0.6)`};
`

export const StyledInputElement = styled(Input)`
  width: 100%;
  box-sizing: border-box;
  margin: ${({ theme }) => theme.spacing.small} 0;
`
