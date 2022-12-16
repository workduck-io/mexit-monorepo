import React from 'react'
import Modal from 'react-modal'

import lodash from 'lodash'
import styled, { css } from 'styled-components'

import { DisplayShortcut } from '@workduck-io/mex-components'

import InputShortcut from '../../Components/InputShortcut'
import { useShortcutStore } from '../../Hooks/useShortcutStore'
import useShortcutTableData from '../../Hooks/useShortcutTableData'

const Shortcut = styled.div<{ highlight: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
  ${({ highlight, theme }) =>
    highlight &&
    css`
      border-radius: ${({ theme }) => theme.borderRadius.small};
      border: 0.1rem solid ${theme.tokens.colors.primary.default};
    `}
  :hover {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }
`

const ShortcutItem = styled.div<{ highlight?: boolean }>`
  ${({ theme, highlight }) =>
    highlight
      ? css`
          padding: 0.5rem;
          margin-right: 0.5rem;
          div {
            font-size: 1rem !important;
          }
        `
      : css`
          padding: 1rem;
        `}
`

export const Header = styled.div<{ colored?: boolean }>`
  color: ${({ theme }) => theme.tokens.text.default};
  padding: 1rem;
  ${({ theme, colored }) =>
    colored &&
    css`
      color: ${theme.tokens.colors.primary.default};
    `}
  font-size: x-large;
  font-weight: bold;
`

const ShortcutListContainer = styled.section`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  margin: 0rem 4rem 2rem;
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
`

const ShortcutContent = styled.div`
  padding: 0;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[1]};
  & > ${Shortcut}:nth-child(even) {
    background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[0]}, 0.75);
    border-top: 1px solid ${({ theme }) => theme.rgbTokens.surfaces.s[3]};
    :hover {
      background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
    }
  }
`

const Shortcuts = () => {
  const { data } = useShortcutTableData()
  const grouped = lodash.groupBy(data, 'category')

  const editMode = useShortcutStore((state) => state.editMode)
  const setEditMode = useShortcutStore((state) => state.setEditMode)
  const currentShortcut = useShortcutStore((state) => state.currentShortcut)
  const setCurrentShortcut = useShortcutStore((state) => state.setCurrentShortcut)

  const onRowClick = (shortcut: any) => {
    setEditMode(true)
    setCurrentShortcut(shortcut)
  }

  return (
    <>
      {Object.keys(grouped).map((key) => {
        return (
          <ShortcutListContainer key={key}>
            <Header>{key}</Header>
            <ShortcutContent>
              {grouped[key].map((shortcut) => (
                <Shortcut
                  highlight={shortcut.title === currentShortcut?.title && editMode}
                  onClick={() => onRowClick(shortcut)}
                  key={shortcut.title}
                >
                  <ShortcutItem>{shortcut.title}</ShortcutItem>
                  <ShortcutItem highlight={true}>
                    <DisplayShortcut shortcut={shortcut.keystrokes} />
                  </ShortcutItem>
                </Shortcut>
              ))}
            </ShortcutContent>
          </ShortcutListContainer>
        )
      })}
      <Modal
        className="ModalContent"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setEditMode(false)}
        isOpen={editMode}
      >
        <InputShortcut />
      </Modal>
    </>
  )
}

export default Shortcuts
