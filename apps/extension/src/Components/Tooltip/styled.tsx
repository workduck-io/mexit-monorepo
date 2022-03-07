import styled from 'styled-components'

export const StyledTooltip = styled.div<{ top: number; left: number; showTooltip: boolean }>`
  position: absolute;
  display: ${(props) => (props.showTooltip ? 'flex' : 'none')};
  margin: -3rem 0 0 0;

  background: ${({ theme }) => theme.colors.background.app};
  box-shadow: 0 2px 2px 0 rgb(39 43 49 / 10%);
  padding: 0.25rem;
  border: solid 1px ${({ theme }) => theme.colors.background.app};
  border-radius: 5px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;

  /* Done because the root is removed before the component is umounted, hence it still stays there */
  &:empty {
    padding: 0;
  }
`

export const Icon = styled.div`
  cursor: pointer;
  border-radius: 5px;
  padding: 0.3rem;

  svg {
    color: ${({ theme }) => theme.colors.text.fade};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.modal};
  }
`
