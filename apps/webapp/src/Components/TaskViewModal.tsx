import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'

import create from 'zustand'

import { Button, LoadingButton } from '@workduck-io/mex-components'
import { Entities } from '@workduck-io/mex-search'

import {
  Filter,
  generateTaskViewId,
  getPathNum,
  GlobalFilterJoin,
  SortOrder,
  SortType,
  View,
  ViewType
} from '@mexit/core'
import { Label, SearchFilterListCurrent, TextAreaBlock } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useViews } from '../Hooks/useViews'
import { ModalControls, ModalHeader } from '../Style/Refactor'

import { DisplayFilter } from './Filters/Filter'
import Input from './Input'

interface ViewProperties {
  globalJoin: GlobalFilterJoin
  viewType?: ViewType
  sortOrder?: SortOrder

  // * View v2 properties
  sortType?: SortType
  entities?: Array<Entities>
  groupBy?: string
}

interface TaskViewModalState {
  open: boolean
  // If present, changes in title, description will be applied to the view with viewid
  updateViewId?: string
  // If present, title, description will be cloned from the view with viewid
  cloneViewId?: string
  filters: Filter[]
  properties?: ViewProperties

  openModal: (args: {
    filters: Filter[]
    updateViewId?: string
    cloneViewId?: string
    properties: ViewProperties
  }) => void

  closeModal: () => void
}

const getInitialState = () => ({
  open: false,
  filters: [],
  updateViewId: undefined,
  cloneViewId: undefined,
  properties: {
    globalJoin: 'all' as GlobalFilterJoin,
    viewType: ViewType.List,
    sortOrder: 'ascending' as SortOrder
  }
})

export const useTaskViewModalStore = create<TaskViewModalState>((set) => {
  return {
    ...getInitialState(),
    openModal: (args) => set({ ...args, open: true }),
    closeModal: () => {
      set({ ...getInitialState() })
    }
  }
})

interface TaskViewModalFormData {
  title: string
  description: string
}

const TaskViewModal = () => {
  const open = useTaskViewModalStore((store) => store.open)
  const updateViewId = useTaskViewModalStore((store) => store.updateViewId)
  const cloneViewId = useTaskViewModalStore((store) => store.cloneViewId)
  const filters = useTaskViewModalStore((store) => store.filters)

  const closeModal = useTaskViewModalStore((store) => store.closeModal)

  const { getView, addView, updateView } = useViews()

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
    // Loads up the values of the current View to prefill the inputs
    // Current view is the view to be changed
    //
    // updateViewId loads the view to update
    // cloneViewId loads the view to clone with modified title
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
    const properties = useTaskViewModalStore.getState().properties

    if (updateViewId) {
      const oldview = getView(updateViewId)

      const newView = {
        ...oldview,
        ...properties,
        title: data.title ?? oldview.title,
        description: data.description ?? oldview.description,
        filters
      }
      await updateView(newView)
      goTo(ROUTE_PATHS.view, NavigationType.push, newView.id)
    } else {
      const view: View = {
        title: data.title,
        description: data.description,
        filters,
        id: generateTaskViewId(),
        ...properties
      }
      await addView(view)
      // saveData()
      goTo(ROUTE_PATHS.view, NavigationType.push, view.id)
    }
    handleClose()
  }

  const handleClose = () => {
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
        />

        <Label htmlFor="description">Description </Label>
        <TextAreaBlock
          placeholder="Ex. Bugs of development"
          defaultValue={curView !== undefined ? curView.description : ''}
          {...register('description')}
        />

        {filters?.length > 0 && (
          <>
            <Label htmlFor="description">Filters </Label>
            <SearchFilterListCurrent>
              {filters.map((f, i) => {
                return <DisplayFilter key={f.id} filter={f} hideJoin={i === filters.length - 1} />
              })}
            </SearchFilterListCurrent>
          </>
        )}

        <ModalControls>
          <Button large onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} type="submit" primary large>
            {updateViewId ? 'Update' : cloneViewId ? 'Clone' : 'Create'} View
          </LoadingButton>
        </ModalControls>
      </form>
    </Modal>
  )
}

export default TaskViewModal
