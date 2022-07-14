import React from 'react'
import { ErrorMessages } from '../../Style/AuthFlow'
import { Icon } from '@iconify/react'

interface ErrorProps {
  message: string
  handleBlur: any
}

const Errors = (props: ErrorProps) => {
  return (
    <ErrorMessages onBlur={props.handleBlur}>
      <Icon icon="ant-design:warning-filled" width={20} />
      <span>{props.message}</span>
    </ErrorMessages>
  )
}

export default Errors
