const data = {
  LinkedIN: {
    name: '//h1[@class="text-heading-xlarge inline t-24 v-align-middle break-words"]',
    headline: '//div[@class="text-body-medium break-words"]',
    location: '//span[@class="text-body-small inline t-black--light break-words"]',
    currentCompany: '//*[@id="ember31"]/div[2]/div[2]/ul/li[1]/a/h2/div',
    education: '//*[@id="ember31"]/div[2]/div[2]/ul/li[2]/a/h2/div'
  },
  Instagram: {
    name: '//h2[@class="_aacl _aacs _aact _aacx _aada"]'
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
const sendData = []
const getUserData = async () => {
  const url = window.location.href
  // console.log(url)
  let webPage = await checkURL(url)
  // console.log('webPage :', webPage)
  if (webPage !== null) {
    for (let key in data) {
      if (key === webPage) {
        for (var d in data[key]) {
          const ele = document.evaluate(data[key][d], document, null, XPathResult.ANY_TYPE, null).iterateNext()
          sendData[d] = ele.textContent.trim()
        }
      }
    }
  }
  return sendData
}
const getLinks = () => {
  return getUserData()
}
export default getLinks
