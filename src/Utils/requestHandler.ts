import client from './fetchClient'

export const handleDwindleRequest = ({ requestMethod, URL, body }) => {
  if (requestMethod === 'POST') {
    return client
      .post(URL, body)
      .then((response) => {
        console.log('Response is: ', response)
        return { message: response, error: null }
      })
      .catch((err) => {
        return { message: null, error: err.response }
      })
  } else if (requestMethod === 'GET') {
    console.log('dpofhapsodfjasdfasd')
    return client
      .get(URL)
      .then((response) => {
        console.log('Response is: ', response)
        return { message: response, error: null }
      })
      .catch((err) => {
        return { message: null, error: err.response }
      })
  }
}
