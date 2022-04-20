import axios from 'axios'
import { oembedProviders } from './embedProviders'

const fetchOembed = async (url: string, endpoint: string): Promise<string | undefined> => {
  // Create URL for Oembed request
  const requestUrl = `${endpoint}?type=json&theme=dark&url=${encodeURIComponent(url)}`

  const resp = await axios
    .get(requestUrl)
    .then((r) => {
      return r.data.html
    })
    .catch((e) => console.error(e)) // eslint-disable-line no-console

  return resp
}

// https:\/\/twitter.com\/[\w,\d]+\/status\/[\w,\d]+
export const getEmbedData = async (url: string): Promise<string | undefined> => {
  // found is used to skip further matches via Array.some returning true after match
  let foundMarker = false
  let matchUrl = ''

  // Traverse the provider list and match to see if url is oembeddable
  oembedProviders.some((p) => {
    if (foundMarker) return foundMarker // no need to find we have foundMarker

    // Traverse provided endpoints
    p.endpoints.some((end) => {
      if (foundMarker) return foundMarker

      // Schemes provide Supported URLs
      // Traverse which scheme matches
      if (end.schemes) {
        end.schemes.some((s) => {
          if (foundMarker) {
            return foundMarker
          }

          // Create the regex from provided match string
          const regexString = s
            .replaceAll('/', '\\/') // escape /
            .replaceAll('.', '\\.') // escape .
            .replaceAll('*', '[\\w,\\d,\\=,\\?]+') // Replace * with words/digit

          const re = new RegExp(regexString)
          const match = url.match(re)

          // console.log(s, { foundMarker, re, match });

          // console.log({ s, matchUrl, re, url });
          if (match) {
          // We save the endpoint where we have to call for oembed data
          // console.log({ s, matchUrl, re, url });
            matchUrl = end.url
            foundMarker = true
          }

          return foundMarker
        })
      }
      return foundMarker
    })
    return foundMarker
  })

  // console.log({ matchUrl, url });
  if (matchUrl === '') return undefined

  // fetch Oembed Data
  return fetchOembed(url, matchUrl)
}
