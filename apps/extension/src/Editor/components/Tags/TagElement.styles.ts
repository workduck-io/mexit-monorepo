import styled from 'styled-components'

export const STagRoot = styled.div`
  display: inline-block;
  line-height: 1.2;

  /* outline: selectedFocused ? rgb(0, 120, 212) auto 1px : undefined, */
`

export const STag = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  .ILink_decoration {
    color: ${({ theme }) => theme.colors.text.disabled};
    &_left {
      margin-right: ${({ theme }) => theme.spacing.tiny};
    }
    &_right {
      margin-left: ${({ theme }) => theme.spacing.tiny};
    }
  }
`
