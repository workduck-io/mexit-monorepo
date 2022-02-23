import { Plate, usePlateEditorRef, createPlugins, createPlateUI } from '@udecode/plate'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'
import { nanoid } from 'nanoid'
import { debounce } from 'lodash'

import { useContentStore } from '../Hooks/useContentStore'
import { useEditorChange } from '../Hooks/useEditorActions'
import { NodeEditorContent, CaptureType } from '@mexit/shared'
import generatePlugins from '../Utils/plugins'
import { Button } from '@mexit/shared'
import { closeSputlit } from '@mexit/shared'
import { useAuthStore } from '../Hooks/useAuth'
import { checkMetaParseableURL, parsePageMetaTags } from '@mexit/shared'
import { Tag } from '../Types/Tags'
import config from '../config'

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

export default Editor
