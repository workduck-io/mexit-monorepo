import { transparentize } from 'polished'
import styled from 'styled-components'

import { LoadingButton } from '@workduck-io/mex-components'

export const TemplateContainer = styled.div`
  display: flex;
  max-height: 350px;
  margin: 1rem -0.5rem;

  & > section {
    height: 30vh !important;
    width: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 1rem;

    background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
    border-radius: ${({ theme }) => theme.borderRadius.large};
  }
`

export const RemovalButton = styled(LoadingButton)`
  background-color: ${({ theme }) => theme.colors.palette.red};

  :hover {
    color: ${({ theme }) => theme.colors.text.subheading};
    background-color: ${({ theme }) => transparentize(0.3, theme.colors.palette.red)};
    box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.75, theme.colors.palette.red)};
  }
`
