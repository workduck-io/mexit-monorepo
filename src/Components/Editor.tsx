import { Plate, usePlateEditorRef, createPlugins, createPlateUI } from '@udecode/plate'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { toast, Toaster } from 'react-hot-toast'
import { nanoid } from 'nanoid'

import { useContentStore } from '../Hooks/useContentStore'
import { useEditorChange } from '../Hooks/useEditorActions'
import { NodeEditorContent } from '../Types/Editor'
import generatePlugins from '../Utils/plugins'
import { Button } from '../Styles/Button'
import { closeSputlit } from '../contentScript'
import { useAuthStore } from '../Hooks/useAuth'
import { checkMetaParseableURL, parsePageMetaTags } from '../Utils/tabInfo'
import Tags from './Tags'
import { Tag } from '../Types/Tags'

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
  const [userTags, setUserTags] = useState<Tag[]>([])
  const mexit_content = useContentStore((state) => state.getContent(window.location.href))
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
      id: `CONTENT_QC_${nanoid()}`,
      long: 'Uhhhh',
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

  const addNewUserTag = (tag: Tag) => {
    setUserTags([...userTags, tag])
  }

  const removeUserTag = (tag: Tag) => {
    const t = userTags
    const idx = t.map((e) => e.id).indexOf(tag.id)
    t.splice(idx, 1)
    setUserTags([...t])
  }

  return (
    <>
      <EditorWrapper>
        <Plate id={nodeId} value={initialValue} plugins={plugins} />

        <Tags addNewTag={addNewUserTag} removeTag={removeUserTag} userTags={userTags} />
        <Container>
          <Button onClick={handleSave} type="submit" value="Save" />
        </Container>
      </EditorWrapper>
      <Toaster position="bottom-center" />
    </>
  )
}

export default Editor
