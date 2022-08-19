import React, { useMemo } from 'react'

import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'

import { Button, LoadingButton } from '@workduck-io/mex-components'

import { SearchFilter, getPathNum, mog, generateTaskViewId } from '@mexit/core'
import { TextAreaBlock, SearchFilterListCurrent, SearchFilterStyled, SearchFilterCount, Label } from '@mexit/shared'

import { useRouting, ROUTE_PATHS, NavigationType } from '../Hooks/useRouting'
import { useViewStore, useTaskViews } from '../Hooks/useTaskViews'
import { ModalHeader, ModalControls } from '../Style/Refactor'
import Input from './Input'

// Prefill modal has been added to the Tree via withRefactor from useRefactor

interface TaskViewModalState {
  open: boolean
  // If present, changes in title, description will be applied to the view with viewid
  updateViewId?: string
  // If present, title, description will be cloned from the view with viewid
  cloneViewId?: string
  filters: SearchFilter<any>[]
  openModal: (args: { filters: SearchFilter<any>[]; updateViewId?: string; cloneViewId?: string }) => void
  closeModal: () => void
}

export const useTaskViewModalStore = create<TaskViewModalState>((set) => ({
  open: false,
  filters: [],
  updateViewId: undefined,
  cloneViewId: undefined,
  openModal: ({ filters, updateViewId, cloneViewId }) =>
    set({
      open: true,
      filters,
      updateViewId,
      cloneViewId
    }),
  closeModal: () => {
    set({
      open: false,
      filters: [],
      updateViewId: undefined,
      cloneViewId: undefined
    })
  }
}))

interface TaskViewModalFormData {
  title: string
  description: string
}

const TaskViewModal = () => {
  const open = useTaskViewModalStore((store) => store.open)
  const updateViewId = useTaskViewModalStore((store) => store.updateViewId)
  const cloneViewId = useTaskViewModalStore((store) => store.cloneViewId)
  const filters = useTaskViewModalStore((store) => store.filters)

  const openModal = useTaskViewModalStore((store) => store.openModal)
  const closeModal = useTaskViewModalStore((store) => store.closeModal)

  const addView = useViewStore((store) => store.addView)
  const updateView = useViewStore((store) => store.updateView)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)

  // const { saveData } = useSaveData()

  const { getView } = useTaskViews()

  const { goTo } = useRouting()

  const {
    // control,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<TaskViewModalFormData>()

  const curView = useMemo(() => {
    if (updateViewId) {
      const updateView = getView(updateViewId)
      if (updateView) {
        // set the values of the inputs as the default value doesn't work everytime
        setValue('title', updateView.title)
        setValue('description', updateView.description)
        return updateView
      } else {
        setValue('title', '')
        setValue('description', '')
      }
    } else if (cloneViewId) {
      const cloneView = getView(cloneViewId)
      if (cloneView) {
        // set the values of the inputs as the default value doesn't work everytime
        setValue('title', getPathNum(cloneView.title))
        setValue('description', cloneView.description)
      } else {
        setValue('title', '')
        setValue('description', '')
      }
    } else {
      setValue('title', '')
      setValue('description', '')
    }
    return undefined
  }, [cloneViewId, updateViewId])

  const onSubmit = async (data: TaskViewModalFormData) => {
    mog('onSubmit', { data, filters, cloneViewId })
    if (updateViewId) {
      const oldview = { ...getView(updateViewId) }
      const newView = {
        ...oldview,
        title: data.title ?? oldview.title,
        description: data.description ?? oldview.description,
        filters
      }
      updateView(newView)
      // saveData()
      setCurrentView(newView)
      goTo(ROUTE_PATHS.tasks, NavigationType.push, newView.id)
    } else {
      const view = {
        title: data.title,
        description: data.description,
        filters: filters,
        id: generateTaskViewId()
      }
      addView(view)
      // saveData()
      setCurrentView(view)
      goTo(ROUTE_PATHS.tasks, NavigationType.push, view.id)
    }
    reset()
    closeModal()
  }

  const handleCancel = () => {
    reset()
    closeModal()
  }

  // mog('TaskViewModal', { open, curView })
  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>{updateViewId ? 'Update' : cloneViewId ? 'Clone' : 'New'} Task View</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="title"
          label="Title"
          inputProps={{
            autoFocus: true,
            defaultValue: curView !== undefined ? curView.title : '',
            ...register('title', {
              required: true
            })
          }}
          transparent={false}
        ></Input>

        <Label htmlFor="description">Description </Label>
        <TextAreaBlock
          placeholder="Ex. Bugs of development"
          defaultValue={curView !== undefined ? curView.description : ''}
          {...register('description')}
        />

        <Label htmlFor="description">Filters </Label>
        {filters?.length > 0 && (
          <SearchFilterListCurrent>
            {filters.map((f) => (
              <SearchFilterStyled selected key={`current_f_${f.id}`}>
                {f.icon ? <Icon icon={f.icon} /> : null}
                {f.label}
                {f.count && <SearchFilterCount>{f.count}</SearchFilterCount>}
              </SearchFilterStyled>
            ))}
          </SearchFilterListCurrent>
        )}

        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={filters?.length === 0}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            {updateViewId ? 'Update' : cloneViewId ? 'Clone' : 'Create'} View
          </LoadingButton>
        </ModalControls>
      </form>
    </Modal>
  )
}

export default TaskViewModal
