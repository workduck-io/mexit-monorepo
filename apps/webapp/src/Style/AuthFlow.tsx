import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { animated } from 'react-spring'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: white;
  position: absolute;
  overflow: hidden;
`

export const SectionForm = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: -3rem;
`
export const SectionInteractive = styled.div`
  width: 50%;
  height: 100vh;
  background-image: linear-gradient(180deg, #4949ff, #1a9be5);
`
export const Header = styled.div<{ state: string }>`
  width: 100%;
  height: ${({ state }) => {
    return state === 'login' ? 40 + '%' : 20 + '%'
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  line-height: 1rem;
  & h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  & h2 {
    font-size: 1.5rem;
    color: black;
  }
  & p {
    font-weight: 400;
    font-size: 0.85rem;
    margin-left: 0.1rem;
  }
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #fbfbff;
  border: 2px solid #f7f6f9;
`

export const Tabs = styled(animated.div)`
  width: 50%;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(90.1deg, rgba(109, 109, 255, 0.1) 21.86%, rgba(27, 156, 230, 0.1) 88.04%);
  border-radius: 2rem;
  padding: 0.1rem 0.5rem;
`

export const TabLink = styled(Link)<{ status: boolean }>`
  width: 45%;
  background-image: ${({ status }) => {
    return status ? 'linear-gradient(90deg, #6C6CFF 19.18%, #1A9BE5 93.15%)' : ''
  }};
  color: ${({ status }) => {
    return status ? '#ffffff' : '#4949FF'
  }};
  font-size: 0.85rem;
  border-radius: 2rem;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  & :hover {
    text-decoration: none !important;
    text-decoration-style: none;
  }
`

export const Tab = styled.div<{ status: boolean }>`
  width: 45%;
  background-image: ${({ status }) => {
    return status ? 'linear-gradient(90deg, #6C6CFF 19.18%, #1A9BE5 93.15%)' : ''
  }};
  color: ${({ status }) => {
    return status ? '#ffffff' : ' #4949FF 29.62%, #1B9CE5 72.06%);'
  }};
  font-size: 1rem;
  border-radius: 2rem;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`
export const SignInOptions = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`
export const OptionHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & p {
    color: #6c6c71;
  }
`
export const Line = styled.div`
  width: 30%;
  height: 1px;
  background-color: #dcdcdc;
`

export const OptionButtonWrapper = styled.div`
  width: 100%;
  height: 3rem;
  background-image: linear-gradient(90deg, #4949ff, #1b9ce5);
  display: flex;
  padding: 2px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`

export const OptionButton = styled.button`
  display: flex;
  width: 100%;
  height: 2.875rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  outline: none;
  color: black;
  border: 2px solid #4949ff;
  cursor: pointer;
  border-radius: 8px;
`
export const Space = styled.div`
  width: 100%;
  height: 2rem;
`
export const ErrorMessages = styled.p`
  display: flex;
  position: absolute;
  background-color: white;
  border: 2px solid red;
  box-shadow: 1px 2px 10px gray;
  border-radius: 0.75rem;
  top: 1rem;
  width: 15rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #d00000;
`
