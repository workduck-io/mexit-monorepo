import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { usePlateEditorRef, selectEditor } from '@udecode/plate'
import shallow from 'zustand/shallow'
import tinykeys from 'tinykeys'

import { defaultContent, mog } from '@mexit/core'

import { useEditorBuffer } from '../../Hooks/useEditorBuffer'
import Editor from './Editor'
import useBlockStore from '../../Stores/useBlockStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import useLoad from '../../Hooks/useLoad'

import EditorInfoBar from '../EditorInfobar'
import useLayout from '../../Hooks/useLayout'
import { getEditorId } from '../../Utils/editor'
import { StyledEditor, EditorWrapper } from '@mexit/shared'

import Toolbar from './Toolbar'
import Metadata from '../EditorInfobar/Metadata'
import BlockInfoBar from '../EditorInfobar/BlockInfobar'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useLayoutStore } from '../../Stores/useLayoutStore'

const ContentEditor = () => {
  const { nodeId } = useParams()

  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const setIsEditing = useEditorStore((store) => store.setIsEditing)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate, loadNode } = useLoad()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const { setShowLoader } = useLayoutStore()

  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useEditorBuffer()
  const { node, fsContent } = useEditorStore(
    (state) => ({ nodeid: state.node.nodeid, node: state.node, fsContent: state.content }),
    shallow
  )

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode()
        })
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          const node = useEditorStore.getState().node
          const val = getBufferVal(node.nodeid)
          saveApiAndUpdate(node, val)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const editorId = useMemo(() => getEditorId(node.nodeid, false), [node, fetchingContent])
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  const readOnly = !!fetchingContent

  const onChangeSave = async (val: any[]) => {
    if (val && node && node.nodeid !== '__null__') {
      setIsEditing(false)
      addOrUpdateValBuffer(node.nodeid, val)
    }
  }

  useEffect(() => {
    if (node.nodeid !== nodeId) {
      setShowLoader(true)
      // Had to add a loader because useLoad didn't work due to store hydration taking so much time
      // TODO: see how to navigate around this issue
      setTimeout(() => {
        loadNode(nodeId, { savePrev: false, fetch: false })
        setShowLoader(false)
      }, 3000)
    }
  }, [])

  useEffect(() => {
    return () => saveAndClearBuffer()
  }, [])

  return (
    <StyledEditor showGraph={false} className="mex_editor">
      <Toolbar />

      <EditorInfoBar />
      {isBlockMode ? <BlockInfoBar /> : <Metadata node={node} />}

      <EditorWrapper onClick={onFocusClick}>
        <Editor
          readOnly={readOnly}
          nodeUID={nodeId}
          nodePath={node.path}
          onAutoSave={(val) => {
            saveAndClearBuffer()
          }}
          content={fsContent?.content?.length ? fsContent?.content : defaultContent.content}
          onChange={onChangeSave}
        />
      </EditorWrapper>
    </StyledEditor>
  )
}

export default ContentEditor
