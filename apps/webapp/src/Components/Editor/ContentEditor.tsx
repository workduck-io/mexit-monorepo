import { useCallback, useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import { focusEditor, getPlateEditorRef, selectEditor } from '@udecode/plate'

import { tinykeys } from '@workduck-io/tinykeys'

import {
  getContent,
  useBlockStore,
  useBufferStore,
  useContentStore,
  useDataStore,
  useEditorStore,
  useFloatingStore,
  useHelpStore,
  useLayoutStore,
  useModalStore
} from '@mexit/core'
import { EditorWrapper, isOnEditableElement, useReactions } from '@mexit/shared'

import { useComboboxOpen } from '../../Editor/Hooks/useComboboxOpen'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useKeyListener } from '../../Hooks/useChangeShortcutListener'
import { useComments } from '../../Hooks/useComments'
import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { useLastOpened } from '../../Hooks/useLastOpened'
import useLayout from '../../Hooks/useLayout'
import useLoad from '../../Hooks/useLoad'
import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import { useAnalysisTodoAutoUpdate } from '../../Stores/useAnalysis'
import { areEqual } from '../../Utils/hash'

import Editor from './Editor'

const ContentEditor = () => {
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)
  const { accessWhenShared } = usePermissions()
  const { getAllCommentsOfNode } = useComments()
  const { getAllReactionsOfNode } = useReactions()

  const { getDataAPI } = useApi()
  const isComboOpen = useComboboxOpen()
  const _hasHydrated = useDataStore((state) => state._hasHydrated)

  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const { debouncedAddLastOpened } = useLastOpened()

  const { addOrUpdateValBuffer, getBufferVal, saveAndClearBuffer } = useEditorBuffer()
  const nodeid = useParams()?.nodeId
  const fsContent = useContentStore((state) => state.contents)[nodeid]
  const { shortcutHandler } = useKeyListener()
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const setInternalUpdate = useContentStore((store) => store.setInternalUpdate)

  const returnLastUpdatedContentOnError = (noteId: string, content: any) => {
    if (Array.isArray(content) && content.length !== 0) return content
    return useBufferStore.getState().buffer?.[noteId]
  }

  const nodeContent = useMemo(() => {
    const internalUpdate = useContentStore.getState().internalUpdate

    if (!internalUpdate) {
      return returnLastUpdatedContentOnError(nodeid, fsContent?.content)
    } else {
      setInternalUpdate(false)
      const fromContent = useContentStore.getState().contents[nodeid]?.content
      return returnLastUpdatedContentOnError(nodeid, fromContent)
    }
  }, [nodeid, fsContent])

  const onChangeSave = useCallback(
    async (val: any[]) => {
      if (val && nodeid !== '__null__') {
        addOrUpdateValBuffer(nodeid, val)
        debouncedAddLastOpened(nodeid)
      }
    },
    [nodeid]
  )

  const onAutoSave = useCallback((val) => {
    saveAndClearBuffer(false)
  }, [])

  useEffect(() => {
    return () => {
      const isBlockMode = useBlockStore.getState().isBlockMode
      if (isBlockMode) setIsBlockMode(true)
      saveAndClearBuffer(false)
    }
  }, [])

  const onFocusClick = () => {
    const editorRef = getPlateEditorRef()
    if (editorRef) {
      if (editorWrapperRef.current) {
        selectEditor(editorRef, { focus: true, edge: 'end' })
      }
    }
  }

  useAnalysisTodoAutoUpdate()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode()
        })
      },
      Enter: (event) => {
        if (
          !isOnEditableElement(event) &&
          !useModalStore.getState().open &&
          !useLayoutStore.getState().contextMenu &&
          !useFloatingStore.getState().floatingElement
        ) {
          event.preventDefault()
          const editorRef = getPlateEditorRef(nodeid) ?? getPlateEditorRef()
          focusEditor(editorRef)
        }
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()

        shortcutHandler(shortcuts.refreshNode, () => {
          const node = useEditorStore.getState().node
          const val = getBufferVal(node.nodeid)
          const content = getContent(node.nodeid)
          const res = areEqual(content.content, val)

          if (!res) {
            saveApiAndUpdate(node, val)
          } else {
            // * If buffer hasn't changed, refresh the note
            getDataAPI(node.nodeid, false, true)
            getAllCommentsOfNode(node.nodeid)
            getAllReactionsOfNode(node.nodeid)
          }
        })
      },
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          saveAndClearBuffer()
          toast('Saved!')
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const viewOnly = useMemo(() => {
    const access = accessWhenShared(nodeid)
    return isReadonly(access)
  }, [nodeid, _hasHydrated])

  return (
    <EditorWrapper comboboxOpen={isComboOpen} isUserEditing={isUserEditing} ref={editorWrapperRef}>
      <Editor
        onAutoSave={onAutoSave}
        onFocusClick={onFocusClick}
        includeBlockInfo={true}
        onChange={onChangeSave}
        content={nodeContent}
        nodeUID={nodeid}
        readOnly={viewOnly}
        withHover={false}
        autoFocus={false}
      />
    </EditorWrapper>
  )
}

export default ContentEditor
