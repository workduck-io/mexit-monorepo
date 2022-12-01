import React from 'react'

import { DisplayShortcut } from '@workduck-io/mex-components'

import { cleanString, MexitAction, QuickLinkType } from '@mexit/core'
import { PrimaryText } from '@mexit/shared'

import { useSputlitStore } from '../../Stores/useSputlitStore'
import {
  ActionContent,
  ActionIcon,
  Container,
  Description,
  ShortcutContainer,
  ShortcutText,
  StyledAction,
  Title
} from './styled'
import { useTheme } from 'styled-components'

interface ActionProps {
  action: MexitAction
  active?: boolean
}

const Action: React.FC<ActionProps> = ({ action, active }) => {
  const theme = useTheme()

  const search = useSputlitStore((s) => s.search)
  const selection = useSputlitStore((s) => s.selection)

  const newNodeName = cleanString(search.value)

  return (
    <StyledAction $active={active}>
      <Container>
        <ActionIcon color={theme.colors.primary} height={20} width={20} icon={action?.icon} />
        <ActionContent>
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
        </ActionContent>
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
