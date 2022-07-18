import { SEPARATOR, isClash, isReserved } from '@mexit/core'
import { getNameFromPath, Input, Button, getParentFromPath } from '@mexit/shared'
import Tippy from '@tippyjs/react'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import tinykeys from 'tinykeys'
import { useLinks } from '../../../Hooks/useLinks'
import { useApi } from '../../../Hooks/API/useNodeAPI'
import { useNavigation } from '../../../Hooks/useNavigation'
import { useRefactor } from '../../../Hooks/useRefactor'
import { useAnalysisStore } from '../../../Stores/useAnalysis'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { useHelpStore } from '../../../Stores/useHelpStore'
import { useRefactorStore } from '../../../Stores/useRefactorStore'
import { useRenameStore } from '../../../Stores/useRenameStore'
import { doesLinkRemain } from '../../Refactor/doesLinkRemain'
import { DisplayShortcut } from '../../Shortcuts'
import { Wrapper, TitleStatic, ButtonWrapper } from './NodeRename.style'
import { useInternalLinks } from '../../../Hooks/useInternalLinks'

const NodeRenameOnlyTitle = () => {
  const { getNodeidFromPath } = useLinks()
  const { execRefactor, getMockRefactor } = useRefactor()

  // const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  const ilinks = useDataStore((store) => store.ilinks)
  // const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)
  const nodeTitle = useAnalysisStore((state) => state.analysis.title)

  const { push } = useNavigation()
  const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openModal = useRenameStore((store) => store.openModal)
  // const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const setTo = useRenameStore((store) => store.setTo)
  const nodeFrom = useEditorStore((store) => store.node.path ?? '')
  const setNode = useEditorStore((store) => store.setNode)
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  const [newTitle, setNewTitle] = useState(getNameFromPath(nodeFrom))
  const updateSingleILink = useInternalLinks().updateSingleILink
  const inpRef = useRef<HTMLInputElement>()
  const saveDataAPI = useApi().saveDataAPI
  const { node, content } = useEditorStore()

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
    return isClash(
      getTo(newTitle),
      ilinks.map((n) => n.path)
    )
  }, [ilinks, newTitle])

  const shortcuts = useHelpStore((store) => store.shortcuts)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        event.preventDefault()
        // TODO: Fix the shortcut handler (not working after the shortcut is renamed)
        // shortcutHandler(shortcuts.showRename, () => {
        // console.log({ event })
        setEditable(true)
        inpRef.current.focus()
        // })
      }
    })
    // console.log(shortcuts.showRename)
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) {
        // mog('Opening refactor')
        const to = getTo(newTitle)
        prefillRefactorModal(nodeFrom, to)
      } else {
        // mog('Renaming')
        onRename()
      }
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
    if (newTitle === getNameFromPath(nodeFrom) || isClashed || newTitle.indexOf(SEPARATOR) !== -1) {
      reset()
      return
    }

    const parent = getParentFromPath(nodeFrom)
    const updatedPath = parent ? `${parent}${SEPARATOR}${newTitle}` : newTitle

    await saveDataAPI(node.nodeid, content.content, false)
    updateSingleILink(node.nodeid, updatedPath)
    setNode({ ...node, title: newTitle, path: updatedPath })

    setEditable(false)
    const editorRef = getPlateEditorRef()
    if (editorRef) {
      selectEditor(editorRef, { edge: 'start', focus: true })
    }
  }

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

  return (
    <Wrapper>
      {isReserved(nodeFrom) ? (
        <Tippy theme="mex" placement="bottom-start" content="Reserved Node">
          <TitleStatic>{getNameFromPath(nodeFrom)}</TitleStatic>
        </Tippy>
      ) : editable ? (
        <Input
          id={`NodeRenameTitleSelect_${nodeFrom}_${to}`}
          name="NodeRenameTitleSelect"
          onKeyDown={handleSubmit}
          onChange={(e) => handleTitleChange(e)}
          onBlur={() => reset()}
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
      {editable && (
        <ButtonWrapper>
          <Button
            primary
            key="ButtonRename"
            disabled={getNameFromPath(nodeFrom) === newTitle || isClashed || newTitle.indexOf(SEPARATOR) !== -1}
            // OnMouseDown instead of onClick to prevent onBlur from triggering first
            onMouseDown={onRenameClick}
          >
            <DisplayShortcut shortcut="Enter" />
            Rename
          </Button>
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}

export default NodeRenameOnlyTitle
