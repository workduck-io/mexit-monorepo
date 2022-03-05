import styled from 'styled-components'

export const StyledResults = styled.div`
  flex: 1;
`

export const List = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;

  max-height: 400px;
`

export const ListItem = styled.div<{ start: number }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(${(props) => props.start}px);
  width: 100%;
  cursor: pointer;
`

export const Subtitle = styled.div`
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  opacity: 0.5;
`
