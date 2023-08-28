import React, { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { tinykeys } from '@workduck-io/tinykeys'

import { mog, userPreferenceStore as useUserPreferenceStore } from '@mexit/core'

import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { FormBuilder } from '../../Types/Form'
import { formToBlocks } from '../../Utils/evalSmartCapture'
import { Dialog } from '../Floating/Dialog'
import NoteSelector from '../Floating/NoteSelector'

import { ExludedFormFields, UserPreferedFields } from './Sections'
import { StyledForm } from './styled'

interface FormProps {
  config: FormBuilder
  page: string
}

const Form: React.FC<FormProps> = ({ page, config }) => {
  const { register, handleSubmit } = useForm()
  const [data, setData] = useState<any>()
  const exludedFields = useUserPreferenceStore((s) => s.smartCaptureExcludedFields?.[page])

  const [isSaving, setIsSaving] = useState(false)
  const noteSelectorRef = useRef()
  const savingNoteRef = useRef()

  const { appendAndSave } = useSaveChanges()
  const resetSpotlitState = useSputlitStore((s) => s.reset)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (e) => {
        e.stopPropagation()
        handleSubmit(onSubmit)()
      }
    })

    return () => unsubscribe()
  }, [])

  const onSubmit: SubmitHandler<any> = (data) => {
    setData(data)
  }

  const onNodeSelect = async (nodeId: string) => {
    const formData = config
      .filter((i) => !exludedFields?.find((f) => f == i.id))
      .map((item) => ({ ...item, value: data?.[item.label] }))

    const convertToTable = useSputlitStore.getState().smartCaptureSaveType === 'tabular'

    const blocks = [
      {
        ...formToBlocks(formData, convertToTable),
        properties: {
          title: window.document.title,
          url: window.location.href
        }
      }
    ]

    try {
      if (blocks) {
        setIsSaving(true)
        appendAndSave({ nodeid: nodeId, content: blocks, saveAndExit: true, notification: true })
        resetSpotlitState()
        setIsSaving(false)
      }
    } catch (err) {
      mog('Smart Error', { err })
      setData(undefined)
      setIsSaving(false)
    }
  }

  return (
    <>
      {data && (
        <NoteSelector
          selectionMessage="Select a note to save this information"
          root={noteSelectorRef.current}
          open={data}
          onSelect={(nodeid) => {
            mog('onSelect', { nodeid })
            onNodeSelect(nodeid)
          }}
        />
      )}

      {isSaving && <Dialog root={savingNoteRef.current} open={true} render={() => 'Saving...'} />}
      <div style={{ zIndex: 30 }} id="smart-capture-saving" ref={savingNoteRef} />
      <div style={{ zIndex: 20 }} id="smart-capture" ref={noteSelectorRef} />
      <StyledForm id="wd-mex-smart-capture-form" onSubmit={handleSubmit(onSubmit)}>
        <UserPreferedFields
          page={page}
          fields={config?.filter((i) => !exludedFields?.find((f) => f == i.id))}
          register={register}
        />
        <ExludedFormFields
          page={page}
          fields={config?.filter((i) => exludedFields?.find((f) => f === i.id))}
          register={register}
        />
      </StyledForm>
    </>
  )
}

export default Form
