import React from 'react'

import Editor from './Editor'

const PreviewEditor = ({ content, editorId }) => {
  return <Editor nodeUID={editorId} nodePath={editorId} content={content} readOnly={true} />
}

export default PreviewEditor
