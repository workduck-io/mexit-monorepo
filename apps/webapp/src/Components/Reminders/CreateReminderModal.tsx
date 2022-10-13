import React, { useEffect } from 'react'

import { startOfToday } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import create from 'zustand'

import { LoadingButton, Button } from '@workduck-io/mex-components'

import {
  NodeEditorContent,
  getTimeInText,
  getNextReminderTime,
  mog,
  getRelativeDate,
  generateReminderId,
  Reminder,
  getNameFromPath,
  ReminderAssociatedType
} from '@mexit/core'
import { DatePickerStyles, Label, TextAreaBlock, SelectedDate, TextFieldHeight, Input } from '@mexit/shared'

import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { useLinks } from '../../Hooks/useLinks'
import { useReminders } from '../../Hooks/useReminders'
import { useEditorStore } from '../../Stores/useEditorStore'
import { ModalHeader, ModalControls } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import Todo from '../Todo'

interface ModalValue {
  associated?: ReminderAssociatedType
  time?: number
  nodeid?: string
  todoid?: string
  title: string
  description?: string
  blockContent?: NodeEditorContent
}

interface CreateReminderModalState {
  open: boolean
  focus: boolean

  modalValue: ModalValue
  toggleModal: () => void
  openModal: (modalValue?: ModalValue) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
  setModalValue: (modalValue: ModalValue) => void
  setTime: (time: number) => void
  setNodeId: (nodeid: string) => void
}

export const initModal = {
  todoid: undefined,
  blockContent: undefined,
  description: undefined,
  nodeid: undefined,
  time: undefined,
  title: undefined,
  associated: undefined
}

export const useCreateReminderModal = create<CreateReminderModalState>((set) => ({
  open: false,
  focus: false,
  modalValue: initModal,

  toggleModal: () => {
    set((state) => ({ open: !state.open }))
  },
  openModal: (modalValue) => {
    if (modalValue) {
      set((state) => ({
        ...state,
        modalValue: modalValue,
        open: true
      }))
    } else {
      set((state) => ({
        ...state,
        modalValue: initModal,
        open: true
      }))
    }
  },
  setFocus: (focus) => {
    set({ focus })
  },
  closeModal: () => {
    set({
      open: false,
      modalValue: initModal
    })
  },
  setNodeId: (nodeid) => {
    set((state) => ({
      modalValue: { ...state.modalValue, nodeid }
    }))
  },
  setTime: (time) => {
    set((state) => ({
      modalValue: { ...state.modalValue, time }
    }))
  },
  setModalValue: (modalValue) => {
    set({ modalValue })
  }
}))

