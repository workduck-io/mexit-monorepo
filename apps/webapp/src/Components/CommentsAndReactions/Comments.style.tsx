import { Title } from '@workduck-io/mex-components'
import { mix, transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const CommentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.6, theme.colors.gray[7])};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  backdrop-filter: blur(10px);

  max-height: 50vh;
  overflow-y: auto;

  ${Title} {
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.fade};
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
  color: ${({ theme }) => theme.colors.text.default};
  max-width: 400px;
  padding-left: ${({ theme }) => theme.spacing.tiny};
`

export const CommentWrapper = styled.div<{ userCommented?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.1, theme.colors.gray[7])};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ userCommented, theme }) =>
    userCommented &&
    css`
      background: linear-gradient(
        120deg,
        ${mix(0.2, theme.colors.primary, theme.colors.gray[8])} 0%,
        ${mix(0.0, theme.colors.primary, theme.colors.gray[7])} 100%
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
  color: ${({ theme }) => theme.colors.text.heading};
  font-weight: 500;
  svg,
  img {
    border-radius: 50%;
  }

  ${({ userCommented, theme }) =>
    userCommented &&
    css`
      color: ${theme.colors.primary};
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
  color: ${({ theme }) => theme.colors.text.fade};
  gap: ${({ theme }) => theme.spacing.tiny};
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out;

  :hover {
    opacity: 1;
  }
`
