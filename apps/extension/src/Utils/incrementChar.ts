import DomUtils, { forTrusted } from './dom_utils1'
import Scroller from './scroller'

function getValue(s: string) {
  return s.split('').reduce((r: number, a: string) => r * 26 + parseInt(a, 36) - 9, 0) - 1
}

function setValue(n: number) {
  var result = ''
  do {
    result = ((n % 26) + 10).toString(36) + result
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return result.toUpperCase()
}

export function incrementChar(string: string) {
  return setValue(getValue(string) + 1)
}

export const findUpTag = (el, tag) => {
  let r = el
  let val = 0
  while (r.parentNode) {
    if (typeof r === 'object' && r !== null && 'getAttribute' in r && r.getAttribute('role') === tag) {
      val = 1
    }
    r = r.parentNode
  }
  if (val) return 1
  r = el
  const getAllChildren = (ele) => {
    ele.childNodes.forEach((element) => {
      if (
        typeof element === 'object' &&
        element !== null &&
        'getAttribute' in element &&
        element.getAttribute('role') === tag
      ) {
        val = 1
        return 1
      }
      getAllChildren(element)
    })
  }
  const data = getAllChildren(r)
  return val
}

export function getKeys(keyString: object) {
  let stringPress = ''
  for (const key in keyString) {
    if (key !== 'Alt') {
      if (key !== 'Shift') {
        if (key !== 'CapsLock') {
          if (key !== 'Ctrl') {
            for (let i = 0; i < keyString[key]; i++) {
              stringPress += key
            }
          }
        }
      }
    }
  }
  return stringPress
}

export function getAllVisibleTags(requireHref: boolean) {
  let hint, nonOverlappingElements, rect, visibleElement
  let element
  if (!document.documentElement) return []
  var getAllElements = function (root, elements) {
    if (elements == null) elements = []
    for (element of Array.from(root.querySelectorAll('*'))) {
      elements.push(element)
      if (element.shadowRoot) getAllElements(element.shadowRoot, elements)
    }
    return elements
  }
  const elements = getAllElements(document.documentElement, null)
  // return element;
  let visibleElements = []
  let index = 0

  // The order of elements here is important; they should appear in the order they are in the DOM, so that
  // we can work out which element is on top when multiple elements overlap. Detecting elements in this loop
  // is the sensible, efficient way to ensure this happens.
  // NOTE(mrmr1993): Our previous method (combined XPath and DOM traversal for jsaction) couldn't provide
  // this, so it's necessary to check whether elements are clickable in order, as we do below.
  for (element of Array.from(elements)) {
    if (!requireHref || !!element.href) {
      visibleElement = getVisibleClickable(element)
      // console.log("visibleElement :",visibleElement)
      if (visibleElement.length !== 0) {
        visibleElements[index] = visibleElement[0]
        index++
      }
    }
  }
  // Traverse the DOM from descendants to ancestors, so later elements show above earlier elements.
  visibleElements = visibleElements.reverse()

  // Filter out suspected false positives.  A false positive is taken to be an element marked as a possible
  // false positive for which a close descendant is already clickable.  False positives tend to be close
  // together in the DOM, so - to keep the cost down - we only search nearby elements.  NOTE(smblott): The
  // visible elements have already been reversed, so we're visiting descendants before their ancestors.
  const descendantsToCheck = [1, 2, 3] // This determines how many descendants we're willing to consider.
  visibleElements = (() => {
    const result = []
    for (var position = 0; position < visibleElements.length; position++) {
      // TODO(philc): Pull this function out into a helper function, and/or use Array.some().
      // The converted code from coffeescript is ugly.
      element = visibleElements[position]
      if (
        element.possibleFalsePositive &&
        (function () {
          let index = Math.max(0, position - 6) // This determines how far back we're willing to look.
          while (index < position) {
            let candidateDescendant = visibleElements[index].element
            for (let _ of descendantsToCheck) {
              candidateDescendant = candidateDescendant != null ? candidateDescendant.parentElement : undefined
              if (candidateDescendant === element.element) return true
            }
            index += 1
          }
          return false
        })()
      ) {
        // This is not a false positive.
        continue
      }
      result.push(element)
    }
    return result
  })()
  // console.log("visibleElement :", visibleElements);
  // This loop will check if any corner or center of element is clickable
  // document.elementFromPoint will find an element at a x,y location.
  // Node.contain checks to see if an element contains another. note: someNode.contains(someNode) === true
  // If we do not find our element as a descendant of any element we find, assume it's completely covered.

  const localHints = (nonOverlappingElements = [])
  while ((visibleElement = visibleElements.pop())) {
    if (visibleElement.secondClassCitizen) continue

    rect = visibleElement.rect
    element = visibleElement.element

    // Check middle of element first, as this is perhaps most likely to return true.
    const elementFromMiddlePoint = getElementFromPoint(
      rect.left + rect.width * 0.5,
      rect.top + rect.height * 0.5,
      null,
      null
    )
    if (
      elementFromMiddlePoint &&
      (element.contains(elementFromMiddlePoint) || elementFromMiddlePoint.contains(element))
    ) {
      nonOverlappingElements.push(visibleElement)
      continue
    }

    // If not in middle, try corners.
    // Adjusting the rect by 0.1 towards the upper left, which empirically fixes some cases where another
    // element would've been found instead. NOTE(philc): This isn't well explained. Originated in #2251.
    const verticalCoordinates = [rect.top + 0.1, rect.bottom - 0.1]
    const horizontalCoordinates = [rect.left + 0.1, rect.right - 0.1]

    let foundElement = false
    for (let verticalCoordinate of verticalCoordinates) {
      for (let horizontalCoordinate of horizontalCoordinates) {
        const elementFromPoint = getElementFromPoint(horizontalCoordinate, verticalCoordinate, null, null)
        if (elementFromPoint && (element.contains(elementFromPoint) || elementFromPoint.contains(element))) {
          foundElement = true
          break
        }
      }
      if (foundElement) {
        nonOverlappingElements.push(visibleElement)
        break
      }
    }
  }
  // Position the rects within the window.
  const { top, left } = DomUtils.getViewportTopLeft()
  for (hint of nonOverlappingElements) {
    hint.rect.top += top
    hint.rect.left += left
  }

  // if (Settings.get("filterLinkHints")) {
  //   for (hint of localHints)
  //     Object.assign(hint, this.generateLinkText(hint));
  // }
  return localHints
}
function getElementFromPoint(x, y, root, stack) {
  if (root == null) root = document
  if (stack == null) stack = []
  const element = root.elementsFromPoint ? root.elementsFromPoint(x, y)[0] : root.elementFromPoint(x, y)

  if (stack.includes(element)) return element

  stack.push(element)

  if (element && element.shadowRoot) return getElementFromPoint(x, y, element.shadowRoot, stack)

  return element
}

function getVisibleClickable(element) {
  // Get the tag name.  However, `element.tagName` can be an element (not a string, see #2035), so we guard
  // against that.
  let contentEditable, role
  const tagName = (element.tagName.toLowerCase ? element.tagName.toLowerCase() : null) || ''
  let isClickable: any = false
  let onlyHasTabIndex = false
  let possibleFalsePositive = false
  const visibleElements = []
  let reason = null

  // Insert area elements that provide click functionality to an img.
  if (tagName === 'img') {
    let mapName = element.getAttribute('usemap')
    if (mapName) {
      const imgClientRects = element.getClientRects()
      mapName = mapName.replace(/^#/, '').replace('"', '\\"')
      const map = document.querySelector(`map[name=\"${mapName}\"]`)
      if (map && imgClientRects.length > 0) {
        const areas = map.getElementsByTagName('area')
        const areasAndRects = DomUtils.getClientRectsForAreas(imgClientRects[0], areas)
        visibleElements.push(...areasAndRects)
      }
    }
  }

  // Check aria properties to see if the element should be ignored.
  // Note that we're showing hints for elements with aria-hidden=true. See #3501 for discussion.
  const ariaDisabled = element.getAttribute('aria-disabled')
  if (ariaDisabled && ['', 'true'].includes(ariaDisabled.toLowerCase())) return [] // This element should never have a link hint.

  // Check for AngularJS listeners on the element.
  // if (!this.checkForAngularJs) {
  //   this.checkForAngularJs = (function() {
  //     const angularElements = document.getElementsByClassName("ng-scope");
  //     if (angularElements.length === 0) {
  //       return () => false;
  //     } else {
  //       const ngAttributes = [];
  //       for (let prefix of [ '', 'data-', 'x-' ]) {
  //         for (let separator of [ '-', ':', '_' ]) {
  //           ngAttributes.push(`${prefix}ng${separator}click`);
  //         }
  //       }
  //       return function(element) {
  //         for (let attribute of ngAttributes) {
  //           if (element.hasAttribute(attribute)) { return true; }
  //         }
  //         return false;
  //       };
  //     }
  //   })();
  // }

  // if (!isClickable)
  //   isClickable = this.checkForAngularJs(element);

  if (element.hasAttribute('onclick')) {
    isClickable = true
  } else if (
    (role = element.getAttribute('role')) != null &&
    ['button', 'tab', 'link', 'checkbox', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'radio'].includes(
      role.toLowerCase()
    )
  ) {
    isClickable = true
  } else if (
    (contentEditable = element.getAttribute('contentEditable')) != null &&
    ['', 'contenteditable', 'true'].includes(contentEditable.toLowerCase())
  ) {
    isClickable = true
  }

  // Check for jsaction event listeners on the element.
  if (!isClickable && element.hasAttribute('jsaction')) {
    const jsactionRules = element.getAttribute('jsaction').split(';')
    for (let jsactionRule of jsactionRules) {
      const ruleSplit = jsactionRule.trim().split(':')
      if (ruleSplit.length >= 1 && ruleSplit.length <= 2) {
        const [eventType, namespace, actionName] =
          ruleSplit.length === 1
            ? ['click', ...ruleSplit[0].trim().split('.'), '_']
            : [ruleSplit[0], ...ruleSplit[1].trim().split('.'), '_']
        if (!isClickable) {
          isClickable = eventType === 'click' && namespace !== 'none' && actionName !== '_'
        }
      }
    }
  }

  // Check for tagNames which are natively clickable.
  switch (tagName) {
    case 'a':
      isClickable = true
      break
    case 'textarea':
      if (!isClickable) {
        isClickable = !element.disabled && !element.readOnly
      }
      break
    case 'input':
      var type = element.getAttribute('type')
      if (!isClickable) {
        isClickable = !(
          (type && type.toLowerCase() === 'hidden') ||
          element.disabled ||
          (element.readOnly && DomUtils.isSelectable(element))
        )
      }
      break
    case 'button':
    case 'select':
      if (!isClickable) {
        isClickable = !element.disabled
      }
      break
    case 'object':
    case 'embed':
      isClickable = true
      break
    case 'label':
      if (!isClickable) {
        isClickable =
          element.control != null && !element.control.disabled && getVisibleClickable(element.control).length === 0
      }
      break
    case 'body':
      if (!isClickable) {
        isClickable =
          element === document.body &&
          !windowIsFocused() &&
          window.innerWidth > 3 &&
          window.innerHeight > 3 &&
          (document.body != null ? document.body.tagName.toLowerCase() : undefined) !== 'frameset'
            ? (reason = 'Frame.')
            : undefined
      }
      if (!isClickable) {
        isClickable =
          element === document.body && windowIsFocused() && Scroller.isScrollableElement(element)
            ? (reason = 'Scroll.')
            : undefined
      }
      break
    case 'img':
      if (!isClickable) {
        isClickable = ['zoom-in', 'zoom-out'].includes(element.style.cursor)
      }
      break
    case 'div':
    case 'ol':
    case 'ul':
      if (!isClickable) {
        isClickable =
          element.clientHeight < element.scrollHeight && Scroller.isScrollableElement(element)
            ? (reason = 'Scroll.')
            : undefined
      }
      break
    case 'details':
      isClickable = true
      reason = 'Open.'
      break
  }

  // NOTE(smblott) Disabled pending resolution of #2997.
  // # Detect elements with "click" listeners installed with `addEventListener()`.
  // isClickable ||= element.hasAttribute "_vimium-has-onclick-listener"

  // An element with a class name containing the text "button" might be clickable.  However, real clickables
  // are often wrapped in elements with such class names.  So, when we find clickables based only on their
  // class name, we mark them as unreliable.
  const className = element.getAttribute('class')
  if (!isClickable && className && className.toLowerCase().includes('button'))
    possibleFalsePositive = isClickable = true

  // Elements with tabindex are sometimes useful, but usually not. We can treat them as second class
  // citizens when it improves UX, so take special note of them.
  const tabIndexValue = element.getAttribute('tabindex')
  const tabIndex = tabIndexValue ? parseInt(tabIndexValue) : -1
  if (!isClickable && !(tabIndex < 0) && !isNaN(tabIndex)) {
    isClickable = onlyHasTabIndex = true
  }

  const result: {
    element: HTMLBaseElement
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
  }[] = []
  if (isClickable) {
    const clientRect: {
      bottom: number
      top: number
      left: number
      right: number
      width: number
    } = DomUtils.getVisibleClientRect(element, true)
    if (clientRect !== null && clientRect !== undefined) {
      result.push({
        element: element,
        rect: clientRect,
        secondClassCitizen: onlyHasTabIndex,
        possibleFalsePositive: possibleFalsePositive,
        reason: reason
      })
    }
  }
  return result
}

const windowIsFocused = (function () {
  let windowHasFocus = null
  DomUtils.documentReady(() => (windowHasFocus = document.hasFocus()))
  window.addEventListener(
    'focus',
    forTrusted(function (event) {
      if (event.target === window) windowHasFocus = true
      return true
    }),
    true
  )
  window.addEventListener(
    'blur',
    forTrusted(function (event) {
      if (event.target === window) windowHasFocus = false
      return true
    }),
    true
  )
  return () => windowHasFocus
})()
