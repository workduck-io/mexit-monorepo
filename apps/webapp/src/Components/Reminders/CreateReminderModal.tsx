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
  getNameFromPath
} from '@mexit/core'
import { DatePickerStyles, Label, TextAreaBlock, SelectedDate, TextFieldHeight } from '@mexit/shared'

import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import useAnalytics from '../../Hooks/useAnalytics'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { useLinks } from '../../Hooks/useLinks'
import { useReminders } from '../../Hooks/useReminders'
import useToggleElements from '../../Hooks/useToggleElements'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useReminderStore } from '../../Stores/useReminderStore'
import { ModalHeader, ModalControls } from '../../Style/Refactor'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import Todo from '../Todo'

interface ModalValue {
  time?: number
  nodeid?: string
  todoid?: string
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
  time: undefined
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
  const openReminderModal = (query: string) => {
    const openModal = useCreateReminderModal.getState().openModal
    const node = useEditorStore.getState().node
    const addReminder = useReminderStore.getState().addReminder
    const setInfobarMode = useLayoutStore.getState().setInfobarMode
    const { toggleReminder } = useToggleElements()
    const searchTerm = query.slice('remind'.length)
    const parsed = getTimeInText(searchTerm)
    const title = getNameFromPath(node.path)
    if (parsed) {
      const reminder: Reminder = {
        id: generateReminderId(),
        nodeid: node.nodeid,
        time: parsed.time.getTime(),
        title,
        description: parsed.textWithoutTime,
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
        saveAndClearBuffer(true)
        toggleReminder()
      } else
        openModal({
          time: parsed.time.getTime(),
          nodeid: node.nodeid
        })
    } else if (!parsed && searchTerm !== '') {
      // mog('openModal Without time', { parsed, query, searchTerm })
      openModal({
        nodeid: node.nodeid,
        description: searchTerm
      })
    } else openModal({ nodeid: node.nodeid })
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
    // control,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm()

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
      setNodeId(getNodeidFromPath(newValue))
    }
  }
  const { trackEvent } = useAnalytics()

  const onSubmit = async ({ description }) => {
    // console.log({ intents, command, title, description })
    const { time, nodeid, todoid, blockContent } = modalValue

    const path = getPathFromNodeid(nodeid)
    const title = getNameFromPath(path)

    const reminder: Reminder = {
      id: generateReminderId(),
      title,
      description: !todoid ? description : undefined,
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

    // trackEvent(getEventNameFromElement('Reminders', ActionType.CREATE, 'Reminder'), {
    //   'mex-template': reminder
    // })

    mog('Creating Reminder', {
      reminder
    })
    addReminder(reminder)
    saveAndClearBuffer(true)
    reset()
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  // mog('CreateReminderModal', {
  //   modalOpen,
  //   modalValue
  // })

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={handleCancel} isOpen={modalOpen}>
      <ModalHeader>Reminder</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="node">Note</Label>
        <WrappedNodeSelect
          placeholder="Reminder for node"
          disabled={modalValue.blockContent !== undefined}
          defaultValue={useEditorStore.getState().node.id ?? ''}
          disallowReserved
          highlightWhenSelected
          iconHighlight={modalValue.nodeid !== undefined}
          handleSelectItem={handleNodeChange}
        />

        {modalValue.todoid === undefined ? (
          <>
            <Label htmlFor="description">Description </Label>
            <TextAreaBlock
              disabled={modalValue.todoid !== undefined}
              autoFocus={modalValue.description !== undefined}
              placeholder="Ex. Remember to share new developments"
              height={TextFieldHeight.MEDIUM}
              {...register('description')}
            />
          </>
        ) : (
          <>
            <Label htmlFor="task">Task </Label>
            <Todo oid="Tasks_Modal" todoid={modalValue.todoid} readOnly parentNodeId={modalValue.nodeid}>
              {modalValue.blockContent ? (
                <EditorPreviewRenderer
                  noStyle
                  content={modalValue.blockContent}
                  editorId={`NodeTodoPreview_CreateTodo_${modalValue.todoid}`}
                />
              ) : null}
            </Todo>
          </>
        )}

        <Label htmlFor="time">Time</Label>
        <DatePickerStyles>
          <ReactDatePicker
            selected={new Date(modalValue.time ?? getNextReminderTime())}
            showTimeInput
            timeFormat="p"
            timeIntervals={15}
            filterDate={(date) => {
              const todayStart = startOfToday()
              return date.getTime() >= todayStart.getTime()
            }}
            filterTime={(date) => {
              const now = Date.now()
              return date.getTime() >= now
            }}
            onChange={(date) => {
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
