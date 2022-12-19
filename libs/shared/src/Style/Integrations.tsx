import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

export const IntegrationContainer = styled.section`
  margin: 0 4rem;
  height: calc(100vh - ${({ theme }) => (theme.additional.hasBlocks ? '6rem' : '2rem')});
`

export const TemplateContainer = styled.div`
  display: flex;
  max-height: 375px;
  margin: 1rem -0.5rem;
  background: ${({ theme }) => theme.tokens.surfaces.s[1]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.large};

  & > section {
    width: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 1rem;

    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
    border-radius: ${({ theme }) => theme.borderRadius.large};
  }
`

export const TemplateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

export const ServiceName = styled.div`
  font-size: 1rem;
  font-weight: normal;
  font-weight: 600;
  letter-spacing: 1px;
  padding-bottom: 1rem;
`

export const PlusIcon = styled.div`
  padding: 2rem;
  margin-left: ${({ theme }) => theme.spacing.medium};
  width: 10rem;
  height: 10rem;
  display: flex;
  color: ${({ theme }) => theme.tokens.colors.white};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const IntegrationTitle = styled.h1`
  padding: 2.5rem 1rem;
  font-size: 36px;
  line-height: 44px;
  user-select: none;
`

export const TemplateTitle = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36px;
  line-height: 44px;
  padding-top: 2.5rem;
`

export const PrimaryText = styled.span`
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const TemplateSubtitle = styled(TemplateTitle)`
  font-size: 20px;
  margin: 0;
  padding: 0.5rem 0;
  padding-top: 0.25rem;
  line-height: 1.5;
  color: #944f4f;
`

export const Services = styled.div`
  display: flex;
  align-items: center;
`

export const ServiceCard = styled.div<{ hover?: boolean; disabled?: boolean }>`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${({ theme }) => generateStyle(theme.integrations.card.wrapper)};
  margin-left: ${({ theme }) => theme.spacing.medium};
  display: flex;
  width: 10rem;
  height: 12rem;
  flex-direction: column;
  cursor: pointer;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  transition: all 0.2s ease-in-out;
  border: 0.2rem solid transparent;

  :hover {
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      background: transparent;
      box-shadow: none;
      opacity: 0.4;
    `}

  ${({ theme, hover }) =>
    hover
      ? css`
          :hover {
            border: 0.2rem solid ${theme.tokens.colors.primary.hover};
          }
        `
      : css`
           {
            border: 0.2rem solid ${theme.tokens.colors.primary.default};
          }
        `}
`

export const ActiveStatus = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  color: #ffffff;
`

export const RightCut = styled.span`
  position: absolute;
  border-width: 1.5rem;
  border-style: solid;
  top: -1px;
  padding: 0 px;
  right: -1px;
  border-color: ${({ theme }) => theme.tokens.colors.secondary} ${({ theme }) => theme.tokens.colors.secondary}
    transparent transparent;
  border-image: initial;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
  margin: 0 px;
`

export const CenteredFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  flex-direction: column;
  flex: 1;
`

export const TemplateInfoList = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: 2rem 1rem 0 0;
  cursor: pointer;
  padding: 1rem;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  transition: all 0.2s ease-in-out;
  border: 0.2rem solid transparent;
  :hover {
    border: 0.2rem solid ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

export const Margin = styled.div`
  margin: 1rem 1rem 0.5rem 0;
  display: flex;
  justify-content: space-between;
`

export const IntegrationStyledIcon = styled(Icon)`
  margin-right: 1rem;
`

export const IntegrationScroll = styled.div`
  max-height: 66%;
  overflow-y: auto;
`

export const Text = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.tokens.text.heading};
`

export const FullHeight = styled.div`
  height: 100%;
  width: 100%;
  flex: 3;
`

export const TemplateDetails = styled.div`
  flex: 1;
`

export const Flex = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
`

export const NoWrap = styled(Flex)`
  white-space: nowrap;
`

export const CardTitle = styled.div`
  font-size: 1rem;
  line-height: 1.2rem;
  font-weight: bold;
`

interface MenuTriggerProps {
  selected: boolean
  readOnly: boolean
}

export const IntentMapItem = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.tiny}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  position: relative;
`

// * Not in integration page
export const IntegrationMenuTrigger = styled.div<MenuTriggerProps>`
  display: flex;
  align-items: center;
  width: max-content;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px dashed ${({ theme }) => theme.tokens.surfaces.s[3]};
  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }

  ${({ readOnly, theme }) =>
    !readOnly &&
    css`
      cursor: pointer;
      &:hover {
        border-color: ${theme.tokens.colors.primary.default};
      }
    `}

  ${({ theme, selected }) =>
    selected &&
    css`
      border: 1px solid transparent;
      background-color: ${theme.tokens.surfaces.s[3]};
      svg {
        color: ${theme.tokens.colors.primary.default};
      }
    `}
`

export const SyncIntentsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  ${IntegrationMenuTrigger} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
