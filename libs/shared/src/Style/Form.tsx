import React from 'react'
import Select from 'react-select'
import Creatable from 'react-select/creatable'

import styled, { css, DefaultTheme, useTheme } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

export enum TextFieldHeight {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

interface InputProps {
  transparent?: boolean
  isDirty?: boolean
  isSelected?: boolean
  fontSize?: string
  // appType?: AppType
  error?: boolean
  center?: boolean
}

export const Input = styled.input<InputProps>`
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small}`};
  transition: all 0.2s ease-in-out;
  ${({ theme, transparent }) => !transparent && generateStyle(theme.generic.form.input)};

  &:focus-visible {
    border-color: ${({ theme }) => theme.tokens.colors.primary.default};
    outline: none;
  }

  ${({ transparent, isDirty, theme }) =>
    transparent &&
    css`
      background-color: transparent;
      border: 1px solid transparent;
      color: ${({ theme }) => theme.tokens.text.default};

      &:focus-visible {
        border-color: transparent;
      }

      &:hover,
      &:focus {
        /* ${({ theme }) => generateStyle(theme.generic.form.input.hover)}; */
      }
      ${isDirty &&
      css`
        /* ${({ theme }) => generateStyle(theme.generic.form.input.hover)}; */
      `}
    `}

  ${({ center }) =>
    center &&
    css`
      text-align: center;
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    `}

  ${({ fontSize }) =>
    fontSize &&
    css`
      font-size: ${fontSize};
    `}

  ${({ theme, error }) =>
    error &&
    css`
      border-color: ${theme.tokens.colors.red} !important;
    `}
`

export const InputBlock = styled(Input)`
  width: 100%;
  display: block;
  ${({ center, theme }) =>
    center
      ? css`
          margin-top: ${({ theme }) => theme.spacing.medium};
        `
      : css`
          margin: ${({ theme }) => theme.spacing.small} 0;
        `}
`

export const NotFoundText = styled.div`
  width: 100%;
  flex-direction: column;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;

  p {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

export const TextArea = styled.textarea`
  ${({ theme }) => generateStyle(theme.generic.form.input)};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};

  &:focus {
    outline: 0;
    border-color: ${({ theme }) => theme.tokens.colors.primary.default};
  }

  &:hover,
  &:active {
    border-color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

export const AuthForm = styled.form`
  width: 100%;

  button {
    font-size: 1.2rem;
  }
`

export const TextAreaBlock = styled(TextArea)<{ height?: TextFieldHeight; error?: any }>`
  width: 100%;
  display: block;

  ${({ error }) =>
    error &&
    css`
      :focus,
      :hover,
      :active {
        border-color: none;
      }
      border: 1px solid ${({ theme }) => theme.tokens.colors.red};
    `}

  ${({ height }) =>
    height &&
    css`
      resize: none;
      box-sizing: border-box;
      ::placeholder {
        color: ${(props) => props.theme.tokens.text.fade};
        opacity: 0.8;
        font-size: 0.96rem;
      }
    `}

   ${({ height }) => {
    switch (height) {
      case TextFieldHeight.SMALL:
        return css`
          max-height: 2.25rem;
        `
      case TextFieldHeight.MEDIUM:
        return css`
          min-height: 4rem;
          max-height: 9rem;
        `
      case TextFieldHeight.LARGE:
        return css`
          height: 9rem;
          max-height: 9rem;
        `
      default:
        return css`
          height: 2.25rem;
        `
    }
  }}
  margin: ${({ theme }) => theme.spacing.small} 0;
`

interface LabelProps {
  error?: boolean
  noTopMargin?: boolean
}

export const Label = styled.label<LabelProps>`
  color: ${({ theme }) => theme.tokens.text.fade};
  margin: ${({ theme: { spacing }, noTopMargin }) => `${noTopMargin ? 0 : spacing.medium} 0 3px`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  max-width: max-content;
`

export const ButtonFields = styled.div<{ position?: string }>`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.large} 0 ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.medium};

  button {
    font-size: 1.2rem;
  }

  ${({ position }) => {
    switch (position) {
      case 'end':
        return css`
          justify-content: end;
        `
      case 'center':
        return css`
          justify-content: center;
        `
      default:
        return ''
    }
  }}
