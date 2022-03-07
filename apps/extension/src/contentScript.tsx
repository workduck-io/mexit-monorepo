// Any kind of DOM manipulation is done here.
import React from 'react'
import ReactDOM from 'react-dom'

import Index from '.'

const overlay = document.createElement('div')
overlay.id = 'extension-root'
document.body.appendChild(overlay)

ReactDOM.render(<Index />, overlay)

// TODO: add this in InternalComponents.tsx
// document.onkeyup = (e) => {
//   if (e.key == 'Escape' && document.getElementById('extension-root')) {
//     // closeSputlit()
//     ReactDOM.unmountComponentAtNode(document.getElementById('tooltip-root'))
//   }
// }
