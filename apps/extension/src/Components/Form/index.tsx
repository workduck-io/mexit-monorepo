import { mog, NodeEditorContent } from '@mexit/core'
import { FlexBetween } from '@mexit/shared'
import { MexIcon } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'
import React, { useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components'

import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { FormBuilder } from '../../Types/Form'
import { formToBlocks } from '../../Utils/evalSmartCapture'
import { Title } from '../Action/styled'
import { Dialog } from '../Floating/Dialog'
import NoteSelector from '../Floating/NoteSelector'
import { Controls } from '../Renderers/Screenshot/Screenshot.style'
import Field from './Field'
import { ExcludeFormFieldsContainer, StyledForm, StyledRowItem, UserPreferedFieldsContainer } from './styled'

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

    const blocks = formToBlocks(formData, convertToTable) as NodeEditorContent

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
          fields={config.filter((i) => !exludedFields?.find((f) => f == i.id))}
          register={register}
        />
        <ExludedFormFields
          page={page}
          fields={config.filter((i) => exludedFields?.find((f) => f === i.id))}
          register={register}
        />
      </StyledForm>
    </>
  )
}

const ExludedFormFields = ({ page, register, fields }) => {
  const removeFromExcludedFields = useUserPreferenceStore((s) => s.removeExcludedSmartCaptureField)
  const theme = useTheme()

  const onRemoveField = (id: string) => {
    removeFromExcludedFields(page, id)
  }

  if (fields?.length > 0)
    return (
      <ExcludeFormFieldsContainer>
        <Controls>
          <MexIcon icon="ph:textbox-fill" height={20} width={20} color={theme.colors.primary} />
          <Title>Additional Fields</Title>
        </Controls>
        {fields.map((field) => {
          return (
            <StyledRowItem>
              <FlexBetween>
                <label>{field.label}</label>
                <MexIcon icon="akar-icons:plus" onClick={() => onRemoveField(field.id)} />
              </FlexBetween>
              <Field item={field} register={register} />
            </StyledRowItem>
          )
        })}
      </ExcludeFormFieldsContainer>
    )
}

const UserPreferedFields = ({ page, fields, register }) => {
  const excludeFieldFromForm = useUserPreferenceStore((s) => s.excludeSmartCaptureField)

  const onAddField = (id: string) => {
    excludeFieldFromForm(page, id)
  }

  return (
    <UserPreferedFieldsContainer>
      {fields.map((field) => {
        return (
          <StyledRowItem>
            <FlexBetween>
              <label>{field.label}</label>
              <MexIcon icon="clarity:window-close-line" onClick={() => onAddField(field.id)} />
            </FlexBetween>
            <Field item={field} register={register} />
          </StyledRowItem>
        )
      })}
    </UserPreferedFieldsContainer>
  )
}

export default Form
