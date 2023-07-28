import { API, useSmartCaptureStore } from '@mexit/core'

export const useSmartCapture = () => {
  const setConfig = useSmartCaptureStore((s) => s.setSmartCaptureList)

  const getAllSmartCaptures = async () => {
    const res = (await API.smartcapture.getPublic()) as any
    setConfig(res)
  }

  return { getAllSmartCaptures }
}
