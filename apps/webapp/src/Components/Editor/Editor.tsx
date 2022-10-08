import React, { useEffect, useMemo, useState } from 'react'

import { ELEMENT_MEDIA_EMBED, ELEMENT_TABLE } from '@udecode/plate'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_MENTION,
  ELEMENT_TAG,
  mog,
  NodeEditorContent,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI
} from '@mexit/core'
import { useEditorChange, EditorStyles } from '@mexit/shared'

import components from '../../Editor/Components/EditorPreviewComponents'
import { QuickLinkComboboxItem } from '../../Editor/Components/QuickLink/QuickLinkComboboxItem'
import { SlashComboboxItem } from '../../Editor/Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from '../../Editor/Components/Tags/TagComboboxItem'
import MexEditor, { MexEditorOptions } from '../../Editor/MexEditor'
import { ComboboxKey } from '../../Editor/Types/Combobox'
import { ComboboxConfig, ComboboxItem, ComboboxType, ComboConfigData } from '../../Editor/Types/MultiCombobox'
import { CategoryType, QuickLinkType } from '../../Editor/constants'
import { useMentions } from '../../Hooks/useMentions'
import { useNewNodes } from '../../Hooks/useNewNodes'
import { useRouting } from '../../Hooks/useRouting'
import { useSnippets } from '../../Hooks/useSnippets'
import { useViewStore } from '../../Hooks/useTaskViews'
import { useAuthStore } from '../../Stores/useAuth'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { useOpenReminderModal } from '../Reminders/CreateReminderModal'
import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'
import { useFocusBlock } from '../../Stores/useFocusBlock'

const EditorWrapper = styled(EditorStyles)`
  flex: 1;
  max-width: 800px;
  margin: 1rem;
  padding: 1rem;
`

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  focusBlockId?: string // * Block to focus
  onChange?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  autoFocus?: boolean
  options?: any
  onAutoSave?: (content: NodeEditorContent) => void
}

