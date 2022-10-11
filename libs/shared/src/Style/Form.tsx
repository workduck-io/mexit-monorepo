import { transparentize } from 'polished'
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import styled, { css, DefaultTheme, useTheme } from 'styled-components'

export enum TextFieldHeight {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

interface InputProps {
  transparent?: boolean
  isDirty?: boolean
  isSelected?: boolean
  // appType?: AppType
  error?: boolean
  center?: boolean
}

export const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.colors.form.input.bg};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};
  border: none;

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }

  ${({ transparent, isDirty, theme }) =>
    transparent &&
    css`
      background-color: transparent;
      border: 1px solid transparent;
      &:hover,
      &:focus {
        background-color: ${theme.colors.form.input.bg};
        border: 1px solid ${theme.colors.form.input.border};
      }
      ${isDirty &&
      css`
        background-color: ${theme.colors.form.input.bg};
        border: 1px solid ${theme.colors.form.input.border};
      `}
    `}

  ${({ center }) =>
    center &&
    css`
      text-align: center;
      color: ${({ theme }) => theme.colors.primary};
    `}

  ${({ theme, error }) =>
    error &&
    css`
      border-color: ${theme.colors.palette.red} !important;
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
  background-color: ${({ theme }) => theme.colors.form.input.bg};
  color: ${({ theme }) => theme.colors.form.input.fg};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};

  &:focus {
    outline: 0;

    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover,
  &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const AuthForm = styled.form`
  width: 100%;
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
      border: 1px solid ${({ theme }) => theme.colors.palette.red};
    `}

  ${({ height }) =>
    height &&
    css`
      resize: none;
      box-sizing: border-box;
      ::placeholder {
        color: ${(props) => props.theme.colors.gray[4]};
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
}

export const Label = styled.label<LabelProps>`
  color: ${({ theme }) => theme.colors.text.fade};
  margin: ${({ theme: { spacing } }) => `${spacing.medium} 0 3px`};
  display: flex;
  align-items: center;
  /*${({ theme, error }) =>
    error &&
    css`
      color: ${theme.colors.palette.red};
    `} */
  max-width: max-content;
`

export const ButtonFields = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.large} 0 ${({ theme }) => theme.spacing.medium};
`

export const ReactSelectStyles = (theme: DefaultTheme) => ({
  menu: (provided, state) => ({
    ...provided,
    // width: state.selectProps.width,
    color: state.selectProps.menuColor,
    backgroundColor: theme.colors.background.modal,
    padding: `${theme.spacing.small} ${theme.spacing.small}`,
    zIndex: 1020
  }),

  control: (provided) => ({
    ...provided,
    backgroundColor: theme.colors.form.input.bg,
    borderColor: theme.colors.form.input.border,
    margin: `${theme.spacing.small} 0`
  }),

  option: (provided, state) => {
    let background = state.isSelected ? theme.colors.primary : 'transparent'
    background = state.isFocused ? transparentize(0.33, theme.colors.primary) : background
    return {
      ...provided,
      borderRadius: theme.borderRadius.tiny,
      backgroundColor: background,
      color: state.isSelected || state.isFocused ? theme.colors.text.oppositePrimary : 'inherit',
      padding: '6px 10px',
      margin: `${theme.spacing.tiny} 0px`
    }
  }
})

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
  return <Creatable {...props} theme={theme.additional.reactSelect} styles={ReactSelectStyles(theme)}></Creatable>
}

export const SelectWrapper = styled.div`
  width: 100%;
`

/*
 * Date and Time Picker Wrapper for combined styles
 */
export const DatePickerStyles = styled.div`
  background: ${({ theme }) => theme.colors.form.input.bg};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.small} 0;

  .react-datepicker {
    font-family: 'Inter', sans-serif;
    width: 100%;
    color: ${({ theme }) => theme.colors.text.default};
    background: ${({ theme }) => theme.colors.form.input.bg};
    border: none;
    font-size: 0.9rem;
  }
  .react-datepicker__month-container {
    float: none;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    color: ${({ theme }) => theme.colors.text.heading};
    font-weight: bold;
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
  .react-datepicker__day {
    transition: background 0.2s ease-in-out;
    border-radius: 50%;
  }
  .react-datepicker__day-name {
    color: ${({ theme }) => theme.colors.text.fade};
  }
  .react-datepicker__day-name:first-child {
    color: ${({ theme }) => theme.colors.text.heading};
  }
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: ${({ theme }) => theme.colors.text.default};
  }
  .react-datepicker__day--outside-month {
    color: ${({ theme }) => transparentize(0.3, theme.colors.text.fade)};
  }
  .react-datepicker__header {
    background-color: ${({ theme }) => theme.colors.form.input.bg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.form.input.border};
    border-top-left-radius: ${({ theme }) => theme.borderRadius.small};
    padding: 8px 0;
  }
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow,
  .react-datepicker__navigation-icon::before {
    border-color: ${({ theme }) => theme.colors.text.fade};
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  .react-datepicker__day--today {
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      ${({ theme }) => transparentize(0.4, theme.colors.secondary)} 0%,
      ${({ theme }) => transparentize(0.8, theme.colors.primary)} 100%
    );
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.gray[7]};
    color: ${({ theme }) => theme.colors.text.heading};
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
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
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
    background-color: ${({ theme }) => theme.colors.primary};
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
    border: 1px solid ${({ theme }) => theme.colors.form.input.border};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
    color: ${({ theme }) => theme.colors.text.default};
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
    border-color: ${({ theme }) => theme.colors.form.input.border};
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
    background-color: ${({ theme }) => theme.colors.gray[7]};
    color: ${({ theme }) => theme.colors.text.heading};
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: bold;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
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
    color: ${({ theme }) => transparentize(0.4, theme.colors.text.fade)};
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
    color: ${({ theme }) => transparentize(0.5, theme.colors.text.fade)};
  }
`
