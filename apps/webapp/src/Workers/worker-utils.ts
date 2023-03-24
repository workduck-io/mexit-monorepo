import { type WorkerFunction, type WorkerModule } from '@workduck-io/mex-threads.js/types/worker'
import { expose, exposeShared } from '@workduck-io/mex-threads.js/worker'

export const exposeX = (exposed: WorkerFunction | WorkerModule<any>) => {
  if ('SharedWorkerGlobalScope' in globalThis) {
    console.log('ExposingSharedWorker', { type: 'SharedWorker' })
    exposeShared(exposed)
  } else {
    console.log('ExposingWebWorker', { type: 'WebWorker' })
    expose(exposed)
  }
}
