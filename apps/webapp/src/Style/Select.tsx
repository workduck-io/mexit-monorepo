import React from 'react'

import { Icon } from '@iconify/react'
import { components } from 'react-select'
import styled, {css} from 'styled-components'

/* eslint-disable @typescript-eslint/no-explicit-any */

const Control = styled(components.Control)`
  margin: ${({ theme }) => theme.spacing.medium} 0;
`

const NamespaceControl = styled(components.Control)`
  margin: 0 !important;
  border-color: transparent !important;
  padding: 0.25rem 0;
  border-radius: 0;
  opacity: 0.5;
  min-width: 10rem;
  ${({ menuIsOpen, isFocused }) =>
    (menuIsOpen || isFocused) &&
    css`
      opacity: 1;
    `}
  :hover,
  :focus {
    opacity: 1;
  }
`

const SpotlightNamespaceControl = styled(NamespaceControl)`
  width: 14rem;
  padding: 0 !important;
`

const StyledLabel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} 8px`};
  background-color: ${({ theme }) => theme.colors.gray[8]};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const MultiValueLabel = (props: any) => {
  return (
    <StyledLabel>
      <components.MultiValueLabel {...props} />
    </StyledLabel>
  )
}

const StyledOption = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const Option = (props: any) => {
  // console.log({ props })

  return (
    <components.Option {...props}>
      <StyledOption>{props.children}</StyledOption>
    </components.Option>
  )
}
const StyledValueContainer = styled(components.ValueContainer)`
  display: flex;
  justify-content: flex-start;
  flex-direction: column !important;
  align-items: flex-start !important;

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

const ValueContainer = (props: any) => {
  // console.log({ props })

  return <StyledValueContainer {...props}>{props.children}</StyledValueContainer>
}

const StyledPlaceholder = styled(components.Placeholder)`
  font-size: 0.9rem;
  margin-left: 0.75rem !important;
`

const Placeholder = (props: any) => {
  return <StyledPlaceholder {...props} />
}

const StyledInput = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.form.input.fg};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} 8px`};
  margin: ${({ theme: { spacing } }) => spacing.tiny} 0;
`

const Input = (props: any) => {
  if (props.isHidden) {
    return <components.Input {...props} />
  }
  return (
    <StyledInput>
      <components.Input {...props} />
    </StyledInput>
  )
}

export const StyledServiceSelectComponents = { Control, MultiValueLabel, Option, ValueContainer, Input, Placeholder }
export const StyledRolesSelectComponents = { Control, Input, ValueContainer, Placeholder }
export const StyledNamespaceSelectComponents = { Control: NamespaceControl }
export const StyledNamespaceSpotlightSelectComponents = { Control: SpotlightNamespaceControl }
