import { API } from '../../../../libs/core/src'
import { useSmartCaptureStore } from '../Stores/useSmartCaptureStore'

export const useSmartCapture = () => {
  const setConfig = useSmartCaptureStore((s) => s.setSmartCaptureList)

  const getAllSmartCaptures = async () => {
    const res = await API.smartcapture.getPublic()
    setConfig(res)
  }

  return { getAllSmartCaptures }
}
