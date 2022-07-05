const data = {
  LinkedIN: {
    name: 'text-heading-xlarge inline t-24 v-align-middle break-words',
    headline: 'text-body-medium break-words',
    location: 'text-body-small inline t-black--light break-words',
    currentCompany:
      'inline-show-more-text inline-show-more-text--is-collapsed inline-show-more-text--is-collapsed-with-line-clamp inline',
    education:
      'inline-show-more-text inline-show-more-text--is-collapsed inline-show-more-text--is-collapsed-with-line-clamp inline ha-selection'
  },
  Instagram: {
    name: '_aacl _aacs _aact _aacx _aada'
  }
}
const ValidUrl = {
  1: {
    WebPage: 'LinkedIN',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/
  },
  2: {
    WebPage: 'Instagram',
    regex: /^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\//
  }
}
const checkURL = (url) => {
  for (var key in ValidUrl) {
    if (url.match(ValidUrl[key].regex)) {
      return ValidUrl[key].WebPage
    }
  }
  return null
}
const getUserData = () => {
  const url = window.location.href
  console.log(url)
  let webPage = checkURL(url)
  console.log("webPage :",webPage);
  if (webPage !== null) {
    for (let key in data) {
      if (key === webPage) {
        for (var d in data[key]) {
          console.log(d + ':' + document.getElementsByClassName(data[key][d])[0].textContent)
        }
      }
    }
  }
}
const getLinks = () => {
  document.addEventListener('visibilitychange', () => {
    getUserData()
  })
  window.onload = () => {
    console.log('Window is loaded successfully')
    getUserData()
  }
}
export default getLinks