export const useOpenReminderModal = () => {
  const { saveAndClearBuffer } = useEditorBuffer()
  const { addReminder } = useReminders()

  const openReminderModal = (query: string, associated: ReminderAssociatedType) => {
    const openModal = useCreateReminderModal.getState().openModal
    const node = useEditorStore.getState().node
    const searchTerm = query.slice(6) // 6 because 'remind'.length
    const parsed = getTimeInText(searchTerm)
    const noteName = getNameFromPath(node.path)
    if (parsed) {
      const reminder: Reminder = {
        id: generateReminderId(),
        associated,
        nodeid: node.nodeid,
        time: parsed.time.getTime(),
        title: parsed.textWithoutTime,
        // description: noteName,
        state: {
          done: false,
          snooze: false
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      // mog('openReminderModal has time', { parsed, query, reminder })
      if (parsed.textWithoutTime !== '') {
        addReminder(reminder)
        toast(`Reminder added for ${parsed.textWithoutTime}`)
        setTimeout(() => {
          saveAndClearBuffer(true)
        }, 500)
      } else
        openModal({
          title: parsed.textWithoutTime,
          associated,
          // description: noteName,
          time: parsed.time.getTime(),
          nodeid: node.nodeid
        })
    } else if (!parsed && searchTerm !== '') {
      // mog('openModal Without time', { parsed, query, searchTerm })
      openModal({
        title: searchTerm,
        associated,
        nodeid: node.nodeid
        // description: noteName
      })
    } else
      openModal({
        title: noteName,
        associated,
        // description: noteName,
        nodeid: node.nodeid
      })
    // const text = parsed ? ` ${toLocaleString(parsed.time)}: ${parsed.textWithoutTime}` : undefined
  }
  return { openReminderModal }
}

const CreateReminderModal = () => {
  const modalOpen = useCreateReminderModal((state) => state.open)
  const closeModal = useCreateReminderModal((state) => state.closeModal)
  const modalValue = useCreateReminderModal((state) => state.modalValue)
  const setTime = useCreateReminderModal((state) => state.setTime)
  const setNodeId = useCreateReminderModal((state) => state.setNodeId)
  const node = useEditorStore((state) => state.node)
  const { saveAndClearBuffer } = useEditorBuffer()
  const { addReminder } = useReminders()

  const { getNodeidFromPath, getPathFromNodeid } = useLinks()

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<{ title: string; description: string }>()

  useEffect(() => {
    if (modalValue.time === undefined) setTime(getNextReminderTime().getTime())
  }, [node, modalOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (modalValue.description !== undefined) setValue('description', modalValue.description)
    else setValue('description', '')
  }, [modalOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNodeChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      // mog('newValue', { newValue, quickLink })
      setNodeId(getNodeidFromPath(newValue, quickLink.namespace))
    }
  }
  const onSubmit = async ({ title, description }) => {
    // console.log({ intents, command, title, description })
    const { time, nodeid, todoid } = modalValue

    const reminder: Reminder = {
      id: generateReminderId(),
      associated: todoid ? 'todo' : 'node',
      title,
      description,
      nodeid,
      time,
      state: {
        snooze: false,
        done: false
      },
      todoid,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    mog('Creating Reminder', {
      reminder
    })
    const res = await addReminder(reminder)
    mog('Created Reminder', { reminder, res })
    saveAndClearBuffer(true)
    reset()
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={handleCancel} isOpen={modalOpen}>
      <ModalHeader>Reminder</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="Associated">For</Label>
        {modalValue.associated === 'todo' ? (
          <Todo oid="Tasks_Modal" todoid={modalValue.todoid} readOnly parentNodeId={modalValue.nodeid}>
            {modalValue.blockContent ? (
              <EditorPreviewRenderer
                noStyle
                content={modalValue.blockContent}
                editorId={`NodeTodoPreview_CreateTodo_${modalValue.todoid}`}
              />
            ) : null}
          </Todo>
        ) : modalValue.associated === 'node' ? (
          <WrappedNodeSelect
            placeholder="Reminder for Note"
            disabled={modalValue.blockContent !== undefined}
            defaultValue={
              useEditorStore.getState().node && {
                path: useEditorStore.getState().node.path,
                namespace: useEditorStore.getState().node.namespace
              }
            }
            disallowReserved
            highlightWhenSelected
            iconHighlight={modalValue.nodeid !== undefined}
            handleSelectItem={handleNodeChange}
          />
        ) : (
          <div>TODO: This will be used to show url/aka links</div>
        )}

        <Label htmlFor="title">Title</Label>
        <Input
          autoFocus={modalValue.title !== undefined}
          placeholder="Ex. Remember to share new developments"
          height={TextFieldHeight.MEDIUM}
          {...register('title')}
        />

        <Label htmlFor="description">Description </Label>
        <TextAreaBlock
          autoFocus={modalValue.description !== undefined}
          placeholder="Ex. Remember to share new developments with whom and when??"
          height={TextFieldHeight.MEDIUM}
          {...register('description')}
        />

        <Label htmlFor="time">Time</Label>
        <DatePickerStyles>
          <ReactDatePicker
            selected={new Date(modalValue.time ?? getNextReminderTime())}
            showTimeInput
            timeFormat="p"
            timeIntervals={15}
            filterDate={(date: Date) => {
              const todayStart = startOfToday()
              return date.getTime() >= todayStart.getTime()
            }}
            filterTime={(date: Date) => {
              const now = Date.now()
              return date.getTime() >= now
            }}
            onChange={(date: Date) => {
              setTime(date.getTime())
            }}
            inline
          />
          {modalValue.time && modalValue.time > Date.now() ? (
            <SelectedDate>
              <i>Remind :</i>
              <span>{getRelativeDate(new Date(modalValue.time))}</span>
            </SelectedDate>
          ) : (
            <SelectedDate>
              <span>Please select a time in the future. </span>
              <i>(Unless you have a time machine.)</i>
            </SelectedDate>
          )}
        </DatePickerStyles>

        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={!modalValue.time || modalValue.time < Date.now()}
            type="submit"
            primary
            large
          >
            Save Reminder
          </LoadingButton>
        </ModalControls>
      </form>
    </Modal>
  )
}

export default CreateReminderModal
