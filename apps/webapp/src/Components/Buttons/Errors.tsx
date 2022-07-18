import React from 'react'
import { ErrorMessages } from '../../Style/AuthFlow'
import { Icon } from '@iconify/react'

interface ErrorProps {
  message: string
}

const Errors = (props: ErrorProps) => {
  return (
    <ErrorMessages>
      <Icon icon="ci:error-outline" width={10} />
      <span>{props.message}</span>
    </ErrorMessages>
  )
}

export default Errors
