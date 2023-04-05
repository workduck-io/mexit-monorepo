import styled, { keyframes } from 'styled-components'

const float = keyframes`
    0% { 
        opacity: 0.4;
        transform:  scale(0.9); 
    }
    70% { 
        transform: scale(1.005)
    }

    100% { 
        opacity: 1;
        transform:  scale(1); 
    }
`

export const AIResult = styled.div`
  font-weight: bold;
  line-height: 1.25;
  color: ${({ theme }) => theme.tokens.text.default};
`

export const StyledAIResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const GenerateResultContainer = styled.div``

export const AIMenuSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny};
`

export const AIContainerHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
export const AIContainerSection = styled.section`
  flex: 1;
`
export const AIContainerFooter = styled.footer`
  padding: ${({ theme }) => theme.spacing.small};
`

export const FloaterContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.modal}, 0.5);
  box-shadow: inset ${({ theme }) => theme.tokens.shadow.medium};
  backdrop-filter: blur(2rem);
  transform-origin: top;
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  animation: ${float} 5s ease-out forwards;
  will-change: transform;
`

export const StyledAIContainer = styled.div`
  width: 28rem;
  height: 24rem;
  max-width: 28rem;
  max-height: 24rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