`

export const ReactSelectStyles = (theme: DefaultTheme, options?: { transparent?: boolean }) => {
  const separators = (provided, state) => ({
    ...provided,
    backgroundColor: options?.transparent ? 'none' : theme.tokens.surfaces.separator
  })

  const indicators = (provided, state) => ({
    ...provided,
    color: theme.tokens.text.fade,
    ':hover': {
      color: theme.tokens.text.default
    }
  })

  return {
    menu: (provided, state) => ({
      ...provided,
      // width: state.selectProps.width,
      color: state.selectProps.menuColor,
      backgroundColor: theme.generic.form.input.surface,
      border: theme.generic.form.input.border,
      padding: `${theme.spacing.small} ${theme.spacing.small}`,
      zIndex: 1020
    }),

    indicatorSeparator: separators,
    indicatorsContainer: indicators,
    loadingIndicator: indicators,
    dropdownIndicator: indicators,
    placeholder: (provided, state) => ({
      ...provided,
      color: theme.tokens.text.fade
    }),
    clearIndicator: indicators,
    control: (provided) => ({
      ...provided,
      backgroundColor: options?.transparent ? 'transparent' : theme.generic.form.input.surface,
      border: options?.transparent ? '1px solid transparent' : theme.generic.form.input.border,
      margin: `${theme.spacing.small} 0`,
      ':hover': {
        border: theme.generic.form.input.border
      }
    }),

    option: (provided, state) => {
      let background = state.isSelected ? theme.tokens.colors.primary.default : 'transparent'
      background = state.isFocused ? `rgba(${theme.rgbTokens.colors.primary.default}, 0.25)` : background
      let color = state.isSelected ? theme.tokens.colors.primary.text : theme.tokens.text.default
      color = state.isFocused ? theme.tokens.colors.primary.default : color
      return {
        ...provided,
        borderRadius: theme.borderRadius.small,
        backgroundColor: background,
        whiteSpace: 'nowrap',
        color,
        padding: '6px 10px',
        margin: `${theme.spacing.tiny} 0px`
      }
    },
    singleValue: (provided) => ({
      ...provided,
      margin: 0
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: theme.tokens.surfaces.s[3],
      boxShadow: theme.tokens.shadow.small,
      borderRadius: theme.borderRadius.tiny
    }),
    multiValueRemove: (provided, state) => ({
      ...provided
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledSelect = (props: any) => {
  const theme = useTheme()
  return (
    <Select
      captureMenuScroll
      blurInputOnSelect
      menuShouldBlockScroll
      theme={theme.additional.reactSelect}
      styles={ReactSelectStyles(theme)}
      {...props}
    ></Select>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledCreatatbleSelect = (props: any) => {
  const theme = useTheme()
  const reactSelectTheme = {
    borderRadius: theme.spacing.small,
    colors: {
      primary: theme.tokens.colors.primary.default,
      primary75: theme.tokens.colors.primary.active,
      primary50: theme.tokens.colors.primary.hover,
      primary25: theme.tokens.colors.primary.disabled,
      danger: theme.tokens.colors.red,
      dangerLight: '#FFBDAD',
      neutral0: theme.tokens.surfaces.s[0],
      neutral5: theme.tokens.surfaces.s[1],
      neutral10: theme.tokens.surfaces.s[2],
      neutral20: theme.tokens.surfaces.s[3],
      neutral30: theme.tokens.surfaces.s[4],
      neutral40: theme.tokens.surfaces.s[5],
      neutral50: theme.tokens.surfaces.s[6],
      neutral60: theme.tokens.text.disabled,
      neutral70: theme.tokens.text.fade,
      neutral80: theme.tokens.text.default,
      neutral90: theme.tokens.text.heading
    },
    spacing: {
      baseUnit: 4,
      controlHeight: 38,
      menuGutter: 8
    }
  }
  return <Creatable {...props} theme={reactSelectTheme} styles={ReactSelectStyles(theme, props.style)}></Creatable>
}

export const SelectWrapper = styled.span`
  width: 22ch;
