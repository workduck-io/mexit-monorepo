import React, { useCallback, useEffect } from "react"
import { useSputlitContext, VisualState, VimiumState } from '../Hooks/useSputlitContext'
import { getKeys, getAllVisibleTags, incrementChar } from "../Utils/incrementChar";
import { getSingleKeyFunction, getMultiKeyFunctions, checkHintsPress } from "../Utils/Vimium";

function useVimium() {
    const { vimium, setVimium, visualState } = useSputlitContext();
    const multiKeyPress = {};
    const emptyData: {
        element: HTMLBaseElement
        lable: string
        possibleFalsePositive: boolean
        reason: null
        rect: {
            bottom: number
            top: number
            left: number
            right: number
            width: number
        }
        secondClassCitizen: boolean
    }[] = []
    let sentFlag = 0;
    const onKeyDownSinglekey = useCallback((e)=>{
        if(e.key === "Escape"){
            setVimium({visualState: true , linksData:emptyData});
        }
        else if (!vimium.visualState || vimium.linksData.length !== 0) {
        }
        else {
            const result = getSingleKeyFunction(e.key);
            if (result === 3) {
                setVimium({ visualState: false, linksData: emptyData })
            } else if (result === 2) {
                const eles: {
                    element: HTMLBaseElement
                    lable: string
                    possibleFalsePositive: boolean
                    reason: null
                    rect: {
                        bottom: number
                        top: number
                        left: number
                        right: number
                        width: number
                    }
                    secondClassCitizen: boolean
                }[] = getAllVisibleTags(false);
                let lable = 'AA'
                eles.forEach((ele) => {
                    ele.lable = lable;
                    lable = incrementChar(lable);
                })
                setVimium({ visualState: true, linksData: eles });
            }
        }
    },[vimium])
    const onKeyDownMultipleKey = useCallback((e: KeyboardEvent) => {
        if (vimium.visualState === false) return;
        if (multiKeyPress[e.key]) {
            multiKeyPress[e.key]++;
        } else {
            multiKeyPress[e.key] = 1;
        };
        let getMultiKey = "";
        if (sentFlag === 0) setTimeout(() => {
            sentFlag++;
            getMultiKey = getKeys(multiKeyPress)
            if (vimium.linksData.length === 0) getMultiKeyFunctions(getMultiKey);
            else {
                const result = checkHintsPress(getMultiKey, vimium.linksData);
                const eles: {
                    element: HTMLBaseElement
                    lable: string
                    possibleFalsePositive: boolean
                    reason: null
                    rect: {
                        bottom: number
                        top: number
                        left: number
                        right: number
                        width: number
                    }
                    secondClassCitizen: boolean
                }[] = []
                if (result === 1) {
                    setVimium({ visualState: true, linksData: eles });
                }
            }
            setTimeout(() => {
                sentFlag = 0;
                for (var ele in multiKeyPress) delete multiKeyPress[ele];
            }, 1000);
        }, 1000);
    },[vimium])
    const onKeyUpMultipleKey = useCallback((e: KeyboardEvent) => {
        setTimeout(() => {
            delete multiKeyPress[e.key]
        }, 1000)
    },[vimium])
    const resetVimium = useCallback((e) => {
        if(visualState === VisualState.showing){
            setVimium({ visualState: false, linksData: emptyData })
        }
        else if (vimium.linksData.length !== 0 || vimium.visualState === false) {
            setVimium({ visualState: true, linksData: emptyData });
        }
        if (e.target.nodeName === 'INPUT') {
            setVimium({ visualState: false, linksData: emptyData })
        }
    },[vimium, visualState])
    useEffect(() => {
        window.addEventListener('keydown',onKeyDownSinglekey)
        return (()=>window.removeEventListener("keydown",onKeyDownSinglekey))
    },[onKeyDownSinglekey])


    useEffect(() => {
        window.addEventListener('click',resetVimium)
        return (()=>window.removeEventListener("click",resetVimium))
    },[resetVimium])


    useEffect(() => {
        window.addEventListener('keydown',onKeyDownMultipleKey)
        return (()=>window.removeEventListener("keydown",onKeyDownMultipleKey))
    },[onKeyDownMultipleKey])

    
    useEffect(() => {
        window.addEventListener('keyup',onKeyUpMultipleKey)
        return (()=>window.removeEventListener("keyup",onKeyUpMultipleKey))
    },[onKeyUpMultipleKey])

    useEffect(()=>{
        if(visualState === VisualState.showing){
            setVimium({visualState: false, linksData: emptyData});
        }
        if(visualState === VisualState.hidden){
            setVimium({visualState: true, linksData: emptyData});
        }
    },[visualState])
}

export default useVimium;