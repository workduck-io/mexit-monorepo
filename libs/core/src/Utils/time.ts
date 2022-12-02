import * as chrono from 'chrono-node'
import { add, format, formatDistanceToNow, formatRelative, startOfToday,sub } from 'date-fns'

import { capitalize } from './strings'

export const toLocaleString = (date: Date) => {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export const getCurrentTimeString = (fmt: string): string => {
  return format(new Date(), fmt)
}

export const getRelativeDate = (date: Date): string => {
  const today = startOfToday()
  const sevenDaysAgo = sub(today, { days: 6, hours: 12 })
  const sevenDaysAfter = add(today, { days: 6, hours: 12 })
  if (date.getTime() < sevenDaysAgo.getTime() || date.getTime() > sevenDaysAfter.getTime()) {
    return toLocaleString(date)
  } else {
    return capitalize(formatRelative(date, new Date()))
  }
}

// If the two time are within same min
export const isInSameMinute = (time1: number, time2: number) => {
  const diff = Math.abs(time1 - time2)
  return diff < 60000
}

export const getRelativeTime = (date: Date): string => {
  const dateStr = formatDistanceToNow(date, { addSuffix: true })
  // mog('DateFormat', { dateStr })
  return dateStr
}

export const getNextReminderTime = () => {
  /*
   * Get 10 AM of the next day
   */
  // const tomorrow = startOfTomorrow()
  const today = Date.now()
  const nextFifteenMinute = add(today, { minutes: 15 })
  // const nextDay10AM = add(tomorrow, { hours: 10 })
  return nextFifteenMinute
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const extra = ['Tomorrow']
const timesToResetSimple = [...dayNamesShort, ...dayNames, ...extra]
const timesToReset = [...timesToResetSimple, ...timesToResetSimple.map((x) => x.toLowerCase())]
const surroundingCaps = [' On', ' At']
const surrounding = [...surroundingCaps, ...surroundingCaps.map((x) => x.toLowerCase())]

const customChrono = chrono.casual.clone()
customChrono.refiners.push({
  // Resets the time to 9am from the current time for the reset days
  refine: (context, results) => {
    results.forEach((result) => {
      if (timesToReset.includes(result.text)) {
        result.start.assign('hour', 9)
        result.start.assign('minute', 0)
        result.start.assign('second', 0)
      }
    })
    return results
  }
})

export const getTimeInText = (text: string): { time: Date; textWithoutTime: string } | undefined => {
  const parsed = customChrono.parse(text)
  if (parsed.length > 0) {
    const parse = parsed[0]
    const parsedTimeText = parse.text
    const textRemoveSurrounding = surrounding.reduce((acc, cur) => acc.replace(cur, ''), text).trim()
    const textWithoutTime = textRemoveSurrounding.replace(parsedTimeText, '').trim()

    return { time: parse.date(), textWithoutTime }
  }
  return undefined
}
