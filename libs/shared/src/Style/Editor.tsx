import styled, { css } from 'styled-components'

import { Button } from '@workduck-io/mex-components'
import { generateStyle } from '@workduck-io/mex-themes'

import { FOCUS_MODE_OPACITY } from '@mexit/core'

import { ScrollStyles } from './Helpers'
import { FadeInOut } from './Layouts'

export interface FocusModeProp {
  // Focus mode is on?
  $focusMode?: boolean
  // Is element Hovered over focus mode?
  $focusHover?: boolean
  // Override focus mode opacity
  $overrideOpacity?: number
}

export const focusStyles = ({ $focusMode, $focusHover }: FocusModeProp) => {
  if ($focusMode)
    return $focusHover
      ? css`
          opacity: 1;
        `
      : css`
          opacity: ${FOCUS_MODE_OPACITY};
        `
}

export const NoteTitle = styled.h1``

export const NodeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: opacity 0.3s ease-in-out;

  ${NoteTitle} {
    color: ${({ theme }) => theme.tokens.text.subheading};
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0 0 0 ${({ theme }) => theme.spacing.small};
  }
`

export const InfoTools = styled.div<FocusModeProp>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  ${Button} {
    margin: 0;
  }
  ${(props) => focusStyles(props)}
`

export const EditorPreviewStyles = styled.div`
  overflow-x: hidden;
`
interface StyledEditorProps {
  showGraph?: boolean
}

export const EditorWrapper = styled.div<{ comboboxOpen?: boolean; isUserEditing?: boolean }>`
  height: 100%;
  ${({ isUserEditing }) => ScrollStyles(isUserEditing ? 'transparent' : undefined)}
  ${({ comboboxOpen }) =>
    comboboxOpen &&
    css`
      overflow: hidden auto;
    `}
`

export const CenteredMainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: 0 ${({ theme }) => theme.spacing.medium};
  margin: calc(${({ theme }) => theme.spacing.large}) auto 0;
  width: 100%;
  max-width: 860px;
  min-width: 400px;
  height: calc(100vh - 3rem);
  flex: 1;
  overflow-y: auto;

  && > div {
    width: 100%;
  }
`

export const EditorHeader = styled.section`
  width: 100%;
`

export const StyledEditor = styled.div<StyledEditorProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: 0 ${({ theme }) => theme.spacing.medium};
  margin: calc(${({ theme }) => theme.spacing.large}) auto 0;
  width: 100%;
  max-width: 860px;
  min-width: 400px;
  flex: 1;

  && > div {
    width: 100%;
  }
`

