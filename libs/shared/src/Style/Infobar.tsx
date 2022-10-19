import styled, { css } from 'styled-components'

import { FOCUS_MODE_OPACITY } from '@mexit/core'

import { FocusModeProp } from './Editor'
import { size } from './Responsive'

interface InfoBarWrapperProps extends FocusModeProp {
  mode: string
  hasPinnedSuggestions?: boolean
}

const infoWidths = {
  large: {
    wide: '800px',
    normal: '600px'
  },
  small: {
    wide: '600px',
    normal: '400px'
  },
  default: '300px'
}

export const InfoBarWrapper = styled.div<InfoBarWrapperProps>`
  overflow-x: hidden;

  @media (max-width: ${size.wide}) {
    min-width: ${infoWidths.small.normal};
    max-width: ${infoWidths.small.normal};
    ${
      /*({ mode }) => {
      const mainWidth = getMainWidth(mode, false)
      return css`
        min-width: calc(${mainWidth});
        max-width: calc(${mainWidth});
      `
    }*/ false
    };
  }
  @media (min-width: ${size.wide}) {
    min-width: ${infoWidths.small.wide};
    max-width: ${infoWidths.small.wide};
    ${
      /*({ mode }) => {
      const mainWidth = getMainWidth(mode, true)
      return css`
        min-width: calc(${mainWidth});
        max-width: calc(${mainWidth});
      `
    }*/ false
    };
  }
  transition: opacity 0.3s ease-in-out;
  ${({ $focusMode, $focusHover, mode, hasPinnedSuggestions }) => {
    if ($focusMode) {
      if (mode === 'suggestions' && hasPinnedSuggestions) {
        return $focusHover
          ? css`
              opacity: 1;
              ${InfobarTools} {
                transition: opacity 0.3s ease-in-out;
                opacity: 1;
              }
            `
          : css`
              opacity: 1;
              ${InfobarTools} {
                transition: opacity 0.3s ease-in-out;
                opacity: ${FOCUS_MODE_OPACITY};
              }
            `
      }
      return $focusHover
        ? css`
            opacity: 1;
          `
        : css`
            opacity: ${FOCUS_MODE_OPACITY};
          `
    }
  }}
`

export const TemplateInfoBar = styled(InfoBarWrapper)`
  /* overflow-y: scroll; */
  height: 100%;
`

export const InfoWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const InfoWidgetScroll = styled.div`
  overflow-y: auto;
  max-height: 20vh;
`

export const InfobarFull = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  min-width: ${infoWidths.default};
  * {
    outline: none;
    outline-style: none;
  }
`

export const InfobarMedium = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  height: calc(100vh - 9.5rem);
  * {
    outline: none;
    outline-style: none;
  }
`

export const InfobarTools = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme: { spacing } }) => `${spacing.large} ${spacing.medium}`};
  margin-top: 0.5rem;

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  label {
    flex-grow: 1;
    text-align: center;
  }
`

export const SuggestionIconsGroup = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    width: 12px;
    height: 12px;
  }
`
