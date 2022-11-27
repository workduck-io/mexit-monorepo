import { TextAreaBlock } from '@mexit/shared'
import styled from 'styled-components'

import { Controls } from '../Renderers/Screenshot/Screenshot.style'

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 20rem;
  margin: ${({ theme }) => theme.spacing.large} 0;
`

export const StyledRowItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.large};

  label {
    flex: 1;
  }
`

export const StyledTextAreaBlock = styled(TextAreaBlock)`
  margin-top: ${({ theme }) => theme.spacing.tiny} !important;
`

export const UserPreferedFieldsContainer = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

export const ExcludeFormFieldsContainer = styled.section`
  border-top: 2px solid ${({ theme }) => theme.colors.gray[8]};

  ${Controls} {
    margin: ${({ theme }) => theme.spacing.medium} 0;
  }
`
