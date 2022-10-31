import { transparentize, mix } from 'polished'
import styled, { css } from 'styled-components'

import { TodoStatus } from '@mexit/core'

import { CompleteWave, WaterWave } from './Welcome'

export const TodoContainer = styled.div<{ checked?: boolean }>`
  display: flex;
  flex-direction: row;
  /* align-items: center; */
  position: relative;
  width: 100%;

  ${({ theme, checked }) =>
    checked &&
    css`
      color: ${theme.colors.gray[5]};
      text-decoration: line-through;
    `}
`

export const TodoActionWrapper = styled.span`
  padding: 2px;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 400;
  background-color: ${({ theme }) => transparentize(0.8, theme.colors.secondary)};
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 0.5rem;
`

export const TodoActionButton = styled.button`
  padding: 1px 0.4rem;
  display: flex;
  align-items: center;
  border-radius: 1rem;
  border: none;
  background-color: ${({ theme }) => mix(0.8, theme.colors.gray[8], theme.colors.secondary)};
  color: ${({ theme }) => theme.colors.secondary};
  :hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

export const StyledTodoStatus = styled.div<{ animate?: boolean; status: TodoStatus; disabled?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 1rem;
  width: 1rem;
  cursor: ${(props) => (props.disabled ? 'default' : 'cursor')};
  margin-right: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.text.fade};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${(props) => props.theme.colors.background.highlight};
  overflow: hidden;

  ::before {
    content: '';
    position: absolute;
    border-radius: 40%;
    background-color: ${({ theme }) => theme.colors.primary};

    ${(props) => {
      switch (props.status) {
        case TodoStatus.todo:
          return css`
            transform: translateY(1.2rem);
          `
        case TodoStatus.pending:
          return props.animate
            ? css`
                animation: ${WaterWave} 0.25s ease-out;
                animation-fill-mode: forwards;
              `
            : css`
                transform: translateY(0.6rem) rotateZ(0deg);
              `
        case TodoStatus.completed:
          return props.animate
            ? css`
                animation: ${CompleteWave} 0.25s ease-out;
              `
            : css`
                transform: translateY(0rem) rotateZ(0deg);
              `
      }
    }}

    width: 1.2rem;
    height: 1.2rem;
  }
`

export const TodoOptions = styled.span`
  position: absolute;
  right: 0;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`

export const CheckBoxWrapper = styled.span`
  display: flex;
  margin-right: 0.5rem;
  user-select: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  input {
    width: 1rem;
    height: 1rem;
    margin: 0;
  }
`

export const TodoText = styled.span`
  max-width: calc(100% - 6rem);
  flex: 1;
  :focus {
    outline: none;
  }
`
