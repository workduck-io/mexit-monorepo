import styled from 'styled-components'

import { BodyFont } from './Search'

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
`

export const GenericFlex = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const GenericSection = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
`

export const FilterMenuDiv = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  ${BodyFont}
  border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const FilterTypeDiv = styled(GenericSection)``

export const FilterJoinDiv = styled(GenericFlex)`
  color: ${({ theme }) => theme.tokens.colors.secondary};
`

export const FilterValueDiv = styled(GenericSection)`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
`

export const FilterRemoveButton = styled(GenericSection)`
  display: flex;
  align-items: center;

  :hover {
    color: ${({ theme }) => theme.tokens.colors.red};
  }
`

export const FilterGlobalJoinWrapper = styled(GenericFlex)`
  flex-shrink: 0;
`

export const SortSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SortOrderWrapper = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.tiny};
  padding-right: 0;
  color: ${({ theme }) => theme.tokens.colors.secondary};
`

export const SortTypeWrapper = styled(GenericFlex)`
  padding: ${({ theme }) => theme.spacing.tiny};
  padding-left: 0;
`
