import { transparentize } from 'polished'
import styled from 'styled-components'

import { LoadingButton } from '@workduck-io/mex-components'

export const RemovalButton = styled(LoadingButton)`
  background-color: ${({ theme }) => theme.colors.palette.red};

  :hover {
    color: ${({ theme }) => theme.colors.text.subheading};
    background-color: ${({ theme }) => transparentize(0.3, theme.colors.palette.red)};
    box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.75, theme.colors.palette.red)};
  }
`
