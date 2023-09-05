import styled, { css } from 'styled-components'

import { CardShadow } from '../../../Style/Helpers'
import { BodyFont } from '../../../Style/Search'

export const StyledContactCard = styled.div<{ showAsBlock: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ showAsBlock = true }) =>
    showAsBlock &&
    css`
      ${CardShadow}

      background: ${({ theme }) => theme.tokens.surfaces.s[2]} !important;
    `}
  padding: ${({ theme, showAsBlock }) =>
    showAsBlock
      ? `${theme.spacing.large} ${theme.spacing.large} ${theme.spacing.medium}`
      : `0 0  ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.editor.elements.mention.default} !important;
`

export const ContactContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
`

export const ContactTemplateContainer = styled.section`
  .label {
    ${BodyFont}
    font-weight: 500;
    color: ${({ theme }) => theme.tokens.text.fade};
    opacity: 0.7;
    margin-top: ${({ theme }) => theme.spacing.large};
  }
`
