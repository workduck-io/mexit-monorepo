// activatedElement is different from document.activeElement -- the latter seems to be reserved mostly for

import DomUtils from './dom_utils1'

// input elements. This mechanism allows us to decide whether to scroll a div or to scroll the whole document.
let activatedElement = null

const getScrollingElement = () => getSpecialScrollingElement() || document.scrollingElement || document.body

var getSpecialScrollingElement = function () {
  const selector = specialScrollingElementMap[window.location.host]
  if (selector) return document.querySelector(selector)
}
const scrollProperties = {
  x: {
    axisName: 'scrollLeft',
    max: 'scrollWidth',
    viewSize: 'clientWidth'
  },
  y: {
    axisName: 'scrollTop',
    max: 'scrollHeight',
    viewSize: 'clientHeight'
  }
}

// Translate a scroll request into a number (which will be interpreted by `scrollBy` as a relative amount, or
// by `scrollTo` as an absolute amount).  :direction must be "x" or "y". :amount may be either a number (in
// which case it is simply returned) or a string.  If :amount is a string, then it is either "max" (meaning the
// height or width of element), or "viewSize".  In both cases, we look up and return the requested amount,
// either in `element` or in `window`, as appropriate.
const getDimension = function (el, direction, amount) {
  if (typeof amount === typeof '') {
    const name = amount
    // the clientSizes of the body are the dimensions of the entire page, but the viewport should only be the
    // part visible through the window
    if (name === 'viewSize' && el === getScrollingElement()) {
      // TODO(smblott) Should we not be returning the width/height of element, here?
      return direction === 'x' ? window.innerWidth : window.innerHeight
    } else {
      return el[scrollProperties[direction][name]]
    }
  } else {
    return amount
  }
}

const getSign = function (val) {
  if (!val) {
    return 0
  } else {
    if (val < 0) {
      return -1
    } else {
      return 1
    }
  }
}
const performScroll = function (element, direction, amount) {
  const axisName = scrollProperties[direction].axisName
  const before = element[axisName]
  if (element.scrollBy) {
    const scrollArg = { behavior: 'instant' }
    scrollArg[direction === 'x' ? 'left' : 'top'] = amount
    element.scrollBy(scrollArg)
  } else {
    element[axisName] += amount
  }
  return element[axisName] !== before
}

const doesScroll = function (element, direction, amount, factor) {
  // amount is treated as a relative amount, which is correct for relative scrolls. For absolute scrolls (only
  // gg, G, and friends), amount can be either a string ("max" or "viewSize") or zero. In the former case,
  // we're definitely scrolling forwards, so any positive value will do for delta.  In the latter, we're
  // definitely scrolling backwards, so a delta of -1 will do.  For absolute scrolls, factor is always 1.
  let delta = factor * getDimension(element, direction, amount) || -1
  delta = getSign(delta) // 1 or -1
  return performScroll(element, direction, delta) && performScroll(element, direction, -delta)
}

// Test whether `element` should be scrolled. E.g. hidden elements should not be scrolled.
const shouldScroll = function (element, direction) {
  const computedStyle = window.getComputedStyle(element)
  // Elements with `overflow: hidden` must not be scrolled.
  if (computedStyle.getPropertyValue(`overflow-${direction}`) === 'hidden') return false
  // Elements which are not visible should not be scrolled.
  if (['hidden', 'collapse'].includes(computedStyle.getPropertyValue('visibility'))) return false
  if (computedStyle.getPropertyValue('display') === 'none') return false
  return true
}

var firstScrollableElement = function (element = null) {
  let child
  if (!element) {
    const scrollingElement = getScrollingElement()
    if (doesScroll(scrollingElement, 'y', 1, 1) || doesScroll(scrollingElement, 'y', -1, 1)) return scrollingElement
    else element = document.body || getScrollingElement()
  }

  if (doesScroll(element, 'y', 1, 1) || doesScroll(element, 'y', -1, 1)) {
    return element
  } else {
    // children = children.filter (c) -> c.rect # Filter out non-visible elements.
    let children = Array.from(element.children)
      .map((c: Element) => ({ element: c, rect: DomUtils.getVisibleClientRect(c, null), area: 0 }))
      .filter((child) => child.rect) // Filter out non-visible elements.

    children.map((child) => (child.area = child.rect.width * child.rect.height))
    for (child of children.sort((a, b) => b.area - a.area)) {
      // Largest to smallest by visible area.
      const el = firstScrollableElement(child.element)
      if (el) return el
    }
    return null
  }
}

const isScrollableElement = function (element, direction, amount, factor) {
  if (direction == null) {
    direction = 'y'
  }
  if (amount == null) {
    amount = 1
  }
  if (factor == null) {
    factor = 1
  }
  return doesScroll(element, direction, amount, factor) && shouldScroll(element, direction)
}

const Scroller = {
  // Is element scrollable and not the activated element?
  isScrollableElement(element) {
    if (!activatedElement)
      activatedElement = (getScrollingElement() && firstScrollableElement()) || getScrollingElement()
    return element !== activatedElement && isScrollableElement(element, null, null, null)
  }
}

var specialScrollingElementMap = {
  'twitter.com': 'div.permalink-container div.permalink[role=main]',
  'reddit.com': '#overlayScrollContainer',
  'new.reddit.com': '#overlayScrollContainer',
  'www.reddit.com': '#overlayScrollContainer',
  'web.telegram.org': '.MessageList'
}

export default Scroller
