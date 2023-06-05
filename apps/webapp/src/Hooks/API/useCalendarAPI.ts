import { API, PersistAuth, useCalendarStore } from '@mexit/core'

export const useCalendarAPI = () => {
  const setCalendarProviders = useCalendarStore((s) => s.setCalendarProviders)
  const addToken = useCalendarStore((s) => s.addToken)

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

  const getGoogleCalendarAuth = async () => {
    const resp = await API.calendar.getAuth()

    if (resp) {
      const userId = resp.userId
      const token = resp.actionAuth?.token?.[userId]?.accessToken
      addToken('GOOGLE_CAL', token)
    }
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
    persistAuthToken,
    getGoogleCalendarAuth
  }
}
