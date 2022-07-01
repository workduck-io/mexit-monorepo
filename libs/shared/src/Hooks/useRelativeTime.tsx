import { useEffect, useState, useRef } from 'react'
import dayjs, { ConfigType, OpUnitType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { getRelativeTime } from '@mexit/core'

dayjs.extend(relativeTime)

export function DateFormat(d: Date) {
  return dayjs(d).fromNow()
}

export function useRelativeTime(d: Date | number, refresh_ms?: number) {
  // Returns auto-refreshed human relative time
  // Ex. a few seconds ago, 3 minutes ago
  const date = typeof d === 'number' ? new Date(d) : d
  const [humanTime, sethumanTime] = useState(getRelativeTime(date))

  const refreshRelativeTime = 60 * 1000 // 1 minute in ms

  useEffect(() => {
    const timer = setInterval(() => {
      const newRelTime = getRelativeTime(date)
      sethumanTime(newRelTime)
      // console.log('Relative time updated to: ', newRelTime)
    }, refresh_ms ?? refreshRelativeTime)

    return () => clearInterval(timer)
  })

  useEffect(() => {
    const newRelTime = getRelativeTime(date)
    sethumanTime(newRelTime)
  }, [d])

  return humanTime
}

export const useIntervalWithTimeout = (callback: () => void, delay: number | null) => {
  useTimout(callback, delay ? 15 * 1000 : null)
  useInterval(callback, delay)
}

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

export const useTimout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const refId = setTimeout(() => savedCallback.current(), delay)

      return () => clearTimeout(refId)
    }
  }, [delay])
}
