import React, { useEffect } from 'react'
// import useShortcutStore from '../../Stores/useShortcutLinks'
import { incrementChar } from '../../Utils/incrementChar'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { toLower } from 'lodash'

const ShortCutLinks = () => {
  const { vimium, setVimium, visualState } = useSputlitContext();
  // const allATags: { link: string; top: number; left: number; right: number; bottom: number, ele : HTMLAnchorElement }[] = []
  // let allHref: { charIndex: string;lowerChar:string; link: string; x: number; y: number , ele : HTMLAnchorElement}[] = []
  // const { visualState } = useSputlitContext()
  // const [hints, setHints] = React.useState<number>(1)
  // const [allHref1, setAllHref1] = React.useState([])
  // // const [top , setTop] = React.useState(0);
  // let keyString = {}
  // const keydown = (e) => {
  //   keyString[e.key] = true
  //   setTimeout(() => checkVal(), 1000)
  // }
  // const keyup = (e) => {
  //   setTimeout(() => delete keyString[e.key], 1000)
  // }
  // function checkVal() {
  //   let stringPress = ''
  //   console.log('keystring', keyString)
  //   for (const key in keyString) {
  //     if (key !== 'Alt') {
  //       if (key !== 'Shift') {
  //         if (key !== 'CapsLock') {
  //           if (key !== 'Ctrl') {
  //             stringPress += key
  //           }
  //         }
  //       }
  //     }
  //   }
  //   allHref1.forEach((e) => {
  //     if (e.charIndex === stringPress || e.lowerChar === stringPress) {
  //       setAllHref1([])
  //       allHref.length = 0;
  //       allATags.length = 0;
  //       e.ele.style.border = "thick solid #93B5C6"
  //       stringPress = ''
  //       keyString = {}
  //       console.log(e.ele);
  //       setTimeout(() => {
  //         e.ele.style.border = ""
  //         window.open(e.link, '_blank')
  //       },150)
  //       window.removeEventListener('keydown', keydown)
  //       window.removeEventListener('keyup', keyup)
  //     }
  //   })
  // }
  // function listenForHints() {
  //   if (hints === 1) {
  //     window.addEventListener('keydown', (e) => keydown(e))
  //     window.addEventListener('keyup', (e) => keyup(e))
  //   }
  // }

  // const doFunction = (e: KeyboardEvent) => {
  //   allHref.length = 0;
  //   allATags.length = 0;
  //   if (e.key === 'f' && allHref1.length !== 0) {
  //     setAllHref1([])
  //   } else if (e.key === 'f' && hints === 1) {
  //     setAllHref1([])
  //     const screen = {
  //       top: window.pageYOffset,
  //       bottom: window.innerHeight + window.pageYOffset
  //     }
  //     document.querySelectorAll('a').forEach((e, i) => {
  //       const pos = e.getBoundingClientRect()
  //       allATags[i] = { link: e.href, top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom , ele : e }
  //     })
  //     let indexChar = 'AA'
  //     let index = 0
  //     const multiplier = (screen.top / window.innerHeight - 1) * window.innerHeight
  //     allATags.forEach((e) => {
  //       if (e.link !== '') {
  //         if (e.top > 0 && e.bottom < screen.bottom) {
  //           indexChar = incrementChar(indexChar)
  //           const lowerChar = toLower(indexChar)
  //           const link = e.link
  //           const x = e.right;
  //           const y = (e.top + e.bottom) / 2 + window.innerHeight
  //           allHref[index++] = { charIndex: indexChar ,lowerChar : lowerChar, link: link, x: x, y: y + multiplier , ele : e.ele}
  //         }
  //       }
  //     })
  //     setAllHref1(allHref)
  //     listenForHints();
  //   }
  // }
  // function checkTyping(event) {
  //   setAllHref1([])
  //   allHref.length = 0;
  //   allATags.length = 0;
  //   if (event.target.nodeName === 'INPUT' || visualState === VisualState.showing) {
  //     setHints(0)
  //     console.log(hints)
  //   } else {
  //     setHints(1)
  //   }
  // }
  // useEffect(() => {
  //   window.addEventListener('click', checkTyping)
  //   return () => {
  //     window.removeEventListener('click', checkTyping)
  //   }
  // }, [hints , visualState])
  // useEffect(() => {
  //   // if(allHref1.length !== 0)return;
  //   if (allHref1.length !== 0) {
  //     listenForHints()
  //   }
  //   if (hints === 1 && visualState == VisualState.hidden) {
  //     window.addEventListener('keydown', doFunction)
  //   }
  //   return () => {
  //     window.removeEventListener('keydown', doFunction)
  //   }
  // }, [allHref1, hints, visualState])
  return (
    <>
      <div style={{ width: '100vw', height: '100vh', top: `${window.pageYOffset}` + 'px', left: 0 }}>
        {vimium.linksData ?
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
                whiteSpace: "nowrap",
                overflow: "hidden"
              }}>
                {ele.lable}
              </div>
            )
          })
          : <></>}
      </div>
    </>
  )
}

export default ShortCutLinks
