import styled, { css } from 'styled-components'

import { FocusModeProp, focusStyles } from './Editor'
import { Label } from './Form'
import { HoverFade } from './Helpers'
import { FadeInOut } from './Layouts'
import { ProfileIcon } from './UserPage'

interface DataWrapperProps {
  interactive?: boolean
}

export const DataWrapper = styled.div<DataWrapperProps>`
  display: flex;
  align-items: center;

  ${ProfileIcon} {
    margin: 0;
  }

  svg {
    color: ${({ theme }) => theme.tokens.text.fade};
    margin-right: ${({ theme }) => theme.spacing.small};
  }

  svg,
  img {
    box-shadow: none;
  }

  ${({ theme, interactive }) =>
    interactive &&
    css`
      &:hover {
        color: ${theme.tokens.text.heading};
        svg {
          color: ${theme.tokens.colors.primary.default};
        }
      }
    `}
`

export const DataGroup = styled.div``

interface MetaDataWrapperProps extends FocusModeProp {
  $fadeOnHover?: boolean
  $isVisible?: boolean
}

export const MetadataWrapper = styled.div<MetaDataWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 ${({ theme }) => theme.spacing.large};

  ${({ theme, $fadeOnHover }) =>
    $fadeOnHover &&
    css`
      ${HoverFade}
      ${ProfileIcon} {
        filter: grayscale(1);
        opacity: 0.5;
      }
      &:hover {
        ${ProfileIcon} {
          filter: grayscale(0);
          opacity: 1;
        }
      }
    `}

  ${(props) => focusStyles(props)}

  ${Label} {
    color: ${({ theme }) => theme.tokens.text.fade};
    font-size: 0.9rem;
    margin: 0 0 0.2rem;
  }

  ${DataGroup}:first-child {
    margin-right: calc(2 * ${({ theme }) => theme.spacing.large});
  }
  ${DataWrapper}:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.small};
  }

  /* ${({ $isVisible }) => FadeInOut($isVisible)} */
`
