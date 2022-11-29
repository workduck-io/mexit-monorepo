// different import path!
import { Icon } from '@iconify/react'
import { InputBlock, InputWrapper,Label } from '@mexit/shared'
import Tippy from '@tippyjs/react/headless'
import { Infobox } from '@workduck-io/mex-components'
import React from 'react'

import { ErrorTooltip } from '../Style/Tippy'

export const errorMessages = {
  required: (field: string) => `${field} is required`,
  pattern: (field: string) => `Invalid ${field}`
}

export const PasswordRequirements = () => (
  <>
    <p>Requirements for password:</p>
    <ul>
      <li>At least 6 characters</li>
      <li>A uppercase letter</li>
      <li>A lowercase letter</li>
      <li>A number and</li>
      <li>A special symbol</li>
    </ul>
  </>
)

export const PasswordNotMatch = () => <p>Passwords does not match</p>

export interface LabeledInputProps {
  name: string
  label: string
  inputProps?: any
  labelProps?: any
  labelIcon?: any
  additionalInfo?: string
  // Whether the input is transparent or not
  // Current transparent inputs lie on a card background with their label
  transparent?: boolean
  error?: string
}

const Input = ({
  name,
  label,
  inputProps,
  labelProps,
  labelIcon,
  error,
  additionalInfo,
  transparent
}: LabeledInputProps) => {
  // console.log({ name, label, inputProps, labelProps, error })

  return (
    <InputWrapper transparent={transparent} key={`FormInput_${name}_${label}`}>
      <Tippy
        render={(attrs) => (
          <ErrorTooltip tabIndex={-1} {...attrs}>
            {error}
          </ErrorTooltip>
        )}
        placement="right"
        duration={5000}
        appendTo={() => document.body}
        visible={error !== undefined}
      >
        <Label transparent={transparent} error={error !== undefined} htmlFor={name} {...labelProps}>
          {label} {labelIcon && <Icon icon={labelIcon} />} {additionalInfo && <Infobox text={additionalInfo} />}
        </Label>
      </Tippy>
      <InputBlock error={error !== undefined} transparent={transparent} key={`form-input-${name} `} {...inputProps} />
    </InputWrapper>
  )
}

export interface ErroredInputProps extends LabeledInputProps {
  name: string
  label: string
  inputProps?: any
  labelProps?: any
  errors?: any
}

export const InputFormError = (props: ErroredInputProps) => {
  const { errors, name, label } = props
  const error = errors[name] ? errorMessages[errors[name].type](label) : undefined
  return <Input {...props} error={error} />
}

export default Input
