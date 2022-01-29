import { closeSputlit } from '../contentScript'
import { ActionType, MexitAction } from '../Types/Actions'

export function actionExec(action: MexitAction, query?: string) {
  switch (action.type) {
    case ActionType.action:
      chrome.runtime.sendMessage({ request: action.data.action_name })
      break
    case ActionType.open:
      window.open(action.data.base_url, '_target').focus()
      closeSputlit()
      break
    case ActionType.render:
      // render the component present in the action
      break
    case ActionType.search:
      window.open(action.data.base_url + query, '_target').focus()
      closeSputlit()
      break
  }
}
