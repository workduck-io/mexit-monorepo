import styled, { css } from 'styled-components'

import { Title } from '@workduck-io/mex-components'

export const CommentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.small};
  background: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[2]}, 0.5);
  border-radius: ${({ theme }) => theme.borderRadius.small};
  backdrop-filter: blur(10px);

  max-height: 50vh;
  overflow-y: auto;

  ${Title} {
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
    color: ${({ theme }) => theme.tokens.text.fade};
    margin: 0;
  }
`

interface NewCommentWrapperProps {
  isWriting?: boolean
}

export const NewCommentWrapper = styled.div<NewCommentWrapperProps>`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  width: 400px;
`

export const CommentContentWrapper = styled.div`
  color: ${({ theme }) => theme.tokens.text.default};
  max-width: 400px;
  padding-left: ${({ theme }) => theme.spacing.tiny};
`

export const CommentWrapper = styled.div<{ userCommented?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ userCommented, theme }) =>
    userCommented &&
    css`
      background: linear-gradient(
        120deg,
        rgba(${theme.rgbTokens.surfaces.s[3]}, 0.25) 0%,
        rgba(${theme.rgbTokens.colors.primary.default}, 0.15) 100%
      );
    `}
`

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  justify-content: space-between;
`

export const CommentAuthor = styled.div<{ userCommented?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.tokens.text.heading};
  font-weight: 500;
  svg,
  img {
    border-radius: 50%;
  }

  ${({ userCommented, theme }) =>
    userCommented &&
    css`
      color: ${theme.tokens.colors.primary.default};
    `}
`

export const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const CommentTime = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.tokens.text.fade};
  gap: ${({ theme }) => theme.spacing.tiny};
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out;

  :hover {
    opacity: 1;
  }
`
