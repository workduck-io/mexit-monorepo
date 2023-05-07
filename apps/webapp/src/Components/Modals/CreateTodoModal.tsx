import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { getPlateEditorRef, PlateProvider } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { getDefaultContent, ModalsType, mog, useModalStore } from '@mexit/core'
import { DefaultMIcons, IconDisplay, InsertMenu, PrimaryText } from '@mexit/shared'

import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { ModalControls } from '../../Style/Refactor'
import TaskEditor from '../CreateTodoModal/TaskEditor'
import { ScrollableModalSection, TaskEditorWrapper } from '../CreateTodoModal/TaskEditor/styled'
import { Group } from '../Editor/Banner/styled'
import Editor from '../Editor/Editor'

import { DeletionWarning, Header, Title } from './DeleteSpaceModal/styled'

const CreateTodoModal = ({ children }) => {
  const isOpen = useModalStore((store) => store.open === ModalsType.todo)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const data = useModalStore((store) => store.data)
  const { addBlockInContent } = useUpdateBlock()
  const setModalData = useModalStore((store) => store.setData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { createNewNote } = useCreateNewNote()
  const { appendToNode } = useApi()
  const theme = useTheme()
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>()

  const onCreateTask = async () => {
    setIsLoading(true)
    const openedTodo = useModalStore.getState().data
    const todoBlock = getPlateEditorRef()?.children

    if (openedTodo) {
      try {
        if (todoBlock) {
          const noteId = selectedNoteId || openedTodo.nodeid
          await appendToNode(noteId, todoBlock)
          addBlockInContent(noteId, todoBlock)
          toast('Task created!')
        }
      } catch (err) {
        toast('Error occured while creating Task')
        mog('Error occured while creating Task', { err })
      } finally {
        setIsLoading(false)
        setOpen(undefined)
      }
    }
  }

  const onCreateContent = async () => {
    setIsLoading(true)

    const content = getPlateEditorRef()?.children
    try {
      if (content) {
        const noteId = selectedNoteId || ''
        if (selectedNoteId) {
          await appendToNode(noteId, content)
          addBlockInContent(noteId, content)
        } else {
          createNewNote({
            noteContent: content,
            noRedirect: true
          })
        }
        toast('Added Content!')
      }
    } catch (err) {
      toast('Error occured while creating Task')
      mog('Error occured while creating Task', { err })
    } finally {
      setIsLoading(false)
      setOpen(undefined)
    }
  }

  const handleCreate = () => {
    if (data?.type === 'content') {
      onCreateContent()
    } else {
      onCreateTask()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setModalData(undefined)
      setSelectedNoteId(null)
    }
  }, [isOpen])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (event) => {
        if (isOpen) {
          event.preventDefault()
          handleCreate()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [isOpen, selectedNoteId])

  if (!isOpen) return <></>

  const onRequestClose = () => {
    const todo = useModalStore.getState().data

    if (todo) {
      setModalData(undefined)
    }

    setOpen(undefined)
  }

  const isContent = data?.type === 'content'
  const description = !isContent
    ? 'By default, new Task is added to Daily Tasks. You can select a different type of note from the menu if you prefer.'
    : 'By default, new Content is saved as Drafts. You can select a different type of note from the menu if you prefer.'

  return (
    <Modal
      shouldFocusAfterRender
      shouldCloseOnEsc={false}
      shouldReturnFocusAfterClose
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <ScrollableModalSection id="menu-wrapper">
        <Header>
          <Group>
            <Title>
              Add a new&nbsp;
              <Group>
                <IconDisplay
                  icon={isContent ? DefaultMIcons.TEXT : DefaultMIcons.TASK}
                  size={28}
                  color={theme.tokens.colors.primary.default}
                />{' '}
                <PrimaryText>{isContent ? 'Content' : 'Task'}</PrimaryText>
              </Group>{' '}
              ?
            </Title>
          </Group>
        </Header>
        <DeletionWarning>
          <Group>
            <span>{description}</span>
            <InsertMenu
              type="modal"
              title="Select Note"
              selected={selectedNoteId}
              isMenu
              onClick={(noteId: string) => {
                setSelectedNoteId(noteId)
              }}
            />
          </Group>
        </DeletionWarning>
        <ErrorBoundary FallbackComponent={() => <></>}>{children}</ErrorBoundary>

        <ModalControls>
          <Button large onClick={onRequestClose}>
            Cancel
          </Button>
          <LoadingButton
            style={{ marginLeft: '1rem' }}
            primary
            large
            loading={isLoading}
            onClick={handleCreate}
            disabled={false}
          >
            Add <DisplayShortcut shortcut={'$mod+Enter'} />
          </LoadingButton>
        </ModalControls>
      </ScrollableModalSection>
    </Modal>
  )
}

export const CreateNewSection = () => {
  const data = useModalStore((store) => store.data)

  switch (data?.type) {
    case 'content':
      return <NewContentSection />
    default:
      return <NewTodoSection />
  }
}

const NewContentSection = () => {
  const content = [getDefaultContent()]

  return (
    <TaskEditorWrapper withMaxHeight>
      <PlateProvider id="NODE_EDITOR">
        <Editor includeBlockInfo={false} content={content} nodeUID="NODE_EDITOR" />
      </PlateProvider>
    </TaskEditorWrapper>
  )
}

const NewTodoSection = () => {
  const todo = useModalStore((store) => store.data)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onEditorChange = (val) => {}

  if (!todo) return <></>

  const todoEditorId = `${todo.nodeid}_task_${todo.id}`

  return (
    <TaskEditorWrapper>
      <PlateProvider id={todoEditorId}>
        <TaskEditor editorId={todoEditorId} content={todo?.content} onChange={onEditorChange} />
      </PlateProvider>
    </TaskEditorWrapper>
  )
}

export default CreateTodoModal
