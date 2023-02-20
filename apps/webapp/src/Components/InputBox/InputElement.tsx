import { MultiEmailValidate } from '../../Utils/constants'

import { StyledInputElement } from './styled'

type InputElementProps = any

export const InputElement: React.FC<InputElementProps> = (props) => {
  const { register, ...rest } = props.inputProps

  return (
    <StyledInputElement
      {...rest}
      {...register('email', {
        required: true,
        validate: MultiEmailValidate
      })}
    />
  )
}
