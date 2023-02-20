import styled, { css, keyframes } from 'styled-components'

export const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`

export const Label = styled.label<{ size: string; disabled: boolean }>`
  position: relative;
  display: inline-block;
  font-size: ${(props) => {
    if (props.size === 'xs') return '6px'
    if (props.size === 'sm') return '8px'
    if (props.size === 'lg') return '12px'
    return '10px'
  }};
  width: 6em;
  height: 3.4em;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  ${Input} {
    opacity: 0;
    width: 0;
    height: 0;
  }
`

export const Slider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  cursor: pointer;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: 3.4em;

  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};

  transition: all 0.4s ease-in-out;

  &:hover {
    box-shadow: 0px 0px 11px 6px rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.25);
  }

  &::before {
    position: absolute;
    content: '';
    height: 2.6em;
    width: 2.6em;
    left: 0.4em;
    bottom: 0.4em;
    background-color: ${({ theme }) => theme.tokens.text.fade};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  ${Input}:checked + & {
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
  }

  ${Input}:checked + &::before {
    transform: translateX(2.6em);
    background-color: ${({ theme }) => theme.tokens.colors.primary.text};
  }

  ${Input}:disabled + & {
    pointer-events: none;
    background: ${({ theme }) => theme.tokens.text.disabled};
  }
`

export const ShareContainerCss = css`
  height: 6em;
  width: 32em;
`

export const ShareLabel = styled(Label)`
  ${ShareContainerCss}
`

export const ShareSlider = styled(Slider)<{ text?: string; checked?: boolean }>`
  ${ShareContainerCss}
  transform: translate3d(0,0,0);

  &::before {
    position: absolute;
    ${({ checked }) =>
      checked
        ? css`
            content: 'Unpublish';
          `
        : css`
            content: 'Publish';
          `};

    height: fit-content;
    font-size: 1rem;
    width: fit-content;
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
    left: 0.4em;
    top: 0.3em;
    background-color: ${({ theme }) => theme.tokens.surfaces.s[4]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    transition: 0.4s;
    border-radius: ${({ theme }) => theme.borderRadius.large};
  }

  ${Input}:checked + & {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    transform: translate3d(0, 0, 0);
  }

  &::after {
    position: absolute;

    right: 0.8em;
    content: '';
    ${({ checked }) => css`
      animation: ${ContentKeyframes(checked)} 1s forwards;
    `};
    /* ${({ checked }) => (checked ? "content: 'Keep it secret';" : "content: 'Share to the world';")} */
    top: 0.4em;
    height: fit-content;
    opacity: 0.4;
    font-size: 1rem;
    width: fit-content;
    padding: ${({ theme }) => theme.spacing.small};
    display: flex;
    align-items: center;
    transition: transform 0.4s;
  }

  ${Input}:checked + &::before {
    transform: translateX(8.2em);
    background-color: ${({ theme }) => theme.tokens.surfaces.s[4]};
  }

  ${Input}:checked + &::after {
    transform: translateX(-7.4em);
  }
`

const ContentKeyframes = (checked: boolean) => keyframes`
    0% {
      opacity: 0;
      ${checked ? "content: 'Keep it secret';" : "content: 'Share to the world';"}
    }
    5% {
      opacity: 0.4;
      ${checked ? "content: 'Keep it secret';" : "content: 'Share to the world';"}

    }
    100% {
      opacity: 0.4;
      ${checked ? "content: 'Keep it secret';" : "content: 'Share to the world';"}
    }
  
`
