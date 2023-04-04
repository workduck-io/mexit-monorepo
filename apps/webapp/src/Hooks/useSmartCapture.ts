import { API, useSmartCaptureStore } from '@mexit/core'
import { data } from '@mexit/shared'

export const useSmartCapture = () => {
  const setConfig = useSmartCaptureStore((s) => s.setSmartCaptureList)

  const getAllSmartCaptures = async () => {
    const res = (await API.smartcapture.getPublic()) as any
    const res1 = data as any
    console.log(res1)
    setConfig(res1)
  }

  return { getAllSmartCaptures }
}
