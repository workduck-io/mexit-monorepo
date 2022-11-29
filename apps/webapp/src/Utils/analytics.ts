import { IS_DEV } from '@mexit/core'
import mixpanel from 'mixpanel-browser'

const mixpanelMethods = {
  init: (token: string) => {
    if (!IS_DEV) mixpanel.init(token)
  },
  track: (name, props?) => {
    if (!IS_DEV) mixpanel.track(name, props)
  },
  alias: (id: string, original: string) => {
    if (!IS_DEV) mixpanel.alias(id, original)
  },
  people: {
    set: (props: any) => {
      if (!IS_DEV) mixpanel.people.set(props)
    }
  },
  identify: (id: string) => {
    if (!IS_DEV) mixpanel.identify(id)
  },
  reset: () => {
    if (!IS_DEV) mixpanel.reset()
  }
}

const Analytics = mixpanelMethods
export default Analytics
