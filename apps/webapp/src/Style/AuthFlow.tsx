import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { animated } from 'react-spring'
import { Icon } from '@iconify/react'

const animateErrorMessage = keyframes`
0% {opacity:0; transform:translateY(-5%);}
100% {opacity:1; transform:translateY(0%);}
`

const animateTabs = keyframes`
0%{background-position : 50% -10%;}
100% {background-position: 50% 50%;}
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[9]};
`

export const SectionForm = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  /* background-color: #36393e; */
  background-color: ${({ theme }) => theme.colors.gray[9]};
`
export const SectionInteractive = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
`

export const InteractiveContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 2rem;
  margin-top: 35%;
`

export const InteractiveHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  & h1 {
    color: white;
    font-size: 2.75rem;
    font-weight: 700;
    margin-top: -2rem;
  }
`

export const InteractiveContent = styled.div`
  width: 100%;
  margin-top: -2rem;
  & p {
    width: 75%;
    color: white;
    font-size: 1rem;
  }
`

export const SubContent = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  margin-top: -1rem;
  align-items: center;
  padding: 0.25rem 0.75rem;
  & p {
    width: 80%;
    color: white;
  }
`

export const ImageContainer = styled.div`
  display: flex;
  width: 12%;
`

export const ImageWrapper = styled.div`
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-right: -0.5rem;
`

export const Image = styled.img`
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
`

export const Header = styled.div<{ state: string }>`
  width: 100%;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
export const Message = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  line-height: 1rem;
  & h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
  }
  & h2 {
    font-size: 1.5rem;
    color: white;
  }
  & p {
    font-weight: 400;
    font-size: 0.85rem;
    margin-top: -0.5rem;
  }
  & span {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    & :hover {
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }
`

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #fbfbff;
  border: 2px solid #f7f6f9;
`

export const Tabs = styled(animated.div)`
  width: 50%;
  min-height: 3.5rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(45, 158, 223, 0.07);
  border-radius: 2.5rem;
  padding: 0.1rem 0.5rem;
`

export const TabLink = styled(Link)<{ status: boolean }>`
  width: 45%;
  background-color: ${({ status, theme }) => {
    return status ? `${theme.colors.primary}` : ''
  }};
  color: white;
  font-size: 0.85rem;
  border-radius: 2rem;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  animation: ${animateTabs} 1s ease-out;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
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
    color: dcdcdc;
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
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background-color: #f7f7f7;
  outline: none;
  font-weight: 700;
  color: #094067;
  cursor: pointer;
  border-radius: 8px;
`
export const Space = styled.div`
  width: 100%;
  height: 2rem;
`
export const ErrorMessages = styled(animated.p)`
  display: flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.75rem;
  color: #ff3932;
  margin-top: -0.25rem;
  margin-bottom: -0.25rem;
  animation: ${animateErrorMessage} 0.3s ease-in;
`

export const AuthIcon = styled(Icon)`
  color: #9e9e9e;
`
