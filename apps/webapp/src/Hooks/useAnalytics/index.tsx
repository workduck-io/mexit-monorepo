import { EventProperties, UserProperties } from './types'

const useAnalytics = () => {
  /** Not heap's userId */
  const identifyUser = (id: string | undefined) => {
    if (id) window.heap.identify(id)
  }

  /** For this cookies are required */
  const addUserProperties = (properties: UserProperties) => {
    window.heap.addUserProperties(properties)
  }

  const addEventProperties = (properties: EventProperties) => {
    window.heap.clearEventProperties()
    window.heap.addEventProperties(properties)
  }

  const trackEvent = (name: string, properties?: Record<string, any>) => {
    window.heap.track(name, properties)
  }

  const initAnalytics = () => {
    /** For sync */
  }

  return {
    identifyUser,
    addUserProperties,
    initAnalytics,
    addEventProperties,
    trackEvent
  }
}

export default useAnalytics
