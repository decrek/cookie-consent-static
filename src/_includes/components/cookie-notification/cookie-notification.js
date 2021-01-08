import cookie from '../cookie/cookie'

const HIDDEN_CLASS = 'cookie-notification--is-hidden'
const cookieNotificationElement = document.querySelector('[data-cookie-notification]')
const acceptButton = document.querySelector('[data-cookie-notification-accept-button')

function initCookieNotification() {
  if(!cookieNotificationElement) {
    return
  }

  acceptButton.addEventListener('click', onAccept)
}

function onAccept() {
  cookie('cookie-consent-seen', true, 365)
  hideOffscreenMessage(cookieNotificationElement)
}

export function hideOffscreenMessage(element) {
  element.setAttribute('aria-hidden', 'true')
  element.classList.add(HIDDEN_CLASS)
  element.removeAttribute('role')
  element.removeAttribute('aria-live')
}


export default initCookieNotification
