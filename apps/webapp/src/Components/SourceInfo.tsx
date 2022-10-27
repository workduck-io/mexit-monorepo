import React from 'react'

import Tippy from '@tippyjs/react'

import { ProjectIconMex, getIconType, ProjectIconContainer, SourceInfoWrapper, StyledSource } from '@mexit/shared'

import { useEditorStore } from '../Stores/useEditorStore'

// * Get Favicon url
const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&size=32`
}

export const Source: React.FC<{ source: string }> = ({ source }) => {
  const isUserEditing = useEditorStore((state) => state.isEditing)
  const icon = getFavicon(source)

  const onClick = () => {
    window.open(source, '_blank')
  }

  return (
    <StyledSource $isVisible={!isUserEditing} contentEditable={false} onClick={onClick}>
      <Tippy
        delay={100}
        interactiveDebounce={100}
        placement="top"
        appendTo={() => document.body}
        theme="mex-bright"
        content={source}
      >
        <ProjectIconMex icon={icon} isMex={false} />
      </Tippy>
    </StyledSource>
  )
}
