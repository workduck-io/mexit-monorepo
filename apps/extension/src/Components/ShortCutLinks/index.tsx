import React, { useEffect } from 'react'
// import useShortcutStore from '../../Stores/useShortcutLinks'
import { incrementChar } from '../../Utils/incrementChar';


const ShortCutLinks = () => {
  const [ hints , setHints] = React.useState<number>(1);
  const [allHref1, setAllHref1] = React.useState([])
  // const [top , setTop] = React.useState(0);
  let keyString = {};
  const keydown = (e) => {
    keyString[e.key] = true;
    setTimeout(() => checkVal(), 1000);
  }
  const keyup = (e) => {
    setTimeout(() => delete keyString[e.key], 1000);
  }
  function checkVal() {
    let stringPress = '';
    for (const key in keyString) {
      if (key !== 'Alt') {
        if (key !== 'Shift') {
          if (key !== 'CapsLock') {
            if (key !== 'Ctrl') {
              stringPress += key;
            }
          }
        }
      }
    }
    allHref1.forEach(e => {
      if (e.charIndex === stringPress) {
        window.open(e.link, "_blank");
        stringPress = '';
        keyString = {};
        setAllHref1([]);
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("keyup", keyup);
      }
    })
  }
  function listenForHints() {
    if(hints === 1){
    window.addEventListener("keydown",(e) => keydown(e))
    window.addEventListener("keyup",(e) => keyup(e))
    }
  }

  const doFunction = (e: KeyboardEvent) => {
    if(e.key === "f" && allHref1.length !== 0){
      setAllHref1([]);
    }
    else if (e.key === "f" && hints === 1) {
      setAllHref1([]);
      const allATags: { link: string, top: number, left: number , right: number ,  bottom: number}[] = [];
      const screen = {
        top: window.pageYOffset,
        bottom: window.innerHeight + window.pageYOffset
      }
      document.querySelectorAll('a').forEach((e , i)=>{
        const pos = e.getBoundingClientRect();
        allATags[i] = ({ link : e.href , top : pos.top ,left : pos.left , right: pos.right , bottom: pos.bottom });
      })
      let indexChar = '';
      let index = 0;
      let allHref: { charIndex: string, link: string, x: number, y: number }[] = [];
      const multiplier = ((screen.top / window.innerHeight) - 1) * window.innerHeight;
      allATags.forEach( e => {
        if(e.link !== ''){
          if(e.top >0 && e.bottom < screen.bottom){
            indexChar = incrementChar(indexChar);
            const link = e.link;
            const x = (e.left + e.right)/2 ;
            const y =  (e.top + e.bottom)/2 + window.innerHeight;
            allHref[index++] = ({charIndex: indexChar, link: link, x : x, y : y + multiplier })
          }
        }
      })
      setAllHref1(allHref);
      listenForHints();
    }
  }
  function checkTyping(event){
    if(event.target.nodeName === "INPUT"){
      setHints(0);
      console.log(hints);
    }else{
      setAllHref1([]);
      setHints(1);
    }
  }
  useEffect(()=>{
    window.addEventListener("click", checkTyping)
  }, [hints])
  useEffect(() => {
    // if(allHref1.length !== 0)return;
    if(allHref1.length !==0){
      listenForHints()
    }
    console.log("hints is:" , hints);
    if(hints === 1){
    window.addEventListener("keydown", doFunction);
    }
    return () => {
      window.removeEventListener("keydown",doFunction);
    }
  }, [allHref1, hints])
  return (
    <>
      Shortcut links
      <div style={{ width: "100vw", height: "100vh", position: "relative" , top:`${window.pageYOffset}` + "px", left : 0 }}>
        {allHref1.length !== 0 ? (allHref1.map((ele) => {
          return (
            <span style={{
              position: 'absolute', display: 'block',fontSize:"8pt", left: `${ele.x}` + "px", top: `${ele.y}` + "px", visibility: "visible", zIndex: "99999", color: "black", background: "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#FFF785), color-stop(100%,#FFC542))", border: "solid 1px #C38A22",borderRadius: "3px",boxShadow: "0px 3px 7px 0px rgb(0 0 0 / 30%)"
            }}>{ele.charIndex}</span>
          )
        })) : <></>
        }
      </div>
    </>
  )
}

export default ShortCutLinks