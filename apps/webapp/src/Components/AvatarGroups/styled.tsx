import styled, { css } from 'styled-components'

export const AvatarGroupContainer = styled.span<{ margin?: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  flex-direction: row-reverse;

  ${({ margin }) =>
    margin &&
    css`
      margin: ${margin};
    `}
`

export const ProfileAvatarContainer = styled.span<{ offline?: boolean }>`
  width: fit-content;
  margin-right: -1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover:not(:last-of-type) {
    transform: translate(0.5rem);
  }

  ${({ offline }) =>
    offline &&
    css`
      filter: grayscale(1) brightness(0.6);
    `}
`
