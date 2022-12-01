import { API } from '@mexit/core'

import { useSmartCaptureStore } from '../Stores/useSmartCaptureStore'

export const useSmartCapture = () => {
  const setConfig = useSmartCaptureStore((s) => s.setSmartCaptureList)

  const getAllSmartCaptures = async () => {
    const res = (await API.smartcapture.getPublic()) as any
    setConfig(res)
  }

  return { getAllSmartCaptures }
}
