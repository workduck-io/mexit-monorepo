import { useMemo } from 'react'

import {
  addProperty,
  createNodeWithUid,
  getContent,
  getDefaultContent,
  getProfileNoteKey,
  SuperBlocks,
  transformTemplateBlockForInsert,
  useSmartCaptureStore,
  useSnippetStore
} from '@mexit/core'
import { ContactCard } from '@mexit/shared'

import { useNamespaces } from '../../Hooks/useNamespaces'
import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { CaptureDataType, useSputlitStore } from '../../Stores/useSputlitStore'
import EditorPreviewRenderer from '../EditorPreviewRenderer'

/**
 * Two Components: Contact & Profile
 */

const Contact = ({ details, onSave }) => {
  const contact = useMemo(() => {
    return details?.reduce((acc, curr) => {
      if (curr.field) acc[curr.field] = curr.value
      return acc
    }, {})
  }, [details])

  const noteId = useSmartCaptureStore.getState().smartCaptureCache[contact.title]
  const content = getContent(noteId)

  return (
    <ContactCard contact={contact} onTemplateSelect={(template) => onSave(template, contact.title)}>
      {content && (
        <EditorPreviewRenderer noStyle flex={false} readOnly={false} content={content?.content} editorId={noteId} />
      )}
    </ContactCard>
  )
}

export const SmartCapture = () => {
  const addInSmartCaptureCache = useSmartCaptureStore((state) => state.addInSmartCaptureCache)
  const data = useSputlitStore((store) => store.smartCaptureFormData)
  const { saveNode } = useSaveChanges()
  const { getDefaultNamespace } = useNamespaces()

  const getEmail = (data: CaptureDataType['data']) => {
    if (data) return data.find((element) => element?.email)
  }

  const handleOnSave = async (templateId: string, title: string) => {
    const template = useSnippetStore.getState().snippets['SNIPPET_RXTxL49AxbawhK3RwkGr6']
    const defaultNamespace = getDefaultNamespace()

    if (template) {
      const notePath = getProfileNoteKey(title)

      const node = createNodeWithUid(notePath, defaultNamespace?.id)
      const templateContent = template.content
        .filter((block) => !block.properties?.conditionId)
        .map(transformTemplateBlockForInsert)

      const captureBlock = addProperty(getDefaultContent(SuperBlocks.CAPTURE), {
        template: {
          contact: data.data
        },
        tags: [
          {
            value: data.page
          }
        ],
        url: data.source,
        title: data.page
      })

      const profileContent = [captureBlock, ...templateContent]

      saveNode({
        node,
        content: profileContent,
        notify: false,
        reqData: {
          usedTemplateID: templateId
        }
      }).then((res) => {
        const id = data.data?.find((f) => f.field === 'title')?.value
        if (id) addInSmartCaptureCache(id, node.nodeid)
      })
    }
  }

  if (data?.data) return <Contact details={data?.data} onSave={handleOnSave} />
}
