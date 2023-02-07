import 'react-contexify/dist/ReactContexify.css'

import { useMemo } from 'react'

import { TreeItem } from '@atlaskit/tree'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import magicLine from '@iconify/icons-ri/magic-line'
import shareLine from '@iconify/icons-ri/share-line'
import volumeDownLine from '@iconify/icons-ri/volume-down-line'
import volumeMuteLine from '@iconify/icons-ri/volume-mute-line'
import { Icon } from '@iconify/react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

import { getMIcon, LastOpenedState } from '@mexit/shared'

import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { useLastOpened } from '../../Hooks/useLastOpened'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRefactor } from '../../Hooks/useRefactor'
import { useRouting } from '../../Hooks/useRouting'
import { useDataStore } from '../../Stores/useDataStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useMetadataStore } from '../../Stores/useMetadataStore'
import { useShareModalStore } from '../../Stores/useShareModalStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '../../Style/contextMenu'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { doesLinkRemain } from '../Refactor/doesLinkRemain'

import ContextMenuListWithFilter from './ContextMenuListWithFilter'

interface MuteMenuItemProps {
  nodeid: string
  lastOpenedState: LastOpenedState
}

export const MuteMenuItem = ({ nodeid, lastOpenedState }: MuteMenuItemProps) => {
  const { muteNode, unmuteNode } = useLastOpened()

  const isMuted = useMemo(() => {
    return lastOpenedState === LastOpenedState.MUTED
  }, [lastOpenedState])

  const handleMute = () => {
    // mog('handleMute', { item })
    if (isMuted) {
      unmuteNode(nodeid)
    } else {
      muteNode(nodeid)
    }
  }

  return (
    <ContextMenuItem
      onSelect={(args) => {
        handleMute()
      }}
    >
      <Icon icon={isMuted ? volumeDownLine : volumeMuteLine} />
      {isMuted ? 'Unmute' : 'Mute'}
    </ContextMenuItem>
  )
}

interface TreeContextMenuProps {
  item: TreeItem
}

export const useTreeContextItems = () => {
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)
  const { goTo } = useRouting()
  const namespaces = useDataStore((store) => store.namespaces)
  const { getNamespaceIcon } = useNamespaces()

  const { execRefactorAsync } = useRefactor()
  const { push } = useNavigation()

  const itemNamespace = namespaces.find((ns) => ns.id === item.data?.namespace)

  const noteMetadata = useMetadataStore((store) => store.metadata.notes)
  const hasTemplate = useMemo(() => {
    const metadata = noteMetadata[item.data.nodeid]

    const snippets = useSnippetStore.getState().snippets ?? {}
    const templates = Object.values(snippets).filter((item) => item?.template && item.id === metadata?.templateID)

    return templates.length !== 0
  }, [item.data.nodeid, noteMetadata])

  const isInSharedNamespace = itemNamespace?.granterID !== undefined
  const isReadonly = itemNamespace?.access === 'READ'

  const handleArchive = (item: TreeItem) => {
    openDeleteModal({ path: item.data.path, namespaceID: item.data.namespace })
  }

  // BUG: The backend doesn't return the new added path in the selected namespace
  const handleMoveNamespaces = async (newNamespaceID: string) => {
    console.log(`Item: ${JSON.stringify(item)}`)
    const refactored = await execRefactorAsync(
      { path: item.data?.path, namespaceID: item.data?.namespace },
      { path: item.data?.path, namespaceID: newNamespaceID }
    )

    if (doesLinkRemain(item.data?.nodeid, refactored)) {
      push(item.data?.nodeid, { savePrev: false })
    }
  }

  return {
    getTreeItems: () => {
      return [
        {
          id: 'create-new-child',
          label: 'New Note',
          disabled: isInSharedNamespace && isReadonly,
          icon: addCircleLine,
          onSelect: () => {
            const item = useLayoutStore.getState().contextMenu?.item
            handleCreateChild(item)
          }
        },
        {
          id: 'set-template-for-child',
          label: hasTemplate ? 'Change Template' : 'Set Template',
          disabled: isInSharedNamespace && isReadonly,
          icon: magicLine,
          onSelect: () => {
            const item = useLayoutStore.getState().contextMenu?.item
            handleTemplate(item)
          }
        },
        {
          id: 'create-new-child',
          label: hasTemplate ? 'Change Template' : 'Set Template',
          disabled: isInSharedNamespace && isReadonly,
          icon: magicLine,
          onSelect: () => {
            const item = useLayoutStore.getState().contextMenu?.item
            handleTemplate(item)
          }
        },
        {
          id: 'share-note',
          label: 'Share',
          disabled: isInSharedNamespace && isReadonly,
          icon: shareLine,
          onSelect: () => {
            const item = useLayoutStore.getState().contextMenu?.item
            handleShare(item)
          }
        },
        {
          id: 'archive-note',
          label: 'Archive',
          disabled: isInSharedNamespace && itemNamespace?.access === 'READ',
          icon: archiveLine,
          onSelect: () => {
            const item = useLayoutStore.getState().contextMenu?.item
            handleArchive(item)
          }
        }
      ]
    }
  }

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuContent>
        <ContextMenuListWithFilter
          disabled={isInSharedNamespace}
          item={{
            id: 'menu_for_namespace',
            label: 'Move to Space',
            icon: getMIcon('ICON', 'ri:file-transfer-line')
          }}
          items={namespaces
            // Don't move in same namespace
            // And don't move to spaces that are not of the user
            .filter((ns) => ns.id !== item.data.namespace && !ns.granterID)
            .map((ns) => ({
              id: ns.id,
              icon: getNamespaceIcon(ns),
              disabled: isInSharedNamespace,
              label: ns.name
            }))}
          onSelectItem={(args) => {
            handleMoveNamespaces(args)
          }}
          filter={false}
        />
        <ContextMenuSeparator />
        <MuteMenuItem nodeid={item.data.nodeid} lastOpenedState={item.data.lastOpenedState} />
        <ContextMenuItem
          color="#df7777"
          disabled={isInSharedNamespace && itemNamespace?.access === 'READ'}
          onSelect={(args) => {
            handleArchive(item)
          }}
        >
          <Icon icon={archiveLine} />
          Archive
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPrimitive.Portal>
  )
}
