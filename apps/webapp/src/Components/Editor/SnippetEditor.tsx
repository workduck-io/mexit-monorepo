import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import { debounce } from 'lodash'

import { IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { DRAFT_NODE, getSlug, mog } from '@mexit/core'
import { EditorWrapper, InfoTools, Input, NodeInfo, NoteTitle, StyledEditor } from '@mexit/shared'

import { useSnippetBuffer, useSnippetBufferStore } from '../../Hooks/useEditorBuffer'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import useRouteStore, { BannerType } from '../../Stores/useRouteStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'

import Banner from './Banner'
import Editor from './Editor'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const { goTo, goBack } = useRouting()

  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)
  // const [value, setValue] = useState('')

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const location = useLocation()
  const isBannerVisible = useRouteStore((s) => s.routes?.[location.pathname]?.banners?.includes(BannerType.editor))
  const _hasHydrated = useSnippetStore((store) => store._hasHydrated)
  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useSnippetBuffer()
  const addTitle = useSnippetBufferStore((store) => store.addTitle)
  const addAll = useSnippetBufferStore((store) => store.addAll)
  const toggleTemplate = useSnippetBufferStore((store) => store.toggleTemplate)

  useEffect(() => {
    if (snippet) {
      mog('Snippy', { snippet })
      addAll(snippet.id, snippet.content, snippet.title)
      setContent(snippet.content)
    } else {
      if (_hasHydrated) {
        mog('Snippy', { snippet })
        returnToSnippets()
      }
    }
  }, [snippet, _hasHydrated])

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

  const onFocusClick = () => {
    const editorRef = getPlateEditorRef()

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
      },
      '$mod+s': (event) => {
        event.preventDefault()
        saveSnippet()
        toast('Saved')
      }
    })

    return () => {
      saveSnippet()
      unsubscribe()
    }
  }, [snippetid])

  const callbackAfterSave = () => {
    const { title } = getSnippetExtras()
    loadSnippet(snippet.id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippet.id, { title })
    // const snippet = useSnippetStore.getState().sn
  }

  const saveSnippet = () => {
    saveAndClearBuffer()
  }

  const returnToSnippets = () => goBack()
  const defaultValue = useMemo(() => (snippet?.title !== DRAFT_NODE ? snippet?.title : ''), [snippet])

  const onDelay = debounce((value) => onChangeTitle(value), 250)

  const onChange = (e) => {
    const value = e.target.value
    onDelay(value)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleBannerButtonClick = () => {}

  return (
    <>
      <StyledEditor className="snippets_editor">
        {isBannerVisible && (
          <Banner
            onClick={handleBannerButtonClick}
            title="Same Snippet is being accessed by multiple users. Data may get lost!"
          />
        )}
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
              [[{' '}
              <Input
                autoFocus
                key={defaultValue}
                placeholder={DRAFT_NODE}
                defaultValue={defaultValue}
                onChange={onChange}
              />{' '}
              ]]
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
              {/* <SnippetSaverButton
                getSnippetExtras={getSnippetExtras}
                noButton
                callbackAfterSave={callbackAfterSave}
                title="Save Snippet"
              /> */}
              {/* {IS_DEV && <SnippetCopierButton />} */}
            </InfoTools>
          )}
        </NodeInfo>

        {snippet && (
          <EditorWrapper onClick={onFocusClick}>
            {
              <Editor
                withShadow
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
