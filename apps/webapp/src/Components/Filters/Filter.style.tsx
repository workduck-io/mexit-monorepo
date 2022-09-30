import { mix } from 'polished'
import styled from 'styled-components'

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[8]};
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
  gap: ${({ theme }) => theme.spacing.small};
`

export const FilterTypeDiv = styled(GenericSection)``

export const FilterJoinDiv = styled(GenericFlex)`
  color: ${({ theme }) => theme.colors.secondary};
`

export const FilterValueDiv = styled(GenericSection)`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => mix(0.5, theme.colors.gray[7], theme.colors.gray[8])};
`

export const FilterRemoveButton = styled(GenericSection)`
  display: flex;
  align-items: center;

  :hover {
    color: ${({ theme }) => theme.colors.palette.red};
  }
`

export const FilterGlobalJoinWrapper = styled(GenericFlex)`
  flex-shrink: 0;
`
