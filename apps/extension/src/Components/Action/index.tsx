import React from 'react'

import { Icon } from '@iconify/react'
import styled, { css, useTheme } from 'styled-components'

import { DisplayShortcut } from '@workduck-io/mex-components'

import { CategoryType, cleanString, MexitAction, QuickLinkType } from '@mexit/core'

import { useSputlitContext } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import {
  StyledAction,
  Container,
  Content,
  Title,
  Description,
  ShortcutContainer,
  ShortcutText,
  ItemIcon,
  PrimaryText
} from './styled'

interface ActionProps {
  action: MexitAction
  active?: boolean
}

const Action: React.FC<ActionProps> = ({ action, active }) => {
  const theme = useTheme()
  const { selection } = useSputlitContext()
  const search = useSputlitStore((store) => store.search)

  const newNodeName = cleanString(search?.type === CategoryType.backlink ? search.value.slice(2) : search.value)

  return (
    <StyledAction active={active}>
      <Container>
        <ItemIcon as={Icon} color={theme.colors.primary} height={20} width={20} icon={action?.icon} />
        <Content>
          <Title>
            {action?.extras?.new ? (
              <>
                Create a <PrimaryText>{search?.value ? newNodeName : 'Quick note'}</PrimaryText>
              </>
            ) : (
              <>{action?.category === QuickLinkType.backlink ? cleanString(action?.title) : action?.title}</>
            )}
          </Title>
          {action.description && <Description>{action.description}</Description>}
        </Content>
      </Container>
      {active && action.shortcut && (
        <ShortcutContainer>
          {Object.entries(action.shortcut).map(([key, shortcut]) => {
            if (
              // TODO: removing save with metakey for now, causing issues with saveIt not having the current node post action execution
              // action.category === QuickLinkType.backlink
              true &&
              key === 'save'
            ) {
              if (!selection) return <span key={key}></span>
            }

            return (
              <ShortcutText key={shortcut.title}>
                <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
              </ShortcutText>
            )
          })}
        </ShortcutContainer>
      )}
    </StyledAction>
  )
}

export default Action
