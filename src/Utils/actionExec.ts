import { closeSputlit } from '../contentScript'
import { ActionType, MexitAction } from '../Types/Actions'

export function actionExec(action: MexitAction, query?: string) {
  switch (action.type) {
    case ActionType.action:
      chrome.runtime.sendMessage({ request: action.data.action_name })
      break
    case ActionType.open:
      window.open(action.data.base_url, '_blank').focus()
      closeSputlit()

      break
    case ActionType.render:
      // render the component present in the action
      break
    case ActionType.search: {
      const url = encodeURI(action.data.base_url + query)
      window.open(url, '_blank').focus()
      closeSputlit()
      break
    }
    case ActionType.browser_search: {
      chrome.runtime.sendMessage({ request: action })
      break
    }
  }
}
