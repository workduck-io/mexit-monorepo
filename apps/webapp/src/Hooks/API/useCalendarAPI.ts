import { API, PersistAuth, useCalendarStore } from '@mexit/core'

export const useCalendarAPI = () => {
  const setCalendarProviders = useCalendarStore((s) => s.setCalendarProviders)

  const getCalendarProviders = async () => {
    const res = await API.calendar.getAllCalendarProviders()
    if (res) setCalendarProviders(res)
  }

  const getGoogleCalendarAuthUrl = async () => {
    const resp = API.calendar
      .getGoogleCalendarAuthUrl()
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
    return resp
  }

  const getGoogleCalendarNewToken = async () => {
    const resp = API.calendar
      .getGoogleCalendarNewToken()
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
    return resp
  }

  const persistAuthToken = async (data: PersistAuth) => {
    API.calendar
      .persistAuth(data)
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
  }

  return {
    getCalendarProviders,
    getGoogleCalendarAuthUrl,
    getGoogleCalendarNewToken,
    persistAuthToken
  }
}
