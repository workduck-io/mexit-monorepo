import { rgba, transparentize } from 'polished'
import styled, { css } from 'styled-components'

const ModalContent = (multi = false) => css`
  width: max-content;
  height: max-content;
  margin: auto;
  overflow: visible;
  outline: none;
  min-width: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  ${({ theme }) =>
    !multi
      ? css`
          padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
          background: ${theme.colors.background.card};
          box-shadow: 0px 20px 100px ${transparentize(0.75, theme.colors.primary)};
          border: 1px solid ${theme.colors.gray[8]};
        `
      : css`
          padding: ${({ theme }) => theme.spacing.large};
          background: ${transparentize(0.5, theme.colors.background.card)};
          border: 1px solid ${({ theme }) => theme.colors.gray[8]};
          display: flex;
          flex-direction: column;
          gap: ${({ theme }) => theme.spacing.large};
          max-height: 90vh;
          overflow-y: auto;
        `}
`

const ModalOverlay = css`
  position: fixed;
  inset: 0px;
  display: flex;
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: ${({ theme }) => rgba(theme.colors.palette.black, 0.5)};
`

export const ModalStyles = css`
  .ModalContent {
    ${ModalContent()}
  }
  .ModalOverlay {
    ${ModalOverlay}
  }
  .ModalContentSplit {
    ${ModalContent(true)}
  }
`

export const ModalSectionScroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 300px;
`

export const ModalSection = styled.div`
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};
`

export const ModalHeader = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.heading};
  margin: ${({ theme: { spacing } }) => `${spacing.medium} 0`};
`

export const MockRefactorMap = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[10])};
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: ${({ theme: { spacing } }) => `${spacing.large} 0`};
  max-height: 300px;
  overflow-y: auto;
`

export const MRMHead = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.gray[4]};
    font-weight: 700;
    margin: 0;
    /* flex: 1; */
  }
  p {
    margin: 0;
  }
`

export const MRMRow = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small}`};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  &:nth-child(2n) {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  }
  p {
    margin: 0;
    /* flex: 1; */

    &:first-child {
      color: ${({ theme }) => theme.colors.text.fade};
    }
  }
`

export const TableIcon = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
`

export const ArrowIcon = styled(TableIcon)`
  color: ${({ theme }) => theme.colors.text.accent};
`

export const DeleteIcon = styled(TableIcon)`
  color: ${({ theme }) => theme.colors.palette.red};
`
export const ModalControls = styled.div`
  margin: ${({ theme: { spacing } }) => `${spacing.large} 0 ${spacing.medium}`};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
