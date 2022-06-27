import React from 'react'
import { useSputlitContext } from '../../Hooks/useSputlitContext'

const ShortCutLinks = () => {
  const { vimium } = useSputlitContext()
  return (
    <>
      {vimium.linksData ? (
        vimium.linksData.map((ele) => {
          return (
            <div
              style={{
                position: 'absolute',
                display: 'block',
                fontSize: '11px',
                left: `${ele.rect.left}` + 'px',
                top: `${ele.rect.top}` + 'px',
                visibility: 'visible',
                zIndex: '99999',
                color: 'black',
                background:
                  '-webkit-gradient(linear, left top, left bottom, color-stop(0%,#FFF785), color-stop(100%,#FFC542))',
                border: 'solid 1px #C38A22',
                borderRadius: '3px',
                boxShadow: '0px 3px 7px 0px rgb(0 0 0 / 30%)',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {ele.lable}
            </div>
          )
        })
      ) : (
        <></>
      )}
    </>
  )
}

export default ShortCutLinks
