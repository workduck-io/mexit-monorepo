import React, { useEffect } from "react"
import { useSputlitContext, VisualState } from '../Hooks/useSputlitContext'
import { getKeys, getAllVisibleTags, incrementChar } from "../Utils/incrementChar";
import { getSingleKeyFunction, getMultiKeyFunctions , checkHintsPress } from "../Utils/Vimium";

function useVimium() {
    const { vimium, setVimium, visualState } = useSputlitContext();
    const multiKeyPress = {};
    let sentFlag = 0;
    if (visualState !== VisualState.hidden) {
        setVimium({ ...vimium, visualState: VisualState.hidden });
        return;
    } else {
        const onKeyDownSinglekey = (e) => {
            const result = getSingleKeyFunction(e.key);
            if (result === 0) {
                setVimium({ ...vimium, visualState: VisualState.hidden });
            } else if (result === 2) {
                const eles: {
                    element: HTMLAllCollection
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
                console.log(eles);
                let lable = 'AA'
                eles.forEach((ele)=>{
                    ele.lable = lable;
                    lable = incrementChar(lable); 
                })
                setVimium({ ...vimium, linksData: eles });
            }
        }
        const onKeyDownMultipleKey = (e) => {
            if (multiKeyPress[e.key]) {
                multiKeyPress[e.key]++;
            } else {
                multiKeyPress[e.key] = 1;
            };
            let getMultiKey = "";
            if (sentFlag === 0) setTimeout(() => {
                sentFlag++;
                console.log(multiKeyPress);
                getMultiKey = getKeys(multiKeyPress)
                if(vimium.linksData.length === 0) getMultiKeyFunctions(getMultiKey);
                else checkHintsPress(getMultiKey, vimium.linksData);
                setTimeout(() => {
                    sentFlag = 0;
                    for (var ele in multiKeyPress) delete multiKeyPress[ele];
                }, 1000);
            }, 1000);
            // if(sentFlag === 1)setTimeout(() => sentFlag = 0, 1000);
        }
        const onKeyUpMultipleKey = (e) => {
            setTimeout(() => {
                delete multiKeyPress[e.key]
            }, 1000)
        }
        useEffect(() => {
            window.addEventListener('keydown', (e) => onKeyDownSinglekey(e))
            window.addEventListener('keydown', (e) => onKeyDownMultipleKey(e))
            window.addEventListener('keyup', (e) => onKeyUpMultipleKey(e))
        }, [vimium])
    }
}

export default useVimium;