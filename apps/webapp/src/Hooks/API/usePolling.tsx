import { useEffect, useRef } from 'react'

import { mog } from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { usePermission } from './usePermission'

const SHARED_NODES_POLLING_INTERVAL = 5 * 60 * 1000 // 5 minutes

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const refId = setInterval(() => savedCallback.current(), delay)

      return () => clearInterval(refId)
    }
  }, [delay])
}

export const usePolling = () => {
  const { getAllSharedNodes } = usePermission()
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  useInterval(
    () => {
      getAllSharedNodes().then(() => mog('Successfully fetched shared nodes'))
    },
    isAuthenticated ? SHARED_NODES_POLLING_INTERVAL : null
  )
}
