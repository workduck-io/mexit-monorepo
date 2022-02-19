const chromeStorageLocal = chrome.storage.local

// Config the chromeStorageLocal backend, using options set in the config.
// REFER : https://developer.chrome.com/extensions/storage
function _initStorage(options) {
  const dbInfo: any = {}
  if (options) {
    for (const i in options) {
      dbInfo[i] = options[i]
    }
  }

  dbInfo.keyPrefix = dbInfo.name + '/'

  this._dbInfo = dbInfo
  return Promise.resolve()
}

function clear(callback) {
  const promise = new Promise<void>(function (resolve, reject) {
    this.ready()
      .then(function () {
        chromeStorageLocal.clear(function () {
          resolve()
        })
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function getItem(key, callback) {
  // Cast the key to a string, as that's all we can set as a key.
  if (typeof key !== 'string') {
    window.console.warn(key + ' used as a key, but it is not a string.')
    key = String(key)
  }

  const promise = new Promise<void>(function (resolve, reject) {
    this.ready()
      .then(function () {
        try {
          const dbInfo = this._dbInfo
          const prefixedKey = dbInfo.keyPrefix + key
          chromeStorageLocal.get(prefixedKey, function (data) {
            if (data[prefixedKey]) {
              const result = _deserialize(data[prefixedKey])
              resolve(result)
            } else {
              resolve()
            }
          })
        } catch (e) {
          reject(e)
        }
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function iterate(callback) {
  const promise = new Promise<void>(function (resolve, reject) {
    this.ready()
      .then(function () {
        try {
          let db = {}
          chromeStorageLocal.get(null, function (data) {
            db = data

            for (const key in db) {
              let result = db[key]

              if (result) {
                result = _deserialize(result)
              }

              callback(result, key)
            }

            resolve()
          })
        } catch (e) {
          reject(e)
        }
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function key(n, callback) {
  const promise = new Promise(function (resolve, reject) {
    this.ready()
      .then(function () {
        let db = {}
        chromeStorageLocal.get(null, function (data) {
          db = data
          let result = null
          let index = 0

          for (const key in db) {
            if (Object.prototype.hasOwnProperty.call(db, key) && db[key] !== undefined) {
              if (n === index) {
                result = key
                break
              }
              index++
            }
          }

          resolve(result)
        })
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function keys(callback) {
  const promise = new Promise(function (resolve, reject) {
    this.ready()
      .then(function () {
        let db = {}
        chromeStorageLocal.get(null, function (data) {
          db = data
          const keys = []

          for (const key in db) {
            if (Object.prototype.hasOwnProperty.call(db, key)) {
              keys.push(key)
            }
          }

          resolve(keys)
        })
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function length(callback) {
  const promise = new Promise(function (resolve, reject) {
    this.keys()
      .then(function (keys) {
        resolve(keys.length)
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function removeItem(key, callback) {
  // Cast the key to a string, as that's all we can set as a key.
  if (typeof key !== 'string') {
    window.console.warn(key + ' used as a key, but it is not a string.')
    key = String(key)
  }

  const promise = new Promise<void>(function (resolve, reject) {
    this.ready()
      .then(function () {
        const dbInfo = this._dbInfo
        const prefixedKey = dbInfo.keyPrefix + key

        chromeStorageLocal.remove(prefixedKey, function () {
          resolve()
        })
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

function setItem(key, value, callback) {
  // Cast the key to a string, as that's all we can set as a key.
  if (typeof key !== 'string') {
    window.console.warn(key + ' used as a key, but it is not a string.')
    key = String(key)
  }

  const promise = new Promise(function (resolve, reject) {
    this.ready()
      .then(function () {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
          value = null
        }

        // Save the original value to pass to the callback.
        const originalValue = value

        _serialize(value, function (value, error) {
          if (error) {
            reject(error)
          } else {
            try {
              const dbInfo = this._dbInfo
              const prefixedKey = dbInfo.keyPrefix + key
              const obj = {}
              obj[prefixedKey] = value

              chromeStorageLocal.set(obj, function () {
                resolve(originalValue)
              })
            } catch (e) {
              reject(e)
            }
          }
        })
      })
      .catch(reject)
  })

  executeCallback(promise, callback)
  return promise
}

// _deserialize : chrome storage automatically serializes objects
function _serialize(value, callback) {
  /*
        Hack fix... chrome.storage.local serializer stores functions on an object into the storage area as:
          {testFunction: {}}
        stringify & parse gets rid of these
      */
  callback(JSON.parse(JSON.stringify(value)))
}

// _deserialize : chrome storage automatically deserializes objects
function _deserialize(value) {
  return value
}

function executeCallback(promise, callback) {
  if (callback) {
    promise.then(
      function (result) {
        callback(null, result)
      },
      function (error) {
        callback(error)
      }
    )
  }
}

const chromeStorageLocalDriver: any = {
  _driver: 'chromeStorageLocalDriver',
  _initStorage: _initStorage,
  // _supports: function() { return true; }
  iterate: iterate,
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
  clear: clear,
  length: length,
  key: key,
  keys: keys
}

export default chromeStorageLocalDriver
