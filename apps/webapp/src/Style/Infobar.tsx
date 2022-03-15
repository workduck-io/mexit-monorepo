import styled from 'styled-components'

import { focusStyles, FocusModeProp } from './Editor'
import { size } from './Responsive'

interface InfoBarWrapperProps extends FocusModeProp {
  wide: string
}

export const InfoBarWrapper = styled.div<InfoBarWrapperProps>`
  overflow-x: hidden;
  height: 100vh;

  @media (max-width: ${size.wide}) {
    min-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '600px' : '300px'
      return `calc(${mainWidth})`
    }};
    max-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '600px' : '300px'
      return `calc(${mainWidth})`
    }};
  }
  @media (min-width: ${size.wide}) {
    min-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '800px' : '300px'
      return `calc(${mainWidth})`
    }};
    max-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '800px' : '300px'
      return `calc(${mainWidth})`
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
