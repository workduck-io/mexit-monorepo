import { useEffect, useState, useRef } from 'react'

import dayjs, { ConfigType, OpUnitType } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function DateFormat(d: Date) {
  return dayjs(d).fromNow()
}

export function useRelativeTime(d: Date | number, refresh_ms?: number) {
  // Returns auto-refreshed human relative time
  // Ex. a few seconds ago, 3 minutes ago
  const date = typeof d === 'number' ? new Date(d) : d
  const [humanTime, sethumanTime] = useState(DateFormat(date))

  const refreshRelativeTime = 10 * 1000 // 2 minutes in ms

  useEffect(() => {
    const timer = setInterval(() => {
      const newRelTime = DateFormat(date)
      sethumanTime(newRelTime)
    }, refresh_ms ?? refreshRelativeTime)

    return () => clearInterval(timer)
  })

  useEffect(() => {
    const newRelTime = DateFormat(date)
    sethumanTime(newRelTime)
  }, [d])

  return humanTime
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
