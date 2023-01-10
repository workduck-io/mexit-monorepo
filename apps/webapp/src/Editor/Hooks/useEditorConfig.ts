import { useMemo } from 'react'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TAG,
  getMIcon,
  mog,
  PromptRenderType,
  SEPARATOR
} from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import { useOpenReminderModal } from '../../Components/Reminders/CreateReminderModal'
import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useMentions } from '../../Hooks/useMentions'
import usePrompts from '../../Hooks/usePrompts'
import { useRouting } from '../../Hooks/useRouting'
import { useSnippets } from '../../Hooks/useSnippets'
import { useViewStore } from '../../Hooks/useTaskViews'
import { useAuthStore } from '../../Stores/useAuth'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { QuickLinkComboboxItem } from '../Components/QuickLink/QuickLinkComboboxItem'
import { SlashComboboxItem } from '../Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from '../Components/Tags/TagComboboxItem'
import { CategoryType, QuickLinkType } from '../constants'
import { PluginOptionType } from '../Plugins'
import { ComboboxKey } from '../Types/Combobox'
import { ComboboxConfig, ComboboxType, ComboConfigData } from '../Types/MultiCombobox'
import { getNodeIdFromEditor } from '../Utils/helper'

export const useEditorPluginConfig = (editorId: string, options?: PluginOptionType): ComboboxConfig => {
  const tags = useDataStore((store) => store.tags)
  const addTag = useDataStore((store) => store.addTag)

  const ilinks = useDataStore((store) => store.ilinks)
  const nodeUID = getNodeIdFromEditor(editorId)
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
  const { allPrompts } = usePrompts()

  const { createNewNote } = useCreateNewNote()

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

  const internals: any[] = [
    ...ilinksForCurrentNode.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? DefaultMIcons,
      type: QuickLinkType.backlink
    })),
    ...allPrompts.map((prompt) => ({
      value: prompt.entityId,
      text: prompt.title,
      icon: DefaultMIcons.PROMPT,
      type: QuickLinkType.prompts
    })),
    ...sharedNodes.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? DefaultMIcons.SHARED_NOTE,
      type: QuickLinkType.backlink
    })),
    ...views.map((l) => ({
      value: l.id,
      text: l.title,
      icon: { type: 'ICON', value: 'ri:share-line' },
      type: QuickLinkType.taskView
    })),
    ...slashInternals.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type }))
  ]

  const mentions = useMemo(() => {
    const icon = getMIcon('ICON', 'ri:user-line')
    return userDetails
      ? [
          {
            value: userDetails.userID,
            text: `${userDetails.alias} (you)`,
            icon,
            type: QuickLinkType.mentions
          },
          ...mentionable
            .filter((m) => m.alias !== undefined)
            .filter((m) => m.userID !== userDetails.userID)
            .map((m) => ({
              value: m.userID,
              text: m.alias,
              icon,
              type: QuickLinkType.mentions
            })),
          ...invitedUsers.map((m) => ({
            value: m.alias,
            text: m.alias,
            icon,
            type: QuickLinkType.mentions,
            additional: { email: m.email }
          }))
        ]
      : []
  }, [mentionable, invitedUsers, userDetails])

  const onKeyDownConfig: ComboConfigData = {
    keys: {
      inline_block: {
        slateElementType: ELEMENT_INLINE_BLOCK,
        newItemHandler: (newItem, openedNoteId?) => {
          const openedNode = useDataStore.getState().ilinks.find((l) => l.nodeid === openedNoteId)
          const link = addILink({ ilink: newItem, openedNodePath: openedNode?.path, namespace: openedNode?.namespace })
          return link.nodeid
        },
        renderElement: QuickLinkComboboxItem
      },
      prompts: {
        slateElementType: PromptRenderType,
        newItemHandler: () => undefined,
        renderElement: SlashComboboxItem
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
        newItemHandler: (path, openedNoteId?) => {
          const openedNode = useDataStore.getState().ilinks.find((l) => l.nodeid === openedNoteId)
          mog('new item here is', { path, openedNoteId, openedNode })
          const note = createNewNote({
            path: path.startsWith(SEPARATOR) ? `${openedNode?.path}${path}` : path,
            parent: path.startsWith(SEPARATOR)
              ? {
                  path: openedNode?.path,
                  namespace: openedNode?.namespace
                }
              : undefined,
            noRedirect: true,
            namespace: openedNode?.namespace
          })
          return note?.nodeid
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
              prefillShareModal('invite', 'note', { alias: newAlias, fromEditor: true })
              return newAlias
            },
            renderElement: TagComboboxItem
          }
        : undefined
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (path, openedNoteId?) => {
          const openedNode = useDataStore.getState().ilinks.find((l) => l.nodeid === openedNoteId)
          mog('new item here is', { path, openedNoteId, openedNode })
          const note = createNewNote({
            path: path.startsWith(SEPARATOR) ? `${openedNode?.path}${path}` : path,
            parent: path.startsWith(SEPARATOR)
              ? {
                  path: openedNode?.path,
                  namespace: openedNode?.namespace
                }
              : undefined,
            noRedirect: true,
            namespace: openedNode?.namespace
          })
          return note?.nodeid
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
      ...(!nodeUID?.startsWith('SNIPPET_') && {
        remind: {
          slateElementType: ELEMENT_PARAGRAPH,
          command: 'remind',
          onExtendedCommand: (newValue, editor) => {
            openReminderModal(newValue, 'node')
          }
        }
      })
    }
  }

  let onChangeConfig: Record<string, ComboboxType> = {
    internal: {
      cbKey: ComboboxKey.INTERNAL,
      trigger: '[[',
      blockTrigger: ':',
      data: internals,
      icon: DefaultMIcons.NOTE
    },
    tag: {
      cbKey: ComboboxKey.TAG,
      trigger: '#',
      data: tags.map((t) => ({ ...t, text: t.value, type: CategoryType.tag })),
      icon: getMIcon('ICON', 'ri:hashtag')
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: getMIcon('ICON', 'ri:flask-line'),
      data: slashCommands.default
        .map((l) => ({ ...l, value: l.command, type: CategoryType.action, text: l.text }))
        .filter((item) => {
          if (nodeUID?.startsWith('SNIPPET_') && item.command === 'remind') {
            return false
          }
          return true
        })
    }
  }

  onChangeConfig = options?.exclude?.mentions
    ? onChangeConfig
    : {
        ...onChangeConfig,
        mention: {
          cbKey: ComboboxKey.MENTION,
          trigger: '@',
          data: mentions,
          icon: getMIcon('ICON', 'ri:at-line')
        }
      }

  return {
    onChangeConfig,
    onKeyDownConfig
  }
}
