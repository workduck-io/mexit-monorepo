import { expose } from 'threads/worker'
import { sha256 } from 'js-sha256'

// const { expose } = require('threads')
// const { sha256 } = require('js-sha256')

expose({
  hashPassword(password) {
    return sha256(password + 'salt')
  }
})
