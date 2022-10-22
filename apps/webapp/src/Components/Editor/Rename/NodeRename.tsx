import React, { useEffect, useMemo, useRef, useState } from 'react'

import Tippy from '@tippyjs/react'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import toast from 'react-hot-toast'

import { tinykeys } from '@workduck-io/tinykeys'

import { SEPARATOR, isClash, isMatch, isReserved, getNameFromPath, getParentFromPath, mog } from '@mexit/core'
import { Input, isOnEditableElement } from '@mexit/shared'

import { useKeyListener } from '../../../Hooks/useChangeShortcutListener'
import { useNamespaces } from '../../../Hooks/useNamespaces'
import { useNavigation } from '../../../Hooks/useNavigation'
import { useNodes } from '../../../Hooks/useNodes'
import { usePermissions } from '../../../Hooks/usePermissions'
import { useRefactor } from '../../../Hooks/useRefactor'
import { useAnalysisStore } from '../../../Stores/useAnalysis'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { useHelpStore } from '../../../Stores/useHelpStore'
import { useRenameStore } from '../../../Stores/useRenameStore'
import { doesLinkRemain } from '../../Refactor/doesLinkRemain'
import { Wrapper, TitleStatic } from './NodeRename.style'

const NodeRenameOnlyTitle = () => {
  const { execRefactorAsync, getMockRefactor } = useRefactor()
  const { accessWhenShared } = usePermissions()

  const to = useRenameStore((store) => store.to)
  const ilinks = useDataStore((store) => store.ilinks)
  const nodeTitle = useAnalysisStore((state) => state.analysis.title)

  const { push } = useNavigation()
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const node = useEditorStore((store) => store.node)

  const { path: nodeFrom, namespace: nodeFromNS } = useMemo(() => {
    const noteLink = ilinks.find((i) => i.nodeid === node?.nodeid)
    if (noteLink) return noteLink
    return node
  }, [ilinks, node])

  const { getNodesOfNamespace } = useNamespaces()
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  const [newTitle, setNewTitle] = useState(getNameFromPath(nodeFrom))
  const inpRef = useRef<HTMLInputElement>()
  const { updateBaseNode } = useNodes()

  const reset = () => {
    if (editable) modalReset()
    setEditable(false)
    setNewTitle(getNameFromPath(nodeFrom))
  }

  const getTo = (title: string) => {
    const nFrom = useEditorStore.getState().node.path
    const parent = getParentFromPath(nFrom)
    if (parent) return `${parent}${SEPARATOR}${title}`
    else return title
  }

  const isClashed = useMemo(() => {
    const checkClash = isClash(
      getTo(newTitle),
      getNodesOfNamespace(nodeFromNS)?.map((l) => l.path)
    )
    return checkClash
  }, [ilinks, newTitle, nodeFromNS])

  const { shortcutHandler } = useKeyListener()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        if (!isOnEditableElement(event)) {
          event.preventDefault()

          // TODO: Fix the shortcut handler (not working after the shortcut is renamed)
          shortcutHandler(shortcuts.showRename, () => {
            setEditable(true)
            mog('RENAME', { inpRef })
            inpRef.current?.focus()
          })
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const to = getTo(newTitle)

      if (isMatch(to, nodeFrom)) {
        toast('Note itself cannot be used')
        return
      }

      // if (e.shiftKey) {
      //   // mog('Opening refactor')

      //   prefillRefactorModal(nodeFrom, to)
      // } else {
      // mog('Renaming')
      onRename()
      // }
    } else if (e.key === 'Escape') reset()
  }

  const handleTitleChange = (e) => {
    // console.log({ parent })
    if (e.target.value) {
      // if (parent) setNewTitle(`${parent}${SEPARATOR}${e.target.value}`)
      setNewTitle(e.target.value)
    }
  }

  const onRenameClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    onRename()
  }

  const onRename = async () => {
    // console.log('renaming', {})
    if (newTitle === getNameFromPath(nodeFrom) || isClashed || newTitle.indexOf(SEPARATOR) !== -1) {
      reset()
      return
    }

    const parent = getParentFromPath(nodeFrom)

    if (newTitle && nodeFrom) {
      let newPath = newTitle
      if (parent) newPath = `${parent}${SEPARATOR}${newTitle}`
      setFrom({ path: nodeFrom, namespaceID: nodeFromNS })

      const refactored = await execRefactorAsync(
        { path: nodeFrom, namespaceID: nodeFromNS },
        { path: newPath, namespaceID: nodeFromNS }
      )

      updateBaseNode()

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      setEditable(false)

      if (doesLinkRemain(nodeid, refactored)) {
        push(nodeid)
      } else if (refactored.length > 0) {
        const nodeid = refactored[0].nodeid
        push(nodeid, { savePrev: false })
      }
      reset()

      const editorRef = getPlateEditorRef()
      if (editorRef) {
        selectEditor(editorRef, { edge: 'start', focus: true })
      }
    }
  }

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    reset()
  }

  // useEffect(() => {
  //   if (nodeFrom && isReserved(nodeFrom)) {
  //     mog('ISRESERVED', { nodeFrom })
  //   }
  // }, [nodeFrom])

  useEffect(() => {
    if (newTitle && editable) {
      // mog('RenameInput', { id: useEditorStore.getState().node.id, to })
      if (newTitle === getNameFromPath(nodeFrom)) return
      setMockRefactored(getMockRefactor(useEditorStore.getState().node.id, getTo(newTitle), true, false))
    }
  }, [nodeFrom, newTitle, editable])

  useEffect(() => {
    reset()
  }, [nodeFrom])

  const isInputReadonly = useMemo(() => {
    if (nodeFrom) {
      if (isReserved(nodeFrom)) return true
      const access = accessWhenShared(node.nodeid)
      // Is editable only when: access on space is write or above
      if (access) {
        if (access.space) return access.space === 'READ'
        return access.note !== undefined
      }
    }
    return true
  }, [node, nodeFrom])

  return (
    <Wrapper>
      {isInputReadonly ? (
        <Tippy theme="mex" placement="bottom-start" content={`Title ${getNameFromPath(nodeFrom)}`}>
          <TitleStatic>{nodeTitle?.length > 0 ? getNameFromPath(nodeTitle) : getNameFromPath(nodeFrom)}</TitleStatic>
        </Tippy>
      ) : editable ? (
        <Input
          key={`NodeRenameTitleSelect_${nodeFrom}_${to}`}
          name="NodeRenameTitleSelect"
          onKeyDown={handleSubmit}
          onChange={(e) => handleTitleChange(e)}
          onBlur={() => reset()}
          error={(getNameFromPath(nodeFrom) !== newTitle && isClashed) || newTitle.indexOf(SEPARATOR) !== -1}
          autoFocus
          defaultValue={newTitle}
          ref={inpRef}
        />
      ) : (
        <Tippy theme="mex" placement="bottom-start" content="Click to Rename">
          <TitleStatic
            onClick={(e) => {
              e.preventDefault()
              setEditable(true)
            }}
          >
            {getNameFromPath(nodeTitle?.length > 0 ? nodeTitle : nodeFrom)}
          </TitleStatic>
        </Tippy>
      )}
    </Wrapper>
  )
}

export default NodeRenameOnlyTitle
