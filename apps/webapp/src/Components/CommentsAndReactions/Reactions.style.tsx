import styled, { css, keyframes } from 'styled-components'
import { mix, transparentize } from 'polished'

//

const expandOnClick = keyframes`
  from {
    transform: scale(1) translateY(0);
  }

  to {
    transform: scale(0.75) translateY(10px);
  }
`

export const ReactionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny};

  background: ${({ theme }) => transparentize(0.6, theme.colors.gray[7])};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  backdrop-filter: blur(10px);

  max-height: 50vh;
  overflow-y: auto;
`

export const ReactionButton = styled.button<{ userReacted?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  &:active {
    background: ${({ theme }) => theme.colors.gray[7]};
    animation: ${expandOnClick} 0.2s ease-in-out;
  }

  ${({ userReacted, theme }) =>
    userReacted &&
    css`
      background: linear-gradient(
        120deg,
        ${mix(0.0, theme.colors.primary, theme.colors.gray[7])} 0%,
        ${mix(0.3, theme.colors.primary, theme.colors.gray[8])} 100%
      );
    `}
`

export const ReactionCount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
`

export const CompressedReactionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: ${({ theme }) => theme.spacing.tiny};
  z-index: 10;

  /*
  * This is a comment
  * Make every nth reaction smaller in size and behind the first reaction
  */
  ${() => {
    return [1, 2, 3].map(
      (i) => css`
        & > *:nth-child(${i}) {
          transition: transform 0.2s ease-in-out, margin 0.2s ease-in-out;
          transform: scale(${1 - (i - 1) * 0.2});
          z-index: ${13 - i};
          margin-left: -${i * 1}px;
          opacity: ${1 - (i - 1) * 0.3};
        }
      `
    )
  }}}

  &:hover {
    gap: ${({ theme }) => theme.spacing.tiny};
    & > *:nth-child(1),
    & > *:nth-child(2),
    & > *:nth-child(3) {
      transform: scale(1);
      z-index: 13;
      margin-left: 0;
      opacity: 1;
    }
  }
`

export const ReactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ReactionDetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.large};
  width: 100%;
`

export const ReactionDetailsReactions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ReactionDetailsUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg,
  img {
    border-radius: 50%;
  }
`
