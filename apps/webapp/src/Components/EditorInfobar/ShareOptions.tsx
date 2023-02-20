import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { nicePromise, ShareContext } from '@mexit/core'
import { copyTextToClipboard, ShareToggle } from '@mexit/shared'

import { useApi } from '../../Hooks/API/useNodeAPI'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNodes } from '../../Hooks/useNodes'
import { useDataStore } from '../../Stores/useDataStore'
import { useMetadataStore } from '../../Stores/useMetadataStore'

interface ShareOptionsProps {
  context: ShareContext
  id: string
}

const ShareOptions = ({ context, id }: ShareOptionsProps) => {
  const isNotePublic = useMetadataStore((s) => s.metadata.notes[id]?.publicAccess)
  const isSpacePublic = useDataStore((s) => s.namespaces.find((i) => i.id === id)?.publicAccess)

  const isPublic = useMemo(() => {
    return isNotePublic || isSpacePublic
  }, [isNotePublic, isSpacePublic])

  const [isLoading, setIsLoading] = useState(isPublic)
  const [mounted, setMounted] = useState(false)

  const { makeNamespacePublic, getSpaceCopyUrl } = useNamespaces()
  const { getNoteCopyUrl } = useNodes()
  const { makeNotePrivate, makeNotePublic } = useApi()

  const getPublicUrl = useCallback(
    (context: 'note' | 'space', id: string) => {
      if (context === 'note') return getNoteCopyUrl(id)
      return getSpaceCopyUrl(id)
    },
    [isPublic]
  )

  const publicUrl = isPublic ? getPublicUrl(context, id) : ''

  const handleError = () => {
    // * Revert the action
    setIsLoading((s) => !s)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isPublic && mounted) {
      copyTextToClipboard(publicUrl, 'Public link copied!')
    }
  }, [isPublic, publicUrl])

  const flipPublicAccess = async (publicUrl: string) => {
    setIsLoading((s) => !s)

    if (context === 'note') {
      // Go from public -> private
      if (publicUrl) {
        nicePromise(async () => {
          makeNotePrivate(id)
        }, handleError)
      } else {
        // Private to Public
        nicePromise(async () => {
          makeNotePublic(id)
        }, handleError)
      }
    } else if (context === 'space') {
      if (publicUrl) {
        nicePromise(async () => {
          makeNamespacePublic(id, false)
        }, handleError)
      } else {
        // Private to Public
        nicePromise(async () => {
          makeNamespacePublic(id, true)
        }, handleError)
      }
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ShareToggle
        id="toggle-public"
        value={!!isLoading}
        size="sm"
        onChange={() => flipPublicAccess(publicUrl)}
        checked={!!isLoading}
      />
    </div>
  )
}

export default ShareOptions
