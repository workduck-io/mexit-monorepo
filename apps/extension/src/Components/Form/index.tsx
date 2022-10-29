import React, { useRef, useState } from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'

import { mog, NodeEditorContent } from '@mexit/core'

import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { FormBuilder } from '../../Types/Form'
import { formToBlocks } from '../../Utils/getProfileData'
import NoteSelector from '../Floating/NoteSelector'
import Field from './Field'
import { StyledForm, StyledRowItem } from './styled'

interface FormProps {
  config: FormBuilder
}

const Form: React.FC<FormProps> = ({ config }) => {
  const { register, handleSubmit } = useForm()
  const [data, setData] = useState<any>()
  const noteSelectorRef = useRef()
  const { appendAndSave } = useSaveChanges()
  const resetSpotlitState = useSputlitStore((s) => s.reset)

  const onSubmit: SubmitHandler<any> = (data) => {
    setData(data)
  }

  const onNodeSelect = async (nodeId: string) => {
    const formData = config.map((item) => ({ ...item, value: data?.[item.label] }))

    const blocks = formToBlocks(formData, true) as NodeEditorContent
    // mog('Block are ready to save', { blocks })

    try {
      if (blocks) {
        appendAndSave({ nodeid: nodeId, content: blocks, saveAndExit: true, notification: true })
        resetSpotlitState()
      }
    } catch (err) {
      mog('Smart Error', { err })
      setData(undefined)
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
      <div style={{ zIndex: 20 }} id="smart-capture" ref={noteSelectorRef} />
      <StyledForm id="wd-mex-smart-capture-form" onSubmit={handleSubmit(onSubmit)}>
        {config.map((item) => {
          return (
            <StyledRowItem>
              <label>{item.label}</label>
              <Field item={item} register={register} />
            </StyledRowItem>
          )
        })}
      </StyledForm>
    </>
  )
}

export default Form
