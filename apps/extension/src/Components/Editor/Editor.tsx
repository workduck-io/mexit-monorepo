import { Plate, usePlateEditorRef, createPlugins, createPlateUI } from '@udecode/plate'

import { MexEditor, ComboboxKey } from '@workduck-io/mex-editor'
import { MexEditorOptions } from '@workduck-io/mex-editor/lib/types/editor'
import { useDebouncedCallback } from 'use-debounce'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'
import { debounce } from 'lodash'

import { useContentStore } from '../../Hooks/useContentStore'
import { useEditorChange } from '../../Hooks/useEditorActions'
import { NodeEditorContent, CaptureType } from '@mexit/shared'
import generatePlugins from '../../Utils/plugins'
import { Button } from '@mexit/shared'
import { closeSputlit } from '@mexit/shared'
import { useAuthStore } from '../../Hooks/useAuth'
import { checkMetaParseableURL, parsePageMetaTags, useTagStore } from '@mexit/shared'
import { Tag } from '../../Types/Tags'
import config from '../../config'

const EditorWrapper = styled.div`
  margin: 1rem;
`

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Editor = ({ nodeId, content, onChange }: { nodeId: string; content: NodeEditorContent; onChange }) => {
  const currTabURL = window.location.href
  const [pageMetaTags, setPageMetaTags] = useState<any[]>([])
  // TODO: use Dinesh's editor package and take tags from editor
  const [userTags, setUserTags] = useState<Tag[]>([])
  const mexit_content = useContentStore((state) => state.getContent(window.location.href))
  const [nodePath, setNodePath] = useState<string>(config.mex.ACTIVITY_NODE_NAME)

  const initialValue = [
    {
      children: content
    }
  ]

  const plugins = createPlugins(generatePlugins(), { components: createPlateUI() })
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEditorChange(nodeId, content)

  const handleSave = () => {
    const reqBody = {
      id: userDetails.activityNodeUID ? userDetails.activityNodeUID : 'NODE_ACTIVITY',
      nodePath: nodePath,
      type: nodePath !== config.mex.ACTIVITY_NODE_NAME ? CaptureType.HIERARCHY : CaptureType.DRAFT,
      createdBy: userDetails.userId,
      workspace: workspaceDetails.name,
      content: mexit_content,
      metadata: {
        metaTags: pageMetaTags,
        userTags: userTags
      }
    }

    chrome.runtime.sendMessage(
      {
        type: 'CAPTURE_HANDLER',
        subType: 'CREATE_CONTENT_QC',
        data: {
          body: reqBody
        }
      },
      (response) => {
        const { message, error } = response
        if (error) {
          if (error === 'Not Authenticated') {
            toast.error('Not Authenticated. Please login via Popup')
          } else {
            toast.error('An Error Occured. Please try again')
          }
        } else {
          console.log('Successful')
          toast.success('Successful!', { duration: 2000 })
          setTimeout(() => {
            closeSputlit()
          }, 2000)
        }
      }
    )
  }

  useEffect(() => {
    if (checkMetaParseableURL(currTabURL)) {
      const mt = parsePageMetaTags()
      setPageMetaTags(mt)
    }
  }, [currTabURL])

  const handlePathChange = (e: any) => {
    e.preventDefault()
    setNodePath(e.target.value)
  }

  return (
    <>
      <EditorWrapper>
        <Plate id={nodeId} value={initialValue} plugins={plugins} />

        <input onChange={debounce((e) => handlePathChange(e), 1000)} placeholder="Hierarchy for Node" />
        <Container>
          <Button onClick={handleSave} type="submit" value="Save" />
        </Container>
      </EditorWrapper>
      <Toaster position="bottom-center" />
    </>
  )
}

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
}

export const NewEditor: React.FC<EditorProps> = ({ nodeUID, nodePath, content, readOnly, onChange }) => {
  const currTabURL = window.location.href
  const [pageMetaTags, setPageMetaTags] = useState<any[]>([])
  const [userTags, setUserTags] = useState<Tag[]>([])
  const mexit_content = useContentStore((state) => state.getContent(window.location.href))

  const addTags = useTagStore((store) => store.addTags)
  const tags = useTagStore((store) => store.tags)

  const initialValue = [
    {
      children: content
    }
  ]

  useEffect(() => {
    if (checkMetaParseableURL(currTabURL)) {
      const mt = parsePageMetaTags()
      setPageMetaTags(mt)
    }
  }, [currTabURL])

  const comboboxConfig = {
    onKeyDownConfig: {
      keys: {
        tag: {
          newItemHandler: (tag: string) => addTags({ id: 'TAG_1234', text: tag })
        },
        ilink: {
          newItemHandler: (ilink: string, parentId?: string) => console.log(`ilink: ${ilink} | ParentID: ${parentId}`)
        }
      },
      slashCommands: {}
    },
    onChangeConfig: {
      tag: {
        cbKey: ComboboxKey.TAG,
        trigger: '#',
        data: tags.map((t) => ({ ...t, text: t.text })),
        icon: 'add-something-here'
      },
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: [],
        icon: 'add-something-here'
      }
    }
  }

  const editorOptions: MexEditorOptions = {
    editableProps: {
      readOnly: false,
      placeholder: "Let's try something here...",
      autoFocus: true
    },
    focusOptions: {
      edge: 'start',
      focus: true
    }
  }

  const debounced = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 1000)

  return (
    <EditorWrapper>
      <MexEditor
        comboboxConfig={comboboxConfig}
        meta={{
          path: nodePath
        }}
        debug
        onChange={debounced}
        options={editorOptions}
        editorId={nodeUID}
        value={initialValue}
      />
    </EditorWrapper>
  )
}

// export default Editor
