import { type WorkerFunction, type WorkerModule } from '@workduck-io/mex-threads.js/types/worker'
import { expose, exposeShared } from '@workduck-io/mex-threads.js/worker'

import { mog } from '@mexit/core'

export const exposeX = (exposed: WorkerFunction | WorkerModule<any>) => {
  if ('SharedWorkerGlobalScope' in globalThis) {
    mog('ExposingSharedWorker', { type: 'SharedWorker' })
    exposeShared(exposed)
  } else {
    mog('ExposingWebWorker', { type: 'WebWorker' })
    expose(exposed)
  }
}
