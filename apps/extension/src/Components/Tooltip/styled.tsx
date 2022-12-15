import styled from 'styled-components'

export const StyledTooltip = styled.div<{ top: number; left: number; showTooltip: boolean }>`
  position: absolute;
  display: ${(props) => (props.showTooltip ? 'flex' : 'none')};
  margin: -3em 0 0 0;

  background: ${({ theme }) => theme.colors.background.app};
  box-shadow: 0 2px 2px 0 rgb(39 43 49 / 10%);
  padding: 0.25em;
  border: solid 1px ${({ theme }) => theme.colors.background.app};
  border-radius: 5px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;

  z-index: 1000;

  /* Done because the root is removed before the component is umounted, hence it still stays there */
  &:empty {
    padding: 0;
  }
`

export const Icon = styled.div`
  display: flex;
  align-items: center;

  cursor: pointer;
  border-radius: 5px;
  padding: 0.3em;

  svg {
    color: ${({ theme }) => theme.colors.text.fade};
  }

  &:hover {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }
`

export const ProfileImageContainer = styled.div`
  display: flex;
  border-radius: 5px;
  overflow: hidden;
`

export const NoteListWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.small};

  background: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  max-height: 50vh;
`
