import { handlerStack } from './handler_stack'
import Rect from './rect'

var DomUtils = {
  documentReady: (function () {
    let isReady = document.readyState !== 'loading'
    let callbacks = []
    if (!isReady) {
      let onDOMContentLoaded
      window.addEventListener(
        'DOMContentLoaded',
        (onDOMContentLoaded = forTrusted(function () {
          window.removeEventListener('DOMContentLoaded', onDOMContentLoaded, true)
          isReady = true
          for (let callback of callbacks) {
            callback()
          }
          callbacks = null
        })),
        true
      )
    }

    return function (callback) {
      if (isReady) {
        return callback()
      } else {
        callbacks.push(callback)
      }
    }
  })(),
  getClientRectsForAreas(
    imgClientRect: { width: any; height: any; left: any; top: any },
    areas: HTMLCollectionOf<HTMLAreaElement>
  ) {
    const rects = []
    for (let i = 0; i < areas.length; i++) {
      var x1: number, x2: any, y1: number, y2: any
      const coords = areas[i].coords.split(',').map((coord: string) => parseInt(coord, 10))
      const shape = areas[i].shape.toLowerCase()
      if (['rect', 'rectangle'].includes(shape)) {
        // "rectangle" is an IE non-standard.
        ;[x1, y1, x2, y2] = coords
      } else if (['circle', 'circ'].includes(shape)) {
        // "circ" is an IE non-standard.
        const [x, y, r] = coords
        const diff = r / Math.sqrt(2) // Gives us an inner square
        x1 = x - diff
        x2 = x + diff
        y1 = y - diff
        y2 = y + diff
      } else if (shape === 'default') {
        ;[x1, y1, x2, y2] = [0, 0, imgClientRect.width, imgClientRect.height]
      } else {
        // Just consider the rectangle surrounding the first two points in a polygon. It's possible to do
        // something more sophisticated, but likely not worth the effort.
        ;[x1, y1, x2, y2] = coords
      }

      let rect = Rect.translate(Rect.create(x1, y1, x2, y2), imgClientRect.left, imgClientRect.top)
      rect = this.cropRectToVisible(rect)

      if (rect && !isNaN(rect.top)) {
        rects.push({ element: areas[i], rect })
      }
    }
    return rects
  },
  cropRectToVisible(rect: { left: number; top: number; right: any; bottom: any }) {
    const boundedRect = Rect.create(Math.max(rect.left, 0), Math.max(rect.top, 0), rect.right, rect.bottom)
    if (boundedRect.top >= window.innerHeight - 4 || boundedRect.left >= window.innerWidth - 4) {
      return null
    } else {
      return boundedRect
    }
  },
  isEditable(element) {
    return (
      this.isSelectable(element) || (element.nodeName != null ? element.nodeName.toLowerCase() : undefined) === 'select'
    )
  },
  simulateSelect(element) {
    // If element is already active, then we don't move the selection.  However, we also won't get a new focus
    // event.  So, instead we pretend (to any active modes which care, e.g. PostFindMode) that element has been
    // clicked.
    if (element === document.activeElement && DomUtils.isEditable(document.activeElement)) {
      return handlerStack.bubbleEvent('click', { target: element })
    } else {
      element.focus()
      if (element.tagName.toLowerCase() !== 'textarea') {
        // If the cursor is at the start of the (non-textarea) element's contents, send it to the end. Motivation:
        // * the end is a more useful place to focus than the start,
        // * this way preserves the last used position (except when it's at the beginning), so the user can
        //   'resume where they left off'.
        // NOTE(mrmr1993): Some elements throw an error when we try to access their selection properties, so
        // wrap this with a try.
        try {
          if (element.selectionStart === 0 && element.selectionEnd === 0) {
            return element.setSelectionRange(element.value.length, element.value.length)
          }
        } catch (error) {}
      }
    }
  },
  isSelectable(element: { nodeName: string; type: string; isContentEditable: any }) {
    if (!(element instanceof Element)) {
      return false
    }
    const unselectableTypes = ['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'reset', 'submit']
    return (
      (element.nodeName.toLowerCase() === 'input' && unselectableTypes.indexOf(element.type) === -1) ||
      element.nodeName.toLowerCase() === 'textarea' ||
      element.isContentEditable
    )
  },
  getVisibleClientRect(element: Element, testChildren: boolean) {
    // Note: this call will be expensive if we modify the DOM in between calls.
    let clientRect: { width: number; height: number }
    if (testChildren == null) {
      testChildren = false
    }
    const clientRects = (() => {
      const result = []
      const elements = element.getClientRects()
      for (let i = 0; i < elements.length; i++) result.push(Rect.copy(elements[i]))
      return result
    })()

    // console.log("clientRects :" ,clientRects);

    // Inline elements with font-size: 0px; will declare a height of zero, even if a child with non-zero
    // font-size contains text.
    var isInlineZeroHeight = function () {
      const elementComputedStyle = window.getComputedStyle(element, null)
      const isInlineZeroFontSize =
        0 === elementComputedStyle.getPropertyValue('display').indexOf('inline') &&
        elementComputedStyle.getPropertyValue('font-size') === '0px'
      // Override the function to return this value for the rest of this context.
      isInlineZeroHeight = () => isInlineZeroFontSize
      return isInlineZeroFontSize
    }

    for (clientRect of clientRects) {
      // If the link has zero dimensions, it may be wrapping visible but floated elements. Check for this.
      var computedStyle: CSSStyleDeclaration
      if ((clientRect.width === 0 || clientRect.height === 0) && testChildren) {
        for (let child of Array.from(element.children)) {
          var needle: any
          computedStyle = window.getComputedStyle(child, null)
          // Ignore child elements which are not floated and not absolutely positioned for parent elements
          // with zero width/height, as long as the case described at isInlineZeroHeight does not apply.
          // NOTE(mrmr1993): This ignores floated/absolutely positioned descendants nested within inline
          // children.
          const position = computedStyle.getPropertyValue('position')
          if (
            computedStyle.getPropertyValue('float') === 'none' &&
            !['absolute', 'fixed'].includes(position) &&
            !(
              clientRect.height === 0 &&
              isInlineZeroHeight() &&
              0 === computedStyle.getPropertyValue('display').indexOf('inline')
            )
          ) {
            continue
          }
          const childClientRect = this.getVisibleClientRect(child, true)
          // console.log("childClientRect :", childClientRect);
          if (childClientRect === undefined || childClientRect[0].width < 3 || childClientRect[0].height < 3) {
            continue
          }
          return childClientRect
        }
      } else {
        clientRect = this.cropRectToVisible(clientRect)

        if (clientRect === null || clientRect.width < 3 || clientRect.height < 3) {
          continue
        }

        // eliminate invisible elements (see test_harnesses/visibility_test.html)
        computedStyle = window.getComputedStyle(element, null)
        if (computedStyle.getPropertyValue('visibility') !== 'visible') {
          continue
        }
        // console.log("clientRect final :" ,clientRect);
        return clientRect
      }
    }
  },
  getViewportTopLeft() {
    const box = document.documentElement
    const style = getComputedStyle(box)
    const rect = box.getBoundingClientRect()
    if (style.position === 'static' && !/content|paint|strict/.test(style.contain || '')) {
      // The margin is included in the client rect, so we need to subtract it back out.
      const marginTop = parseInt(style.marginTop)
      const marginLeft = parseInt(style.marginLeft)
      return { top: -rect.top + marginTop, left: -rect.left + marginLeft }
    } else {
      let clientLeft, clientTop
      // # TODO rectify this if else
      // if (Utils.isFirefox()) {
      //     // These are always 0 for documentElement on Firefox, so we derive them from CSS border.
      //     clientTop = parseInt(style.borderTopWidth);
      //     clientLeft = parseInt(style.borderLeftWidth);
      // } else {
      // }
      ;({ clientTop, clientLeft } = box)
      return { top: -rect.top - clientTop, left: -rect.left - clientLeft }
    }
  },
  suppressPropagation(event) {
    event.stopImmediatePropagation()
  },

  suppressEvent(event) {
    event.preventDefault()
    this.suppressPropagation(event)
  },

  consumeKeyup: (function () {
    let handlerId = null

    return function (event, callback = null, suppressPropagation) {
      if (!event.repeat) {
        if (handlerId != null) {
          handlerStack.remove(handlerId)
        }
        const { code } = event
        handlerId = handlerStack.push({
          _name: 'dom_utils/consumeKeyup',
          keyup(event) {
            if (event.code !== code) {
              return handlerStack.continueBubbling
            }
            this.remove()
            if (suppressPropagation) {
              DomUtils.suppressPropagation(event)
            } else {
              DomUtils.suppressEvent(event)
            }
            return handlerStack.continueBubbling
          },
          // We cannot track keyup events if we lose the focus.
          blur(event) {
            if (event.target === window) {
              this.remove()
            }
            return handlerStack.continueBubbling
          }
        })
      }
      if (typeof callback === 'function') {
        callback()
      }
      if (suppressPropagation) {
        DomUtils.suppressPropagation(event)
        return handlerStack.suppressPropagation
      } else {
        DomUtils.suppressEvent(event)
        return handlerStack.suppressEvent
      }
    }
  })(),
  simulateMouseEvent(event, element, modifiers) {
    if (modifiers == null) {
      modifiers = {}
    }
    if (event === 'mouseout') {
      // Allow unhovering the last hovered element by passing undefined.
      if (element == null) {
        element = this.lastHoveredElement
      }
      this.lastHoveredElement = undefined
      if (element == null) {
        return
      }
    } else if (event === 'mouseover') {
      // Simulate moving the mouse off the previous element first, as if we were a real mouse.
      this.simulateMouseEvent('mouseout', undefined, modifiers)
      this.lastHoveredElement = element
    }

    const mouseEvent = new MouseEvent(event, {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      detail: 1,
      ctrlKey: modifiers.ctrlKey,
      altKey: modifiers.altKey,
      shiftKey: modifiers.shiftKey,
      metaKey: modifiers.metaKey
    })
    // Debugging note: Firefox will not execute the element's default action if we dispatch this click event,
    // but Webkit will. Dispatching a click on an input box does not seem to focus it; we do that separately
    return element.dispatchEvent(mouseEvent)
  },

  simulateClick(element, modifiers) {
    console.log(element, modifiers)
    if (modifiers == null) {
      modifiers = {}
    }
    const eventSequence = ['mouseover', 'mousedown', 'mouseup', 'click']
    const result = []
    for (let event of eventSequence) {
      // #TODO
      // In firefox prior to 96, simulating a click on an element would be blocked. In 96+,
      // extensions can trigger native click listeners on elements. See #3985.
      // const mayBeBlocked = event === "click" && Utils.isFirefox() && parseInt(Utils.firefoxVersion()) < 96
      //     && /^91\.[0-5](\.|$)/.test(Utils.firefoxVersion())
      const defaultActionShouldTrigger =
        Object.keys(modifiers).length === 0 &&
        element.target === '_blank' &&
        element.href &&
        !element.hasAttribute('onclick')
          ? // Simulating a click on a target "_blank" element triggers the Firefox popup blocker.
            // Note(smblott) This will be incorrect if there is a click listener on the element.
            true
          : this.simulateMouseEvent(event, element, modifiers)
      if (defaultActionShouldTrigger) {
        // Firefox doesn't (currently) trigger the default action for modified keys.
        if (0 < Object.keys(modifiers).length || element.target === '_blank') {
          DomUtils.simulateClickDefaultAction(element, modifiers)
        }
      }
      result.push(defaultActionShouldTrigger)
    } // return the values returned by each @simulateMouseEvent call.
    return result
  },
  simulateClickDefaultAction(element, modifiers) {
    let newTabModifier
    if (modifiers == null) {
      modifiers = {}
    }
    if ((element.tagName != null ? element.tagName.toLowerCase() : undefined) !== 'a' || !element.href) {
      return
    }

    const { ctrlKey, shiftKey, metaKey = false, altKey } = modifiers

    {
      newTabModifier = metaKey === false && ctrlKey === true
    }

    window.open(element.href)
    // if (newTabModifier) {
    //     // Open in new tab. Shift determines whether the tab is focused when created. Alt is ignored.
    //     chrome.runtime.sendMessage({
    //         handler: "openUrlInNewTab", url: element.href, active:
    //             shiftKey === true
    //     });
    // } else if ((shiftKey === true) && (metaKey === false) && (ctrlKey === false) && (altKey === false)) {
    //     // Open in new window.
    //     chrome.runtime.sendMessage({ handler: "openUrlInNewWindow", url: element.href });
    // } else if (element.target === "_blank") {
    //     chrome.runtime.sendMessage({ handler: "openUrlInNewTab", url: element.href, active: true });
    // }
  }
}
export const forTrusted = (handler) => handler

export default DomUtils