export const EditorBreadcrumbs = styled.div<{ isVisible?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  overflow: hidden;

  opacity: 0.5;
  &:hover {
    opacity: 1;
  }

  ${({ isVisible }) => FadeInOut(isVisible, '0.5', '0.5')}
`

export const EditorStyles = styled.div<{ readOnly?: boolean }>`
  ${({ readOnly }) =>
    readOnly &&
    css`
      pointer-events: none;
    `};

  /* span[data-slate-string="true"] { */
  /*   white-space: prewrap; */
  /* } */

  /* font-family: 'Inter', sans-serif; */
  /* font-weight: 400; */
  line-height: 1.75;
  width: 100%;

  .slate-Draggable {
    > div {
      overflow: inherit;
    }
  }

  div[class^='PlateFloatingMedia'] {
    background: ${({ theme }) => theme.tokens.surfaces.modal};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    > button,
    input {
      background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    }
    > button:hover {
      background: ${({ theme }) => theme.tokens.surfaces.s[4]};
    }
  }

  color: ${({ theme }) => theme.tokens.text.default};

  b,
  strong {
    color: ${({ theme }) => theme.tokens.text.heading};
  }

  mark {
    background-color: rgba(${(props) => props.theme.rgbTokens.colors.primary.default}, 0.25);
    color: ${(props) => props.theme.tokens.text.default};
    transition: all 0.3s ease-in-out;
  }

  p,
  ol,
  ul,
  .code-block,
  table {
    margin-bottom: 1rem;
  }
  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-bottom: 0.5rem;
  }

  li,
  ul {
    p {
      margin-bottom: 0;
      padding: 0;
    }
  }

  table {
    ${({ theme }) => generateStyle(theme.editor.elements.table.wrapper)}
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
    border-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    * {
      border-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
    }
    p {
      margin: 0.25rem 0;
    }
    th {
      ${({ theme }) => generateStyle(theme.editor.elements.table.th)}
      background: ${({ theme }) => theme.tokens.surfaces.s[3]};
      border-bottom: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
    }
    td {
      background: ${({ theme }) => theme.tokens.surfaces.s[2]};
      border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
      ${({ theme }) => generateStyle(theme.editor.elements.table.td)}
    }
    tr {
      ${({ theme }) => generateStyle(theme.editor.elements.table.tr)}
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 2rem 0 1.3rem;
    line-height: 1.3;
    font-weight: 600;
    color: ${({ theme }) => theme.tokens.text.heading};
  }

  h1 {
    margin-bottom: 1.3rem;
    font-weight: 700;
    font-size: 2.488rem;
  }

  h2 {
    font-size: 2.074rem;
  }

  h3 {
    font-size: 1.728rem;
  }

  h4 {
    font-size: 1.44rem;
  }

  h5 {
    font-size: 1.2rem;
  }

  a * {
    cursor: pointer;
    color: ${({ theme }) => theme.tokens.colors.primary.default} !important;
    text-decoration: inherit;
  }

  small,
  .text_small {
    font-size: 0.833rem;
  }

  blockquote {
    ${({ theme }) => generateStyle(theme.editor.elements.blockquote)}
    border-left: 2px solid ${({ theme }) => theme.tokens.colors.primary.default};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }
  blockquote {
    :before {
      background: ${({ theme }) => theme.tokens.colors.primary.default};
    }
    p {
      margin: 0.25rem 0;
    }
  }

  p.caption {
    color: ${({ theme }) => theme.colors.text.subheading};
  }

  pre,
  pre code {
    font-family: 'JetBrains Mono', monospace;
    ${({ theme }) => generateStyle(theme.editor.elements.marks.code)}
  }
  pre {
    ${({ theme }) => generateStyle(theme.editor.elements.codeblock)}
  }

  pre,
  pre code,
  code,
  blockquote {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  hr {
    background-color: ${({ theme }) => theme.tokens.surfaces.separator};
  }

  /* Todo */

  .slate-TodoListElement {
    margin-left: ${({ theme }) => theme.spacing.tiny};
    font-size: 1rem;
    display: grid;
    grid-template-columns: 1em auto;
    gap: 0.5em;
    .slate-TodoListElement-checkboxWrapper {
      align-items: flex-start;
      margin-top: ${({ theme }) => theme.spacing.tiny};
    }
    & + & {
      margin-top: 1em;
    }
    &--disabled {
      color: var(--form-control-disabled);
      cursor: not-allowed;
    }
  }

  // TODO: Checkbox styling
  input[data-testid='TodoListElementCheckbox'],
  input[type='checkbox'] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    ${({ theme }) => generateStyle(theme.editor.elements.todo.checkbox)}
    /* Not removed via appearance */
    margin: 2px 0 0;

    font: inherit;
    color: currentColor;
    width: 0.6em;
    height: 0.6em;
    padding: 0.5em;
    border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};

    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray[8]};
      border: 1px solid ${({ theme }) => theme.colors.gray[5]};
    }

    &::before {
      content: '';
      width: 0.5em;
      height: 0.5em;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transform-origin: bottom left;
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em ${({ theme }) => theme.colors.primary};
      /* Windows High Contrast Mode */
      background-color: CanvasText;
    }
    &:checked {
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
    &:checked::before {
      transform: scale(1);
    }

    &:focus {
      outline: max(1px, 0.1em) solid ${({ theme }) => theme.colors.primary};
      outline-offset: max(1px, 0.1em);
    }

    &:disabled {
      --form-control-color: ${({ theme }) => theme.colors.text.disabled};

      color: ${({ theme }) => theme.colors.text.disabled};
      cursor: not-allowed;
    }
  }

  /* Slate Code Block */

  .slate-code_block {
    select {
      font-size: 0.8rem;
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      ${({ theme }) => generateStyle(theme.generic.form.input)}
    }
  }

  /* Forms */
  button,
  select,
  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  input[type='checkbox'],
  input[type='range'],
  input[type='radio'] {
    cursor: pointer;
  }

  input:not([type='checkbox']):not([type='radio']),
  select {
    display: block;
  }

  input,
  button,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  .slate-Popover {
    background: ${({ theme }) => theme.colors.background.highlight};
  }

  .slate-Popover .slate-Button {
    padding: inherit;
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    svg {
      margin: -7px;
      color: ${({ theme }) => theme.colors.primary};
      height: inherit;
    }
  }

  input,
  textarea {
    ${({ theme }) => generateStyle(theme.generic.form.input)}
  }

  input[type='color'] {
    min-height: 2rem;
    padding: 8px;
    cursor: pointer;
  }

  input[type='radio'] {
    height: 1em;
    width: 1em;
  }

  input[type='radio'] {
    border-radius: 100%;
  }

  input {
    vertical-align: top;
  }

  label {
    vertical-align: middle;
    margin-bottom: 4px;
    display: inline-block;
  }

  input:not([type='checkbox']):not([type='radio']),
  input[type='range'],
  select,
  button,
  textarea {
    -webkit-appearance: none;
  }

  textarea {
    display: block;
    margin-right: 0;
    box-sizing: border-box;
    resize: vertical;
  }

  textarea:not([cols]) {
    width: 100%;
  }

  textarea:not([rows]) {
    min-height: 40px;
    height: 140px;
  }

  // TODO: Add Select styles
  select {
    background: ${({ theme }) => theme.colors.form.input.bg} ${({ theme }) => theme.colors.primary} calc(100% - 12px)
      50% / 12px no-repeat;
    padding-right: 35px;
  }

  select::-ms-expand {
    display: none;
  }

  select[multiple] {
    padding-right: 10px;
    background-image: none;
    overflow-y: auto;
  }

  input[type='checkbox']:active,
  input[type='radio']:active,
  input[type='submit']:active,
  input[type='reset']:active,
  input[type='button']:active,
  input[type='range']:active,
  button:active {
    transform: translateY(2px);
  }

  input:disabled,
  select:disabled,
  button:disabled,
  textarea:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ::placeholder {
    color: ${({ theme }) => theme.tokens.text.fade};
  }

  fieldset {
    border: 1px ${({ theme }) => theme.tokens.colors.primary.default} solid;
    border-radius: 6px;
    margin: 0;
    margin-bottom: 12px;
    padding: 10px;
  }

  legend {
    font-size: 0.9em;
    font-weight: 600;
  }

  input[type='text'],
  textarea {
    border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  }

  .LinkIcon > * {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

interface MenuTriggerProps {
  selected: boolean
  readOnly: boolean
}

export const MenuTrigger = styled.div<MenuTriggerProps>`
  display: flex;
  align-items: center;
  width: max-content;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px dashed ${({ theme }) => theme.colors.form.input.border};
  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }

  ${({ readOnly, theme }) =>
    !readOnly &&
    css`
      cursor: pointer;
      &:hover {
        border-color: ${theme.colors.primary};
      }
    `}

  ${({ theme, selected }) =>
    selected &&
    css`
      border: 1px solid transparent;
      background-color: ${theme.colors.gray[8]};
      svg {
        color: ${theme.colors.primary};
      }
    `}
`

export const Widget = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.tokens.text.subheading};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.medium}`};
  width: max-content;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-right: ${({ theme }) => theme.spacing.medium};
  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
