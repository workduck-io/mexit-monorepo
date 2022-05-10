import styled, { css } from 'styled-components'

export const StyledAction = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 0.5em 0.75em;
  color: ${({ theme }) => theme.colors.text.fade};
  border-left: 2px solid transparent;
  border-radius: 10px;

  ${(props) =>
    props.active &&
    css`
       {
        /* TODO: don't know why but background.highlight is white coloured */
        background-color: ${({ theme }) => theme.colors.background.modal};
        /* border-left: 2px solid rgb(28, 28, 29); */
      }
    `}
`

export const Container = styled.div`
  display: flex;
  flex-direction: row;
`

export const ItemIcon = styled.div`
  margin-right: 0.75em;
  align-self: center;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Title = styled.h3`
  font-size: 1.1em;
  font-weight: 400;
  margin: 0;
`

export const Description = styled.p`
  font-size: 0.85em;
  margin: 0.25em 0 0.5em 0;
`

export const ShortcutContainer = styled.div`
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const ShortcutText = styled.div`
  margin-bottom: 2px;
  display: flex;
  justify-content: flex-end;

  .text {
    display: flex;
    align-items: center;
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.text.fade};
  }
`
