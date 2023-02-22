/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */

export const nice = function (fn, errCallBack?: (e) => void) {
  try {
    return fn()
  } catch (e) {
    if (errCallBack) errCallBack(e)
    else console.error('Something went wrong', e)
  }
}

/**
 * Tries to execute an asynchronous function and discards any error that occurs.
 * @param {Function} fn - Asynchronous function that might or might not throw an error.
 * @returns {?*} Promise which resolves with the return-value of the asynchronous function when no error occurred.
 */
export const nicePromise = async function (fn, errCallBack?: (e) => void) {
  try {
    return await fn()
  } catch (e) {
    if (errCallBack) errCallBack(e)
    else console.error('Something went wrong', e)
  }
}
