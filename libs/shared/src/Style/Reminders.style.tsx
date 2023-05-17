import styled, { createGlobalStyle, css } from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { ReminderStatus } from '@mexit/core'

import { IntegrationTitle } from './Integrations'
import { Description } from './Typography'

export const RemindersWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.medium} 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  height: 100%;
`

export const ReminderGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  height: auto;

  & > ${IntegrationTitle} {
    font-size: 1.5rem;
    font-weight: normal;
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    margin: 0;
  }
`

const BASE_REMINDER_HEIGHT = 80
const BASE_TITLE_HEIGHT = 20
export const BASE_WIDTH = 500
const BASE_PADDING = 12

const REMINDERS_DIMENSIONS = {
  height: 100,
  width: BASE_WIDTH + BASE_PADDING * 2,
  baseWidth: BASE_WIDTH,
  padding: BASE_PADDING,
  offset: 20
}

const ReminderWidth = css`calc(${REMINDERS_DIMENSIONS.baseWidth}px - ${({ theme }) => theme.spacing.medium} * 2)`

export const ReminderButtonControlsWrapper = styled.div`
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.medium}`};
  flex-wrap: wrap;
  width: ${ReminderWidth};
  transition: opacity 0.25s ease-in-out, height 0.25s ease-in-out, gap 0.25s ease-in-out;
  ${Button} {
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
  &:hover {
    opacity: 1;
  }
`

export const ReminderControlsWrapper = styled.div`
  margin-top: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: ${ReminderWidth};
  gap: 0;
  transition: opacity 0.25s ease-in-out, max-height 0.25s ease-in-out, height 0.25s ease-in-out;
`

export const SnoozeControls = styled.div<{ showControls?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[0]}, 0.5);
  width: max-content;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: opacity 0.25s ease-in-out, height 0.25s ease-in-out, padding 0.25s ease-in-out, gap 0.25s ease-in-out,
    margin 0.25s ease-in-out;

  ${({ showControls }) =>
    showControls
      ? css`
          opacity: 1;
          height: 40px;
          gap: ${({ theme }) => theme.spacing.medium};
          padding: 0 0 0 ${({ theme }) => theme.spacing.small};
          margin: ${({ theme }) => `${theme.spacing.small} 0 ${theme.spacing.tiny}`};
        `
      : css`
          opacity: 0.5;
          height: 0px;
          overflow: hidden;
          gap: ${({ theme }) => theme.spacing.tiny};
          padding: 0;
          margin: 0;
        `}
`

export const ReminderStyled = styled.div<{ isNotification?: boolean; showControls?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: max-content;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.25s ease-in-out, height 0.25s ease-in-out;

  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  background: linear-gradient(
    35deg,
    ${({ theme }) => theme.tokens.surfaces.s[2]} 0%,
    ${({ theme }) => theme.tokens.surfaces.s[3]} 100%
  );

  ${IntegrationTitle} {
    font-size: 1.25rem;
    line-height: 2rem;
    font-weight: normal;
    padding: 0;
    user-select: none;
    margin: 0;
  }

  ${Description} {
    padding: 0;
    margin: 0;
  }

  ${({ isNotification, showControls }) =>
    isNotification
      ? css``
      : css`
          ${ReminderControlsWrapper} {
            opacity: 0.5;
            overflow: hidden;
            width: 100%;
            ${ReminderButtonControlsWrapper} {
              max-height: 0px;
              width: 100%;
            }
            ${SnoozeControls} {
              opacity: 0.5;
              height: 0px;
              overflow: hidden;
              gap: ${({ theme }) => theme.spacing.tiny};
              padding: 0;
              margin: 0;
            }
          }
          :hover {
            ${ReminderControlsWrapper} {
              overflow: hidden;
              opacity: 1;
              width: 100%;
              ${ReminderButtonControlsWrapper} {
                max-height: 200px;
                gap: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.large};
              }
              ${SnoozeControls} {
                ${showControls
                  ? css`
                      opacity: 1;
                      height: 40px;
                      gap: ${({ theme }) => theme.spacing.medium};
                      padding: 0 0 0 ${({ theme }) => theme.spacing.small};
                      margin: ${({ theme }) => theme.spacing.small} 0;
                    `
                  : css`
                      opacity: 0.5;
                      height: 0px;
                      overflow: hidden;
                      gap: ${({ theme }) => theme.spacing.tiny};
                      padding: 0;
                      margin: 0;
                    `}
              }
            }
          }
        `}
`

export const ReminderTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: ${({ theme }) => theme.tokens.text.fade};
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;
`

export const ReminderStateTag = styled.div<{ state?: ReminderStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: 0.8rem;
  letter-spacing: 0.1rem;

  ${({ theme, state }) => {
    let color = theme.tokens.colors.primary.default
    switch (state) {
      case 'seen':
        color = theme.tokens.colors.green
        break

      case 'active':
        color = theme.tokens.colors.blue
        break

      case 'snooze':
        color = theme.tokens.colors.yellow
        break

      case 'missed':
        color = theme.tokens.colors.red
        break
    }

    return css`
      color: ${theme.tokens.text.default};
      background-color: ${theme.tokens.surfaces.s[3]};
    `
  }}
`

export const ReminderExact = styled.div``
export const ReminderRelative = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  flex-grow: 1;
  svg {
    height: 1rem;
    width: 1rem;
  }
`

export const ReminderInfobar = styled.div`
  height: calc(100vh - 7.5rem);
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  padding: 0 ${({ theme }) => theme.spacing.medium};
  border-radius: 0px 0px ${({ theme }) => `calc(2 * ${theme.borderRadius.large}) calc(2* ${theme.borderRadius.large})`};

  & > ${IntegrationTitle} {
    margin: ${({ theme }) => theme.spacing.large} 0 0;
  }
`
export const SelectedDate = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  margin-top: ${({ theme }) => theme.spacing.small};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  justify-content: center;
  align-items: center;
  max-width: 325px;

  i {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const ReminderGroupsWrapper = styled.div`
  color: ${({ theme }) => theme.tokens.text.default};
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  width: ${REMINDERS_DIMENSIONS.baseWidth}px;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${REMINDERS_DIMENSIONS.padding}px;
  ${ReminderStyled} {
    padding: ${({ theme }) => theme.spacing.medium};
    width: calc(${REMINDERS_DIMENSIONS.baseWidth}px - ${({ theme }) => theme.spacing.medium} * 2);
  }
`

export const ReminderGroupTitle = styled.div`
  margin-top: ${({ theme }) => theme.spacing.medium};
  display: block;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const ReminderUIGlobal = createGlobalStyle`
  #root {
    overflow-x: hidden;
  }
  body, html, #root {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[1]};
  }
`
