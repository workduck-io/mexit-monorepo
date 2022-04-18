import React, { useState } from 'react'
import checkboxLine from '@iconify-icons/ri/checkbox-line'
import fileCopyLine from '@iconify-icons/ri/file-copy-line'

import { IconButton } from '@mexit/shared'

interface CopyButtonProps {
  text: string
  size?: string
  beforeCopyTooltip?: string
  afterCopyTooltip?: string
}

export const CopyButton = ({ text, size, beforeCopyTooltip, afterCopyTooltip }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  // This is the function we wrote earlier
  const copyTextToClipboard = async (text: string) => {
    return await navigator.clipboard.writeText(text)
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(text)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const copyText = isCopied ? afterCopyTooltip ?? 'Copied to Clipboard' : beforeCopyTooltip ?? 'Copy'

  return (
    <IconButton onClick={handleCopyClick} icon={isCopied ? checkboxLine : fileCopyLine} size={size} title={copyText} />
  )
}
