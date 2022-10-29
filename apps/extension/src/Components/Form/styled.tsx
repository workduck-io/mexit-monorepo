import styled from 'styled-components'

import { TextAreaBlock } from '@mexit/shared'

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
