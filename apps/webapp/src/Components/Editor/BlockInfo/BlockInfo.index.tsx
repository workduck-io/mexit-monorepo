import { mog } from '@mexit/core'
import { Source } from '../../SourceInfo'

import { useEffect, useMemo, useState } from 'react'

import { BlockInfoBlockWrapper, BlockInfoWrapper } from './BlockInfo.style'
import { getIconType } from '@mexit/shared'
import { Icon } from '@iconify/react'
import message2Line from '@iconify/icons-ri/message-2-line'

/**
 *
 * Shows: for the block
 * SourceInfo (if present)
 * Reactions
 * Comment
 */
export const BlockInfo = (props: any) => {
  const { children, element, attributes } = props
  mog('BlockInfo', { id: element?.id })

  // const [open, setOpen] = useState(false)

  const hasMetadata = useMemo(() => element?.blockMeta || element?.metadata?.elementMetadata, [element])
  const sourceURL = useMemo(
    () => element?.blockMeta?.source || element?.metadata?.elementMetadata?.sourceUrl,
    [element]
  )
  const icon = sourceURL && getIconType(sourceURL)

  useEffect(() => {
    if (hasMetadata && sourceURL) {
      mog('BlockInfo Opening by default', { hasMetadata, sourceURL })
      // setOpen(true)
    }
  }, [hasMetadata, sourceURL])

  // if (hasMetadata) {
  //   const iconSource = hasSource
  //   const icon = iconSource && getIconType(iconSource)

  //   if (!icon?.mexIcon)
  //     return (
  //       <SourceInfoWrapper {...attributes}>
  //         <Source source={element?.blockMeta?.source || element?.metadata?.elementMetadata?.sourceUrl} />
  //         {children}
  //       </SourceInfoWrapper>
  //     )

  //   return children
  // }

  return (
    <BlockInfoBlockWrapper {...attributes}>
      {children}
      {hasMetadata && (
        <BlockInfoWrapper>
          {hasMetadata && !icon?.mexIcon && <Source source={sourceURL} />}
          <Icon height={16} icon="fluent:emoji-add-20-regular" />
          <Icon height={16} icon={message2Line} />
        </BlockInfoWrapper>
      )}
    </BlockInfoBlockWrapper>
  )
}

export default BlockInfo
