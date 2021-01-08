import cookie from '../cookie/cookie'

const ACTIVE_CLASS = 'cookie-notification--is-active'
const cookieNotificationElement = document.querySelector('[data-cookie-notification]')
const acceptButton = document.querySelector('[data-cookie-notification-accept-button')

function initCookieNotification() {
  if(!cookieNotificationElement) {
    return
  }

  if (!cookie('cookie-consent-seen')) {
    setTimeout(() => {

    showOffscreenMessage(cookieNotificationElement)
    }, 1500)
  }

  acceptButton.addEventListener('click', onAccept)
}

function onAccept() {
  cookie('cookie-consent-seen', true, 365)
  hideOffscreenMessage(cookieNotificationElement)
}

export function showOffscreenMessage(element) {
  element.removeAttribute('aria-hidden')
  element.classList.add(ACTIVE_CLASS)
  element.setAttribute('role', 'alert')
  element.setAttribute('aria-live', 'assertive')
}

export function hideOffscreenMessage(element) {
  element.setAttribute('aria-hidden', 'true')
  element.classList.remove(ACTIVE_CLASS)
  element.removeAttribute('role')
  element.removeAttribute('aria-live')
}


export default initCookieNotification
