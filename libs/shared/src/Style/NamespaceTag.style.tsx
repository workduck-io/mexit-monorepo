import styled, { css } from 'styled-components'

import { IconWrapper } from './IconPicker.style'

// import { Ellipsis } from './NodeSelect.style'

const Ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const NamespaceText = styled.span`
  min-width: 4rem;
  max-width: 8rem;
  ${Ellipsis}
`

export const StyledNamespaceTag = styled.div<{ separator?: boolean }>`
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  padding-left: 0.25rem;
  ${Ellipsis}
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.tiny};

  ${IconWrapper} {
    flex-shrink: 0;
  }

  ${({ theme, separator }) =>
    separator &&
    css`
      border-left: 1px solid ${theme.colors.gray[7]};
    `}
`
