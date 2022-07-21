import styled, { keyframes } from 'styled-components'
import { animated } from 'react-spring'

const checkBorder = (status: string) => {
  let color = '#b1b1b1'
  switch (status) {
    case 'error':
      color = '#FF3932'
      break
    case 'focus':
      color = '#2d9edf'
      break
    case 'success':
      color = '#60B527'
      break
    default:
      color = '#b1b1b1'
      break
  }
  return color
}

const formAnimation = keyframes`
0%{
  opacity:0;
  transform:translateY(-10%);
}
100%{
  opacity:1;
  transform:translateY(0%);
}
`

export const Form = styled(animated.form)`
  display: flex;
  margin-top: 0.75rem;
  flex-direction: column;
  gap: 0.75rem;
  width: 50%;
`
export const FormGroup = styled(animated.div)<{ status: string }>`
  width: 100%;
  height: 2.25rem;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border: ${({ status }) => {
    return 1 + `px solid ${checkBorder(status)}`
  }};
  border-radius: 0.5rem;
  padding: 0.5rem 0.5rem;
  animation: ${formAnimation} 0.5s ease-in-out;
  gap: 0.5rem;
  & :focus {
    border: 1px solid #2d9edf;
  }
  & input:-webkit-autofill {
    -webkit-text-fill-color: #9e9e9e !important;
    -webkit-background-clip: text;
    /* width: 100%;
    margin-left: -2rem !important; */
  }
`

export const SubForm = styled.div`
  width: 100%;
  margin-top: -0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const RememberMe = styled.div`
  display: flex;
  width: 65%;
  align-items: center;
  gap: 0.15rem;
  color: #9e9e9e;
  & span {
    font-size: 0.75rem;
    width: 90%;
  }
  & input {
    width: 10%;
    accent-color: #36393e;
    background-color: #36393e;
    border: 1px solid white;
    & :before {
      accent-color: #36393e;
    }
    & :focus {
      outline: none;
    }
  }
`
export const ForgotPassword = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`

export const Input = styled.input`
  width: 90%;
  font-size: 14px;
  outline: none;
  border: none;
  color: #9e9e9e;
  background-color: transparent;
  &:focus {
    outline: none;
    border: none;
  }
`

export const Select = styled.select`
  outline: none;
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`

export const SubmitButton = styled(animated.button)`
  width: 100%;
  height: 2.25rem;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 0.5rem;
`
export const LoadButton = styled(animated.button)`
  outline: none;
  height: 3rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.gray[10]};
  cursor: not-allowed;
`
