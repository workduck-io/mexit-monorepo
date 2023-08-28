import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import styled from 'styled-components'

import { generateTempId, mog, SmartCaptureAction, SuperBlocks, userPreferenceStore } from '@mexit/core'
import { PropertiyFields, SmartCaptureSuperBlock } from '@mexit/shared'

import { useActionExecutor } from '../../Hooks/useActionExecutor'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { ExludedFormFields, UserPreferedFields } from '../Form/Sections'
import { StyledForm } from '../Form/styled'

type CaptureDataType = { source: string; page: string; data: Array<any> }

const ContactFormWrapper = styled(StyledForm)`
  font-size: 14px;
`

const ContactForm = ({ page, config }) => {
  const { register, handleSubmit } = useForm()
  const exludedFields = userPreferenceStore((s) => s.smartCaptureExcludedFields?.[page])

  const onSubmit = (data) => {
    //
  }

  return (
    <ContactFormWrapper id="wd-mex-smart-capture-form" onSubmit={handleSubmit(onSubmit)}>
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
    </ContactFormWrapper>
  )
}

const ProfileSmartCapture = () => {
  const [smartCaptureBlock, setSmartCaptureBlock] = useState<any>(null)
  const data: CaptureDataType = useSputlitStore((store) => store.smartCaptureFormData)

  useEffect(() => {
    if (data)
      setSmartCaptureBlock({
        id: generateTempId(),
        type: SuperBlocks.CAPTURE,
        properties: {
          tags: [
            {
              value: data.page,
              count: 1
            }
          ],
          title: data.data?.[1]?.value,
          url: data.source
        },
        metadata: {
          createdAt: Date.now()
        }
      })
  }, [data])

  const handleOnChange = (properties: Partial<PropertiyFields>) => {
    setSmartCaptureBlock((block) => ({
      ...block,
      properties: {
        ...block.properties,
        ...properties
      }
    }))
  }

  mog('DATA IS', { p: data?.data })

  if (smartCaptureBlock && data)
    return (
      <SmartCaptureSuperBlock
        id={smartCaptureBlock.id}
        type={SuperBlocks.CAPTURE}
        isActive
        isSelected
        onChange={handleOnChange}
        metadata={smartCaptureBlock.metadata ?? {}}
        value={smartCaptureBlock.properties ?? {}}
      >
        <ContactForm page={data.page} config={data.data} />
      </SmartCaptureSuperBlock>
    )
}

const iframeContactExtractor = () => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = `${window.location.href}overlay/contact-info/`
  iframe.id = 'contact-info'

  const container = document.getElementById('mexit') as any
  container.appendChild(iframe)

  iframe.onload = () => {
    const containerDocument = iframe.contentDocument
    mog('Contact Info', { d: containerDocument?.getElementById('artdeco-modal-outlet')?.innerText })
    container.removeChild(iframe)
  }
}

const removeAttributeFromElement = () => {
  const bodyElement = document.querySelector('body')
  bodyElement.classList.remove('artdeco-modal-is-open')
}

const hideContactModal = () => {
  const modalElement = document.getElementById('artdeco-modal-outlet')
  modalElement.style.display = 'none'

  return modalElement
}

const getLinkedinContact = () => {
  const contactModal = hideContactModal()
  const contactLink = document.getElementById('top-card-text-details-contact-info')

  if (contactLink) {
    contactLink.click()
    const contactInfo = contactModal.innerText
    removeAttributeFromElement()
  }
}

export const SmartCaptureSection = () => {
  const { execute } = useActionExecutor()
  const capturedProfile = useSputlitStore((store) => store.captureProfile)

  useEffect(() => {
    // TODO: Add event listener to capture profile
    execute(SmartCaptureAction)
    iframeContactExtractor()
  }, [capturedProfile])

  return (
    // <SidebarSection label=" Contact" icon={DefaultMIcons.PEOPLE}>
    <ProfileSmartCapture />
    // </SidebarSection>
  )
}
