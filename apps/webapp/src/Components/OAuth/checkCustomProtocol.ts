export const _registerEvent = (target, eventType, callback) => {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback)
    return {
      remove: () => {
        target.removeEventListener(eventType, callback)
      }
    }
  } else {
    target.attachEvent(eventType, callback)
    return {
      remove: () => {
        target.detachEvent(eventType, callback)
      }
    }
  }
}

const _createHiddenIFrame = (target, url: string) => {
  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.id = 'hiddenIFrameVeryHiddenHaha'
  iframe.style.display = 'none'

  target.appendChild(iframe)
  return iframe
}

const openUriWithHiddenFrame = (uri, failCb, successCb) => {
  const timeout = setTimeout(function () {
    failCb()
    handler.remove()
  }, 500)

  let iframe: HTMLIFrameElement = document.querySelector('#hiddenIFrameVeryHiddenHaha')
  if (!iframe) {
    iframe = _createHiddenIFrame(document.body, 'about:blank')
  }

  const handler = _registerEvent(window, 'blur', onBlur)
  function onBlur() {
    clearTimeout(timeout)
    handler.remove()
    successCb()
  }

  iframe.contentWindow.location.href = uri
}

const openUriWithTimeoutHack = (uri, failCb, successCb) => {
  const timeout = setTimeout(function () {
    failCb()
    handler.remove()
  }, 500)

  //handle page running in an iframe (blur must be registered with top level window)
  let target: any = window
  while (target !== target.parent) {
    target = target.parent
  }

  const handler = _registerEvent(target, 'blur', onBlur)

  function onBlur() {
    clearTimeout(timeout)
    handler.remove()
    successCb()
  }

  window.location = uri
}

const openUriUsingFirefox = (uri, failCb, successCb) => {
  let iframe: HTMLIFrameElement = document.querySelector('#hiddenIFrameVeryHiddenHaha')

  if (!iframe) {
    iframe = _createHiddenIFrame(document.body, 'about:blank')
  }

  try {
    iframe.contentWindow.location.href = uri
    successCb()
  } catch (e) {
    if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
      failCb()
    }
  }
}

const checkBrowser = () => {
  // eslint-disable-next-line
  // @ts-ignore
  const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
  const ua = navigator.userAgent.toLowerCase()

  return {
    isOpera: isOpera,
    // eslint-disable-next-line
    // @ts-ignore
    isFirefox: typeof InstallTrigger !== 'undefined',
    isSafari:
      (~ua.indexOf('safari') && !~ua.indexOf('chrome')) ||
      Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
    // eslint-disable-next-line
    // @ts-ignore
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    // eslint-disable-next-line
    // @ts-ignore

    isChrome: !!window.chrome && !isOpera
  }
}

export const checkCustomProtocolHandler = (url, fallbackCallback, successCallback) => {
  const browser = checkBrowser()
  if (browser.isFirefox) {
    openUriUsingFirefox(url, fallbackCallback, successCallback)
  } else if (browser.isChrome || browser.isIOS) {
    openUriWithTimeoutHack(url, fallbackCallback, successCallback)
  } else if (browser.isSafari) {
    openUriWithHiddenFrame(url, fallbackCallback, successCallback)
  }
}
