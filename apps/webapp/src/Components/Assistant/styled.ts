import styled from 'styled-components'

const MessageBubble = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.small};

  background-color: ${({ theme }) => theme.tokens.surfaces.modal};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`

export const UserPrompt = styled(MessageBubble)`
  border-right: 5px solid ${({ theme }) => theme.colors.primary};
`

export const AssistantResponse = styled(MessageBubble)`
  border-left: 5px solid ${({ theme }) => theme.colors.secondary};
`

export const PairWrapper = styled.div`
  margin: none;
`

export const ConversationWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.small} 0;
  height: 20rem;
  overflow-y: scroll;
`

export const ConversationContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[3]}, 0.4)`};
  transition: all 0.2s ease-in;

  :hover {
    background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[4]}, 0.3)`};
  }
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.small};
`
