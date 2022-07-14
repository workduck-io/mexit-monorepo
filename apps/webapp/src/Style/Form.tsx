import styled from 'styled-components'
import { animated } from 'react-spring'
export const Form = styled(animated.form)`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  width: 50%;
`
export const FormGroup = styled(animated.div)`
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid #b1b1b1;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
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
  align-items: center;
  gap: 0.25rem;
  color: black;
  & label {
    font-size: 0.75rem;
  }
`
export const ForgotPassword = styled.p`
  font-size: 0.75rem;
  color: #1a9be5;
  text-decoration: none;
`

export const Input = styled.input`
  outline: none;
  border: none;
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
  height: 3rem;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: linear-gradient(90deg, #4848fe 12.57%, #1a9be5 94.35%);
  color: white;
  border-radius: 0.5rem;
`
export const LoadButton = styled(animated.button)`
  outline: none;
  height: 3rem;
  width: 100%;
  border: 2px solid gray;
  background-color: white;
  cursor: not-allowed;
`
