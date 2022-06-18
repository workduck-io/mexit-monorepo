import React from 'react'
import styled from 'styled-components'

import { Input, StyledMenu } from '@mexit/shared'

import NodeSelect from './NodeSelect/NodeSelect'

export type CreateInputType = { value?: string; onChange; disabled?: boolean; autoFocus?: boolean }

export const StyleCreateInputWrapper = styled.div`
  width: 100%;
  position: relative;
  ${StyledMenu} {
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
  ${Input} {
    color: ${({ theme }) => theme.colors.text.fade};
    width: 100%;
    border: none;
  }
`

const CreateInput: React.FC<CreateInputType> = ({ autoFocus, onChange, value, disabled }) => {
  return (
    <StyleCreateInputWrapper>
      <NodeSelect
        autoFocus={autoFocus}
        disabled={disabled}
        defaultValue={value}
        id="wd-spotlight-editor-search"
        name="wd-spotlight-editor-search"
        placeholder="Search for a note"
        handleSelectItem={onChange}
      />
    </StyleCreateInputWrapper>
  )
}

export default CreateInput
