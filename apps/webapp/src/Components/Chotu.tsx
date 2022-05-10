import React, { useEffect, useState } from 'react'
import { CategoryType, idxKey } from '@mexit/core'
import { AsyncMethodReturns, connectToParent } from 'penpal'
import { useSearch } from '../Hooks/useSearch'
import { useAuthStore } from '../Stores/useAuth'
import useContentStore from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useIndexedDBData } from '../Hooks/usePersistentData'
import { useShortenerStore } from '../Stores/useShortener'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useThemeStore from '../Stores/useThemeStore'
import { initSearchIndex } from '../Workers/controller'

export default function Chotu() {
  const [parent, setParent] = useState<AsyncMethodReturns<any>>(null)
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state
  const snippets = useSnippetStore((store) => store.snippets)

  const { ilinks, archive } = useDataStore()
  const contents = useContentStore((state) => state.contents)
  const [first, setFirst] = useState(true)

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets])
  const { queryIndex } = useSearch()

  const connection = connectToParent({
    methods: {
      log(value: string) {
        console.log('message log', value)
      },
      search(key: idxKey | idxKey[], query: string) {
        console.log('webapp chotu', key, query)
        const res = queryIndex(key, query)
        console.log('results pls', res)
        return res
      }
    },
    debug: true
  })

  useEffect(() => {
    connection.promise
      .then((parent: any) => {
        parent.init(userDetails, workspaceDetails, linkCaptures, theme, authAWS, snippets, contents)
        // parent.success('Hi')
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      connection.destroy()
    }
  }, [theme, snippets, contents])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
