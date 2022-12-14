import '@workduck-io/mex-threads.js/register'

import React from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal'

import App from './App'

const root = createRoot(document.getElementById('root'))
Modal.setAppElement('#root')

root.render(<App />)
