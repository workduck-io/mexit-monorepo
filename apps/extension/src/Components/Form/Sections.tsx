import { useTheme } from 'styled-components'

import { userPreferenceStore as useUserPreferenceStore } from '@mexit/core'
import { Center, FlexBetween, getMIcon, IconDisplay, MexIcon } from '@mexit/shared'

import { Title } from '../Action/styled'
import { Controls } from '../Renderers/Screenshot/Screenshot.style'

import Field from './Field'
import { ExcludeFormFieldsContainer, StyledRowItem, UserPreferedFieldsContainer } from './styled'

export const ExludedFormFields = ({ page, register, fields }) => {
  const removeFromExcludedFields = useUserPreferenceStore((s) => s.removeExcludedSmartCaptureField)
  const theme = useTheme()

  const onRemoveField = (id: string) => {
    removeFromExcludedFields(page, id)
  }

  if (fields?.length > 0)
    return (
      <ExcludeFormFieldsContainer>
        <Controls>
          <MexIcon icon="ph:textbox-fill" height={20} width={20} color={theme.tokens.colors.primary.default} />
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

export const UserPreferedFields = ({ page, fields, register }) => {
  const excludeFieldFromForm = useUserPreferenceStore((s) => s.excludeSmartCaptureField)

  const onAddField = (id: string) => {
    excludeFieldFromForm(page, id)
  }

  return (
    <UserPreferedFieldsContainer>
      {fields.map((field) => {
        return (
          <StyledRowItem>
            {field.properties.type === 'img' ? (
              <Center>
                <IconDisplay css={{ borderRadius: '50%' }} icon={getMIcon('URL', field.value)} size={64} />
              </Center>
            ) : (
              <>
                <FlexBetween>
                  <label>{field.label}</label>
                  <MexIcon icon="clarity:window-close-line" onClick={() => onAddField(field.id)} />
                </FlexBetween>
                <Field item={field} register={register} />
              </>
            )}
          </StyledRowItem>
        )
      })}
    </UserPreferedFieldsContainer>
  )
}
