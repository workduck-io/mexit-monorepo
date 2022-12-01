import React from 'react'

import { getIconType, ProjectIconContainer, ProjectIconMex, SourceInfoWrapper, StyledSource } from '@mexit/shared'

import Tippy from '@tippyjs/react'

// * Get Favicon url
const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&size=32`
}

export const Source: React.FC<{ source: string }> = ({ source }) => {
  const icon = getFavicon(source)

  const onClick = () => {
    window.open(source, '_blank')
  }

  return (
    <StyledSource contentEditable={false} onClick={onClick}>
      <ProjectIconContainer isView={false}>
        <Tippy
          delay={100}
          interactiveDebounce={100}
          placement="top"
          appendTo={() => document.body}
          theme="mex-bright"
          content={source}
        >
          <ProjectIconMex icon={icon} isMex={false} size={20} />
        </Tippy>
      </ProjectIconContainer>
    </StyledSource>
  )
}

export const SourceInfo = (props: any) => {
  const { children, element, attributes } = props

  if (element?.blockMeta || element?.metadata?.elementMetadata) {
    const iconSource = element?.blockMeta?.source || element?.metadata?.elementMetadata?.sourceUrl
    const icon = iconSource && getIconType(iconSource)

    if (!icon?.mexIcon)
      return (
        <SourceInfoWrapper {...attributes}>
          <Source source={element?.blockMeta?.source || element?.metadata?.elementMetadata?.sourceUrl} />
          {children}
        </SourceInfoWrapper>
      )

    return children
  }

  return children
}
