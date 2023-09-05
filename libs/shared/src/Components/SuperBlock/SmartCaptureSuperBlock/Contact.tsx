import React, { useMemo } from 'react'

import { isExtension, useSmartCaptureStore } from '@mexit/core'

import { FadeText } from '../../../Style/fade'
import { MentionTooltipContent, TooltipAlias, Username } from '../../../Style/Mentions'
import { IconDisplay } from '../../IconDisplay'
import { DefaultMIcons, getMIcon } from '../../Icons'
import { NoteItem, NoteItemsWrapper } from '../../NotePicker/styled'

import { ContactContainer, ContactTemplateContainer, StyledContactCard } from './styled'

type ContactCardProps = {
  contact: any
  onTemplateSelect?: any
  children?: any
}

const TemplateSelector = ({ onClick }) => {
  const templates = ['Outreach', 'Lead', 'Opportunity']

  const onTemplateSelect = (template: string) => {
    if (onClick) onClick(template)
  }

  return (
    <ContactTemplateContainer>
      <NoteItemsWrapper height="fit-content" border={false}>
        {templates.map((template) => (
          <NoteItem onClick={() => onTemplateSelect(template)}>
            <IconDisplay size={16} icon={DefaultMIcons.TEMPLATE} />
            <FadeText>Save as</FadeText> {template}
          </NoteItem>
        ))}
      </NoteItemsWrapper>
    </ContactTemplateContainer>
  )
}

const Related = ({ id, onClick, children }) => {
  if (id) return <></>

  return <TemplateSelector onClick={onClick} />
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onTemplateSelect, children }) => {
  const noteId = useSmartCaptureStore((store) => store.smartCaptureCache[contact.title])
  const showOnExtension = useMemo(isExtension, [])

  if (noteId && children && showOnExtension) return React.cloneElement(children, { editorId: noteId })

  return (
    <StyledContactCard showAsBlock={false} contentEditable={false}>
      <ContactContainer>
        <IconDisplay size={96} icon={getMIcon('URL', contact?.imgUrl ?? '')} />
        <MentionTooltipContent>
          <Username>{contact?.title}</Username>
          {contact?.description && <TooltipAlias>{contact.description}</TooltipAlias>}
        </MentionTooltipContent>
      </ContactContainer>

      <Related id={noteId || !showOnExtension} onClick={onTemplateSelect}>
        {children}
      </Related>
    </StyledContactCard>
  )
}
