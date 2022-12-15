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
          background: ${theme.tokens.surfaces.modal};
          box-shadow: ${theme.tokens.shadow.large};
          border: 1px solid ${theme.tokens.surfaces.s[3]};
        `
      : css`
          padding: ${({ theme }) => theme.spacing.large};
          background: rgba(${theme.rgbTokens.surfaces.modal}, 0.5);

          border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
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
  background-color: rgba(${({ theme }) => theme.rgbTokens.colors.black}, 0.2);
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
  background: ${({ theme }) => theme.tokens.surfaces.modal};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
`

export const ModalHeader = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.tokens.text.heading};
  margin: ${({ theme: { spacing } }) => `${spacing.medium} 0`};
`

export const MockRefactorMap = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.tokens.surfaces.s[1]};
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
    color: ${({ theme }) => theme.tokens.text.fade};
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
    background: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[2]}, 0.5);
  }
  p {
    margin: 0;
    /* flex: 1; */

    &:first-child {
      color: ${({ theme }) => theme.tokens.text.fade};
    }
  }
`

export const TableIcon = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
`

export const ArrowIcon = styled(TableIcon)`
  color: ${({ theme }) => theme.tokens.text.accent};
`

export const DeleteIcon = styled(TableIcon)`
  color: ${({ theme }) => theme.tokens.colors.red};
`
export const ModalControls = styled.div`
  margin: ${({ theme: { spacing } }) => `${spacing.large} 0 ${spacing.medium}`};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