const Editor: React.FC<EditorProps> = ({
  nodeUID,
  nodePath,
  content,
  readOnly,
  onChange,
  focusBlockId,
  autoFocus,
  onAutoSave,
  options
}) => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)
  const ilinks = useDataStore((store) => store.ilinks)
  const addILink = useDataStore((store) => store.addILink)
  const slashCommands = useDataStore((store) => store.slashCommands)
  const { openReminderModal } = useOpenReminderModal()
  const { getSnippetConfigs } = useSnippets()
  const snippetConfigs = getSnippetConfigs()
  const { params, location } = useRouting()
  const mentionable = useMentionStore((state) => state.mentionable)
  const invitedUsers = useMentionStore((state) => state.invitedUsers)
  const prefillShareModal = useShareModalStore((state) => state.prefillModal)
  const { grantUserAccessOnMention } = useMentions()
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const userDetails = useAuthStore((state) => state.userDetails)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const views = useViewStore((state) => state.views)

  const { focusBlock } = useFocusBlock()


  const ilinksForCurrentNode = useMemo(() => {
    if (params.snippetid) return ilinks

    return ilinks.filter((item) => item.nodeid !== nodeUID)
  }, [nodeUID, ilinks])

  const slashInternals = useMemo(() => {
    const snippetName = (location?.state as any)?.title
    if (params.snippetid && snippetName) {
      return slashCommands.internal.filter((item) => snippetName !== item.text)
    }

    return slashCommands.internal
  }, [slashCommands.internal])

  const { addNodeOrNodesFast } = useNewNodes()

  const internals: any[] = [
    ...ilinksForCurrentNode.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? 'ri:file-list-2-line',
      type: QuickLinkType.backlink
    })),
    ...sharedNodes.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? 'ri:share-line',
      type: QuickLinkType.backlink
    })),
    ...views.map((l) => ({
      value: l.id,
      text: l.title,
      icon: 'ri:stack-line',
      type: QuickLinkType.taskView
    })),
    ...slashInternals.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type }))
  ]

  const mentions = useMemo(
    () =>
      userDetails
        ? [
          {
            value: userDetails.userID,
            text: `${userDetails.alias} (you)`,
            icon: 'ri:user-line',
            type: QuickLinkType.mentions
          },
          ...mentionable
            .filter((m) => m.alias !== undefined)
            .filter((m) => m.userID !== userDetails.userID)
            .map((m) => ({
              value: m.userID,
              text: m.alias,
              icon: 'ri:user-line',
              type: QuickLinkType.mentions
            })),
          ...invitedUsers.map((m) => ({
            value: m.alias,
            text: m.alias,
            icon: 'ri:user-line',
            type: QuickLinkType.mentions,
            additional: { email: m.email }
          }))
        ]
        : [],
    [mentionable, invitedUsers, userDetails]
  )

  const comboOnKeyDownConfig: ComboConfigData = {
    keys: {
      inline_block: {
        slateElementType: ELEMENT_INLINE_BLOCK,
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, openedNodePath: parentId })
          return link.nodeid
        },
        renderElement: QuickLinkComboboxItem
      },
      tag: {
        slateElementType: ELEMENT_TAG,
        newItemHandler: (newItem) => {
          addTag(newItem)
          return newItem
        },
        renderElement: TagComboboxItem
      },
      slash_command: {
        slateElementType: 'slash_command',
        newItemHandler: () => undefined,
        renderElement: SlashComboboxItem
      },
      internal: {
        slateElementType: 'internal',
        newItemHandler: (newItem, parentId?) => {
          const { id } = addNodeOrNodesFast(newItem, true, parentId)
          return id
        },
        renderElement: SlashComboboxItem
      },
      mention: !options?.exclude?.mentions
        ? {
          slateElementType: ELEMENT_MENTION,
          onItemInsert: (alias) => {
            mog('Inserted new item', { alias })
            grantUserAccessOnMention(alias, nodeid)
          },
          newItemHandler: (newAlias) => {
            prefillShareModal('invite', { alias: newAlias, fromEditor: true })
            return newAlias
          },
          renderElement: TagComboboxItem
        }
        : undefined
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (newItem, parentId?) => {
          const { id } = addNodeOrNodesFast(newItem, true, parentId)
          return id
        },
        renderElement: QuickLinkComboboxItem
      },
      commands: {
        ...snippetConfigs
      }
    },
    slashCommands: {
      webem: {
        slateElementType: ELEMENT_MEDIA_EMBED,
        command: 'webem',
        options: {
          url: 'https://example.com/'
        }
      },
      table: {
        slateElementType: ELEMENT_TABLE,
        command: 'table'
      },
      ...(!nodeUID.startsWith('SNIPPET_') && {
        remind: {
          slateElementType: ELEMENT_PARAGRAPH,
          command: 'remind',
          onExtendedCommand: (newValue, editor) => {
            openReminderModal(newValue)
          }
        }
      })
    }
  }

  let comboOnChangeConfig: Record<string, ComboboxType> = {
    internal: {
      cbKey: ComboboxKey.INTERNAL,
      trigger: '[[',
      blockTrigger: ':',
      data: internals,
      icon: 'ri:file-list-2-line'
    },
    tag: {
      cbKey: ComboboxKey.TAG,
      trigger: '#',
      data: tags.map((t) => ({ ...t, text: t.value })),
      icon: 'ri:hashtag'
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: 'ri:flask-line',
      data: slashCommands.default
        .map((l) => ({ ...l, value: l.command, type: CategoryType.action, text: l.text }))
        .filter((item) => {
          if (nodeUID.startsWith('SNIPPET_') && item.command === 'remind') {
            return false
          }
          return true
        })
    }
  }

  useEffect(() => {
    if (focusBlockId) {
      focusBlock(focusBlockId, nodeUID)
    }
  }, [focusBlockId, nodeUID])

  comboOnChangeConfig = options?.exclude?.mentions
    ? comboOnChangeConfig
    : {
      ...comboOnChangeConfig,
      mention: {
        cbKey: ComboboxKey.MENTION,
        trigger: '@',
        data: mentions,
        icon: 'ri:at-line'
      }
    }

  useEditorChange(nodeUID, content)

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly,
      // placeholder: "Let's try something here...",
      autoFocus: options?.editableProps?.autoFocus ?? true
    },
    focusOptions: options?.focusOptions ?? {
      edge: 'start',
      focus: true
    },
    withDraggable: false,
    withBalloonToolbar: true
  }

  const onDelayPerform = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 400)

  const saveAfterDelay = useDebouncedCallback(
    typeof onAutoSave === 'function' ? onAutoSave : () => undefined,
    30 * 1000 // After 30 seconds
  )

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)

    if (onAutoSave) {
      saveAfterDelay.cancel()
      saveAfterDelay(val)
    }
  }

  const comboboxConfig: ComboboxConfig = {
    onChangeConfig: comboOnChangeConfig,
    onKeyDownConfig: comboOnKeyDownConfig
  }

  return (
    <EditorWrapper>
      <MexEditor
        comboboxConfig={comboboxConfig}
        components={components}
        meta={{
          path: nodePath
        }}
        BalloonMarkToolbarButtons={<BallonMarkToolbarButtons />}
        // debug
        onChange={onChangeContent}
        options={editorOptions}
        editorId={nodeUID}
        value={content}
      />
    </EditorWrapper>
  )
}

export default Editor
