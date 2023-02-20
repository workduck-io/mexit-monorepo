import { InputElement } from './InputElement'
import { InputBoxContainer } from './styled'

type InputBoxProps = {
  leftChild?: JSX.Element
  rightChild?: JSX.Element
  inputProps?: any
}

/**
 *
 * @param props
 * @returns InputBox Component
 * - leftIcon
 * - Input
 * - rightButton
 */

const InputBox: React.FC<InputBoxProps> = ({ leftChild = <></>, rightChild = <></>, inputProps }) => {
  const { errors, name, ...rest } = inputProps

  return (
    <InputBoxContainer $error={errors[name]}>
      {leftChild}
      <InputElement inputProps={rest} />
      {rightChild}
    </InputBoxContainer>
  )
}

export default InputBox
