import styled, { css } from 'styled-components'

import { focusStyles, FocusModeProp } from './Editor'
import { size } from './Responsive'

interface InfoBarWrapperProps extends FocusModeProp {
  mode: string
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

const getMainWidth = (mode: string, wide: boolean) => {
  switch (mode) {
    case 'graph':
    case 'reminders':
    case 'flow':
      return wide ? infoWidths.large.wide : infoWidths.large.normal
    case 'suggestions':
      return wide ? infoWidths.small.wide : infoWidths.small.normal
    case 'default':
    default:
      return infoWidths.default
  }
}

export const InfoBarWrapper = styled.div<InfoBarWrapperProps>`
  overflow-x: hidden;
  height: 100vh;

  @media (max-width: ${size.wide}) {
    ${({ mode }) => {
    const mainWidth = getMainWidth(mode, false)
    return css`
        min-width: calc(${mainWidth});
        max-width: calc(${mainWidth});
      `
  }};
  }
  @media (min-width: ${size.wide}) {
    ${({ mode }) => {
    const mainWidth = getMainWidth(mode, true)
    return css`
        min-width: calc(${mainWidth});
        max-width: calc(${mainWidth});
      `
  }};
  }
  transition: opacity 0.3s ease-in-out;
  ${focusStyles}
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
  min-width: ${infoWidths.large.normal};
  * {
    outline: none;
    outline-style: none;
  }
`

export const InfobarMedium = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  min-width: ${infoWidths.small.normal};
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
  margin-top: 2rem;

  background-color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  label {
    flex-grow: 1;
    text-align: center;
  }
`
