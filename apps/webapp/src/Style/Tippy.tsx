import { transparentize } from 'polished'
import styled from 'styled-components'
import { CardShadow } from './Helpers'

export const TooltipBase = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])} !important;

  backdrop-filter: blur(8px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.fade};
  ${CardShadow}
`

export const Tooltip = styled(TooltipBase)`
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
`

export const ErrorTooltip = styled.div`
  padding: ${({ theme }) => theme.spacing.tiny};
  background: ${({ theme }) => transparentize(0.3, theme.colors.gray[8])} !important;
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 400;
  font-size: 0.9rem;
`
