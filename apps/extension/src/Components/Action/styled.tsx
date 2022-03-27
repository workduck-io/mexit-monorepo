import styled, { css } from 'styled-components'

export const StyledAction = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 0.5rem 0.75rem;
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

export const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;

  img {
    height: 24px;
    aspect-ratio: 1/1;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
`

export const Description = styled.div`
  font-size: 0.85rem;
  margin: 0.25rem 0 0.5rem 0;
`

export const Shortcut = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem;
`

export const Key = styled.div`
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 0.25rem;
  padding: 0.25rem;
`