`

/*
 * Date and Time Picker Wrapper for combined styles
 */
export const DatePickerStyles = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.small} 0;

  .react-datepicker {
    font-family: 'Inter', sans-serif;
    width: 100%;
    color: ${({ theme }) => theme.tokens.text.default};
    background: ${({ theme }) => theme.generic.form.input.surface};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    border: none;
    font-size: 0.9rem;
  }
  .react-datepicker__month-container {
    float: none;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    color: ${({ theme }) => theme.tokens.text.heading};
    font-weight: bold;
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
  .react-datepicker__day {
    transition: background 0.2s ease-in-out;
    border-radius: 50%;
  }
  .react-datepicker__day-name {
    color: ${({ theme }) => theme.tokens.text.fade};
  }
  .react-datepicker__day-name:first-child {
    color: ${({ theme }) => theme.tokens.text.heading};
  }
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: ${({ theme }) => theme.tokens.text.default};
  }
  .react-datepicker__day--outside-month {
    color: rgba(${({ theme }) => theme.rgbTokens.text.fade}, 0.7);
  }
  .react-datepicker__header {
    background-color: ${({ theme }) => theme.generic.form.input.surface};
    border-bottom: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-top-left-radius: ${({ theme }) => theme.borderRadius.small};
    padding: 8px 0;
  }
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow,
  .react-datepicker__navigation-icon::before {
    border-color: ${({ theme }) => theme.tokens.text.fade};
    &:hover {
      border-color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }

  .react-datepicker__day--today {
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      rgba(${({ theme }) => theme.rgbTokens.colors.secondary}, 0.6) 0%,
      rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.2) 100%
    );
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    color: ${({ theme }) => theme.tokens.text.heading};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }

  .react-datepicker__day--keyboard-selected:hover,
  .react-datepicker__month-text--keyboard-selected:hover,
  .react-datepicker__quarter-text--keyboard-selected:hover,
  .react-datepicker__year-text--keyboard-selected:hover,
  .react-datepicker__day--selected:hover,
  .react-datepicker__day--in-selecting-range:hover,
  .react-datepicker__day--in-range:hover,
  .react-datepicker__month-text--selected:hover,
  .react-datepicker__month-text--in-selecting-range:hover,
  .react-datepicker__month-text--in-range:hover,
  .react-datepicker__quarter-text--selected:hover,
  .react-datepicker__quarter-text--in-selecting-range:hover,
  .react-datepicker__quarter-text--in-range:hover,
  .react-datepicker__year-text--selected:hover,
  .react-datepicker__year-text--in-selecting-range:hover,
  .react-datepicker__year-text--in-range:hover {
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
  }

  /* Time */

  .react-datepicker__input-time-container {
    float: none;
    text-align: center;
  }
  .react-datepicker__input-time-container input.react-datepicker-time__input {
    width: auto;
    margin-left: 0;
    margin-right: 0;
    padding: ${({ theme }) => theme.spacing.tiny};
    border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    background: ${({ theme }) => theme.tokens.surfaces.s[1]};
    color: ${({ theme }) => theme.tokens.text.default};
    font-size: 1.2rem;
  }
  input[type='time']::-webkit-calendar-picker-indicator {
    filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);
  }
  .react-datepicker__time-container .react-datepicker__time {
    background: transparent;
    font-size: 0.8rem;
  }
  .react-datepicker__time-container {
    border-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    padding: 6px 0px 5px;
    margin-left: 4px;
    white-space: nowrap;
    border-radius: 26px;
    transition: background 0.2s ease-in-out;
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    color: ${({ theme }) => theme.tokens.text.heading};
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected:hover {
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    color: white;
    font-weight: bold;
    cursor: pointer;
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--disabled,
  .react-datepicker__day--disabled,
  .react-datepicker__month-text--disabled,
  .react-datepicker__quarter-text--disabled,
  .react-datepicker__year-text--disabled {
    color: ${({ theme }) => theme.tokens.text.disabled};
  }
  .react-datepicker__day--disabled:hover,
  .react-datepicker__month-text--disabled:hover,
  .react-datepicker__quarter-text--disabled:hover,
  .react-datepicker__year-text--disabled:hover,
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--disabled:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.tokens.text.disabled};
  }
`
