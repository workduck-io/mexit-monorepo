import styled, { keyframes } from 'styled-components'

import { SupportedAIEventTypes } from '@mexit/core'

import { BodyFont } from '../../Style/Search'

const getEventColor = (type: SupportedAIEventTypes | undefined, saturation = 100, lightness = 75) => {
  if (!type) return `hsl(-210, 100%, 75%)`

  let hash = 0
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 7) - hash)
    hash = hash & hash
  }

  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`
}

const float = keyframes`
    0% { 
        opacity: 0.4;
        transform:  scale(0.9); 
        transform: translateY(-0.25rem); 
    }
    70% { 
        transform: scale(1.005)
        
    }

    100% { 
        opacity: 1;
        transform: translateY(0rem); 
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

export const AIContainerHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const AIResponseContainer = styled.div`
  ${BodyFont}
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  max-height: 16rem;
`

export const AIContainerSection = styled.section`
  flex: 1;
  overflow: hidden auto;
`
export const AIContainerFooter = styled.footer`
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const StyledAIHistoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

export const StyledAIHistory = styled.span<{ type: SupportedAIEventTypes }>`
  :hover {
    cursor: pointer;
    background: ${({ theme }) => theme.tokens.surfaces.s[4]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  }

  padding: ${({ theme }) => theme.spacing.tiny};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};

  span {
    padding: ${({ theme }) => theme.spacing.tiny};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    background-color: ${({ type }) => getEventColor(type)};
  }
`

export const FloaterContainer = styled.div`
  color: ${({ theme }) => theme.tokens.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.modal}, 0.8);
  box-shadow: inset ${({ theme }) => theme.tokens.shadow.medium};
  backdrop-filter: blur(2rem);
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.app};
  transform-origin: top;
  z-index: 101;
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  animation: ${float} 150ms ease-out;
`

export const StyledAIContainer = styled.div`
  width: 40rem;
  height: 24rem;
  max-width: 40rem;
  max-height: 24rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
