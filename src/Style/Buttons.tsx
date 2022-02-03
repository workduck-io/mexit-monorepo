import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { centeredCss } from './Layouts'
import { LoadingWrapper } from './Loading'

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  primary?: boolean
  large?: boolean
  highlight?: boolean
}

export const Button = styled.button<ButtonProps>`
  ${centeredCss};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.subheading};
  cursor: pointer;
  transition: 0.3s ease;
  background-color: ${({ theme }) => theme.colors.form.button.bg};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 6px 12px ${({ theme }) => transparentize(0.75, theme.colors.primary)};
  }

  ${({ theme: { spacing }, large }) =>
    large
      ? css`
          padding: ${`${spacing.small} ${spacing.medium}`};
          margin: 0 ${spacing.small};
          font-size: 1.2rem;
        `
      : css`
          padding: ${spacing.small};
          margin: 0 ${spacing.tiny};
        `}

  ${({ theme, highlight }) =>
    highlight
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.33, theme.colors.primary)};
          &:hover {
            background-color: ${theme.colors.fade.primary};
            color: ${theme.colors.text.oppositePrimary};
          }
        `
      : ''}

  ${({ theme, primary }) =>
    primary
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          &:hover {
            background-color: ${theme.colors.fade.primary};
            color: ${theme.colors.text.oppositePrimary};
          }
        `
      : ''}
`

export interface AsyncButtonProps {
  children?: React.ReactNode
  primary?: boolean
  large?: boolean
  highlight?: boolean
  disabled?: boolean
  style?: any
  id?: string
  onClick?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  type?: 'button' | 'submit' | 'reset'
}

export const AsyncButton = styled.button<AsyncButtonProps>`
  ${centeredCss};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.subheading};
  cursor: pointer;
  transition: 0.3s ease;
  background-color: ${({ theme }) => theme.colors.form.button.bg};

  ${({ theme, large }) =>
    large
      ? css`
          padding: ${`${theme.spacing.small} ${theme.spacing.medium}`};
          font-size: 1.2rem;
        `
      : css`
          padding: ${({ theme }) => theme.spacing.small};
        `}

  ${({ theme, highlight, primary }) =>
    highlight
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          box-shadow: 0px 4px 8px
            ${({ theme }) => transparentize(0.33, primary ? theme.colors.primary : theme.colors.palette.black)};
        `
      : ''}


  ${({ theme, primary }) => css`
    &:hover {
      box-shadow: 0px 6px 12px ${transparentize(0.5, primary ? theme.colors.primary : theme.colors.palette.black)};
    }
  `}

  ${({ theme, primary }) =>
    primary
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          &:hover {
            background-color: ${theme.colors.fade.primary};
            color: ${theme.colors.text.oppositePrimary};
          }
        `
      : ''}

  ${({ theme, disabled }) =>
    disabled
      ? css`
          pointer-events: none;
          background-color: ${theme.colors.gray[9]};
          color: ${transparentize(0.75, theme.colors.text.fade)};
        `
      : ''}

  ${LoadingWrapper} {
    position: absolute;
    margin: auto;
  }
`
