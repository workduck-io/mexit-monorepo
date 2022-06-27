import { elementToHtml } from '@udecode/plate'
import { toUpper } from 'lodash'
import DomUtils from './dom_utils1'

function getSingleKeyFunction(e: KeyboardEvent) {
  if (e.ctrlKey) {
    return -1
  } else if (e.key === 'k') {
    window.scrollTo(window.pageXOffset, window.pageYOffset - 100)
    return 1
  } else if (e.key === 'j') {
    window.scrollTo(window.pageXOffset, window.pageYOffset + 100)
    return 1
  } else if (e.key === 'h') {
    window.scrollTo(window.pageXOffset - 100, window.pageYOffset)
    return 1
  } else if (e.key === 'l') {
    window.scrollTo(window.pageXOffset + 100, window.pageYOffset)
    return 1
  } else if (e.key === 'd') {
    window.scrollTo(window.pageXOffset, window.pageYOffset + window.innerHeight / 2)
    return 1
  } else if (e.key === 'u') {
    window.scrollTo(window.pageXOffset, window.pageYOffset - window.innerHeight / 2)
    return 1
  } else if (e.key === 'r') {
    location.reload()
    return 1
  } else if (e.key === 'f') {
    return 2
  } else if (e.key === 'i') {
    return 3
  } else {
    return -1
  }
}

function getMultiKeyFunctions(string: string) {
  // if (visualState !== VisualState.hidden) return;

  if (string === 'gg') {
    window.scrollTo(window.pageXOffset, 0)
  } else if (string === 'G') {
    window.scrollTo(window.pageXOffset, document.body.scrollHeight)
  } else if (string === 'yy') {
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'GET_CURRENT_TAB'
      },
      (response) => {
        const Url = response.message[0].url
        navigator.clipboard.writeText(Url)
      }
    )
  } else if (string === 'gs') {
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'GET_CURRENT_TAB'
      },
      (response) => {
        const newUrl = 'view-source:' + response.message[0].url
        chrome.runtime.sendMessage(
          {
            type: 'ASYNC_ACTION_HANDLER',
            subType: 'OPEN_WITH_NEW_TABS',
            data: {
              urls: newUrl
            }
          },
          (response) => {
            const { message, error } = response
            if (error) console.error('Some error occured. Please Try Again')
          }
        )
      }
    )
  }
}

function checkHintsPress(
  string: string,
  data: {
    element: HTMLBaseElement
    lable: string
    possibleFalsePositive: boolean
    reason: null
    rect: {
      bottom: number
      top: number
      left: number
      right: number
      width: number
    }
    secondClassCitizen: boolean
  }[]
) {
  let val = 0
  data.map((d) => {
    if (string === d.lable || toUpper(string) === d.lable) {
      d.element.style.border = 'thick solid #53BDEB'
      setTimeout(() => {
        d.element.style.border = ''
        let clickEl: any = d.element
        const element: { nodeName: string; type: string; isContentEditable: any } = {
          nodeName: clickEl.nodeName,
          type: clickEl.type,
          isContentEditable: clickEl.isContentEditable
        }
        console.log('DomUtils.isSelectable(element): ', DomUtils.isSelectable(element))
        if (d.element.href !== undefined) window.open(d.element.href, '_blank')
        else if (d.possibleFalsePositive) {
          d.element.click()
        } else if (DomUtils.isSelectable(element)) {
          console.log('isSelectable : yes')
          window.focus()
          return DomUtils.simulateSelect(clickEl)
        } else {
          const clickActivator = (modifiers) => (link) => DomUtils.simulateClick(link, modifiers)
          const clickModifiers = {}
          const linkActivator = clickActivator(clickModifiers)
          // Note(gdh1995): Here we should allow special elements to get focus,
          // <select>: latest Chrome refuses `mousedown` event, and we can only
          //     focus it to let user press space to activate the popup menu
          // <object> & <embed>: for Flash games which have their own key event handlers
          //     since we have been able to blur them by pressing `Escape`
          if (['input', 'select', 'object', 'embed'].includes(element.nodeName.toLowerCase())) {
            clickEl.focus()
          }
          return linkActivator(clickEl)
        }
      }, 400)
      val++
    }
  })
  return val
}

export { getSingleKeyFunction, getMultiKeyFunctions, checkHintsPress }
