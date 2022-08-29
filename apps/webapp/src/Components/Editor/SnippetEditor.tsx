import React, { useEffect, useMemo, useState } from 'react'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { usePlateEditorRef, selectEditor } from '@udecode/plate'
import { debounce } from 'lodash'
import { useForm } from 'react-hook-form'

import { tinykeys } from '@workduck-io/tinykeys'

import { IconButton } from '@workduck-io/mex-components'

import { DRAFT_NODE, getSlug, IS_DEV, mog } from '@mexit/core'
import { EditorWrapper, InfoTools, NodeInfo, NoteTitle, StyledEditor } from '@mexit/shared'
import { Input } from '@mexit/shared'

import { useSnippetBuffer, useSnippetBufferStore } from '../../Hooks/useEditorBuffer'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { SnippetSaverButton } from '../Saver'
import Editor from './Editor'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const { goTo } = useRouting()

  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)
  // const [value, setValue] = useState('')

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useSnippetBuffer()
  const addTitle = useSnippetBufferStore((store) => store.addTitle)
  const buffer = useSnippetBufferStore((store) => store.buffer)
  const addAll = useSnippetBufferStore((store) => store.addAll)
  const toggleTemplate = useSnippetBufferStore((store) => store.toggleTemplate)

  useEffect(() => {
    if (snippet) {
      mog('Snippy', { snippet })
      addAll(snippet.id, snippet.content, snippet.title)
      setContent(snippet.content)
    } else {
      returnToSnippets()
    }
  }, [snippet])

  const getSnippetExtras = () => {
    const val = getBufferVal(snippet?.id)
    return { title: val?.title || snippet?.title || '', template: val?.template || snippet?.template || false }
  }

  const onChangeSave = (val: any[]) => {
    mog('onChangeSave', { val })
    if (val) {
      addOrUpdateValBuffer(snippet.id, val)
    }
  }

  const onChangeTitle = (title: string) => {
    const snippetTitle = title ? getSlug(title) : DRAFT_NODE
    addTitle(snippet.id, snippetTitle)
  }

  const { params } = useRouting()
  const snippetid = snippet?.id ?? params.snippetid
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  const onToggleTemplate = () => {
    const val = getBufferVal(snippet.id)
    if (val && val.template !== undefined) {
      toggleTemplate(snippet.id, !val.template)
    } else toggleTemplate(snippet.id, !snippet.template)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        returnToSnippets()
      }
    })

    return () => {
      saveSnippet()
      unsubscribe()
    }
  }, [])

  const callbackAfterSave = () => {
    const { title } = getSnippetExtras()
    loadSnippet(snippet.id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippet.id, { title })
    // const snippet = useSnippetStore.getState().sn
  }

  const saveSnippet = () => {
    saveAndClearBuffer()
    // updater()
  }

  const returnToSnippets = () => goTo(ROUTE_PATHS.snippets, NavigationType.push)

  const defaultValue = snippet && snippet.title !== DRAFT_NODE ? snippet.title : ''

  const onDelay = debounce((value) => onChangeTitle(value), 250)

  const onChange = (e) => {
    const value = e.target.value
    onDelay(value)
  }

  return (
    <>
      <StyledEditor className="snippets_editor">
        <NodeInfo>
          <IconButton
            size={24}
            shortcut={`Esc`}
            icon={arrowLeftLine}
            onClick={returnToSnippets}
            title={'Return To Snippets'}
          />
          <NoteTitle>
            <>
              [[ <Input autoFocus placeholder={DRAFT_NODE} defaultValue={defaultValue} onChange={onChange} /> ]]
            </>
          </NoteTitle>

          {snippet && (
            <InfoTools>
              {/* {isSnippetTemplate && (
                <ItemTag tag={'Template'} icon={'ri-magic-line'} tooltip={'This snippet is a Template'} />
              )} */}
              {/* <IconButton
                size={24}
                icon={magicLine}
                onClick={onToggleTemplate}
                highlight={isSnippetTemplate}
                title={isSnippetTemplate ? 'Convert to Snippet' : 'Convert to Template'}
              /> */}
              <SnippetSaverButton
                getSnippetExtras={getSnippetExtras}
                noButton
                callbackAfterSave={callbackAfterSave}
                title="Save Snippet"
              />
              {/* {IS_DEV && <SnippetCopierButton />} */}
            </InfoTools>
          )}
        </NodeInfo>

        {snippet && (
          <EditorWrapper onClick={onFocusClick}>
            {
              <Editor
                autoFocus={false}
                // focusAtBeginning={false}
                onChange={onChangeSave}
                content={content}
                nodeUID={snippetid}
              />
            }
          </EditorWrapper>
        )}
      </StyledEditor>
      {/* <CustomDevOnly editorId={snippetid} snippet={snippet} /> */}
    </>
  )
}

export default SnippetEditor
