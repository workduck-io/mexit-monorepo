import { closeSputlit } from '@mexit/shared'
import { ActionType, MexitAction } from '@mexit/shared'

export function actionExec(action: MexitAction, query?: string) {
  switch (action.type) {
    case ActionType.BROWSER_EVENT:
      chrome.runtime.sendMessage({ ...action })
      break
    case ActionType.OPEN:
      window.open(action.data.base_url, '_blank').focus()
      closeSputlit()

      break
    case ActionType.RENDER:
      // render the component present in the action
      break
    case ActionType.SEARCH: {
      const url = encodeURI(action.data.base_url + query)
      window.open(url, '_blank').focus()
      closeSputlit()
      break
    }
  }
}
