import styled, { css } from 'styled-components'

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  overflow: hidden;
`

export const FilterItemWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
`

export const GenericFlex = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const GenericSection = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.small};
`

export const SmallGap = styled(GenericSection)`
  padding: ${({ theme }) => theme.spacing.tiny};
  gap: ${({ theme }) => theme.spacing.small};
`

export const FilterDescription = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.small};
  border-bottom: ${({ theme }) => theme.tokens.surfaces.separator};
  color: ${({ theme }) => theme.tokens.text.fade};
  opacity: 0.8;
  font-size: 0.8rem;
`

export const FilterMenuDiv = styled(GenericFlex)<{ noBorder?: boolean }>`
  padding: ${({ theme }) => theme.spacing.tiny};
  box-sizing: border-box;

  ${({ noBorder }) =>
    !noBorder &&
    css`
      border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
      border-radius: ${({ theme }) => theme.borderRadius.large};
    `}

  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const FilterTypeDiv = styled(GenericSection)``

export const FilterJoinDiv = styled(GenericFlex)`
  color: ${({ theme }) => theme.tokens.colors.secondary};
  padding: ${({ theme }) => theme.spacing.tiny};
`

export const FilterValueDiv = styled(SmallGap)`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.default};
`

export const FilterRemoveButton = styled(GenericSection)`
  display: flex;
  align-items: center;

  :hover {
    color: ${({ theme }) => theme.tokens.colors.red};
  }
`

export const FilterWithCrossWrapper = styled(FilterWrapper)`
  gap: 0;
`

export const FilterGlobalJoinWrapper = styled(GenericFlex)`
  flex-shrink: 0;
`

export const SortSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SortOrderWrapper = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.tiny};
  padding-right: 0;
  color: ${({ theme }) => theme.tokens.colors.secondary};
`

export const SortTypeWrapper = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.tiny};
  /* color: ${({ theme }) => theme.tokens.colors.secondary}; */
`
