import { ServerResponse } from 'http'

/**
 * A utility function to stream a ReadableStream to a Node.js response-like object.
 */
export function streamToResponse(
  res: ReadableStream,
  response: ServerResponse,
  init?: { headers?: Record<string, string>; status?: number }
) {
  response.writeHead(init?.status || 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    ...init?.headers
  })

  const reader = res.getReader()
  function read() {
    reader.read().then(({ done, value }: { done: boolean; value?: any }) => {
      if (done) {
        response.end()
        return
      }
      response.write(value)
      read()
    })
  }
  read()
}
