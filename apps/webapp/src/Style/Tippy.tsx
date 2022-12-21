import styled from 'styled-components'

import { CardShadow } from '@mexit/shared'

export const TooltipBase = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  background: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[1]}, 0.5);

  backdrop-filter: blur(8px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.fade};
  ${CardShadow}
`

export const Tooltip = styled(TooltipBase)`
  background: ${({ theme }) => theme.tokens.surfaces.s[2]} !important;
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
`

export const ErrorTooltip = styled.div`
  padding: ${({ theme }) => theme.spacing.tiny};
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.tokens.text.fade};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 400;
  font-size: 0.9rem;
`
