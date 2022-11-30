import { API } from '../../../../libs/core/src'
import { useSmartConfigStore } from '../Stores/useSmartConfigStore'

export const useSmartCapture = () => {
  const setConfig = useSmartConfigStore((s) => s.setSmartConfigList)

  const getAllSmartConfigs = async () => {
    const res = await API.smartconfig.getPublic()
    setConfig(res)
  }

  return { getAllSmartConfigs }
}
