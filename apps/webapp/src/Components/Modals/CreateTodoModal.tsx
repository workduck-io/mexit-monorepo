import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { getPlateEditorRef, PlateProvider } from '@udecode/plate'

import { Button, DisplayShortcut, LoadingButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { ModalsType, mog, useModalStore } from '@mexit/core'

import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { ModalControls, ModalHeader } from '../../Style/Refactor'
import TaskEditor from '../CreateTodoModal/TaskEditor'
import { ScrollableModalSection, TaskEditorWrapper } from '../CreateTodoModal/TaskEditor/styled'

const CreateTodoModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.todo)
  const setOpen = useModalStore((store) => store.toggleOpen)
  const { addBlockInContent } = useUpdateBlock()
  const setModalData = useModalStore((store) => store.setData)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { appendToNode } = useApi()

  const onCreateTask = async () => {
    setIsLoading(true)
    const openedTodo = useModalStore.getState().data
    const todoBlock = getPlateEditorRef()?.children

    if (openedTodo) {
      try {
        if (todoBlock) {
          await appendToNode(openedTodo.nodeid, todoBlock)
          addBlockInContent(openedTodo.nodeid, todoBlock)
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

  useEffect(() => {
    if (!isOpen) {
      setModalData(undefined)
    }
  }, [isOpen])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (event) => {
        if (isOpen) {
          event.preventDefault()
          onCreateTask()
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [isOpen])

  if (!isOpen) return <></>

  const onRequestClose = () => {
    const todo = useModalStore.getState().data

    if (todo) {
      setModalData(undefined)
    }

    setOpen(undefined)
  }

  return (
    <Modal
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <ScrollableModalSection>
        <ModalHeader>New Task</ModalHeader>
        <NewTodoSection />
        <ModalControls>
          <Button large onClick={onRequestClose}>
            Cancel
          </Button>
          <LoadingButton
            style={{ marginLeft: '1rem' }}
            primary
            autoFocus={true}
            large
            loading={isLoading}
            onClick={onCreateTask}
            disabled={false}
          >
            Add <DisplayShortcut shortcut={'$mod+Enter'} />
          </LoadingButton>
        </ModalControls>
      </ScrollableModalSection>
    </Modal>
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
