import { toUpper } from "lodash";

function getSingleKeyFunction(key: string) {
    if (key === "k") {
        window.scrollTo(window.pageXOffset, window.pageYOffset - 100);
        return 1;
    }
    else if (key === "j") {
        window.scrollTo(window.pageXOffset, window.pageYOffset + 100);
        return 1;
    }
    else if (key === "h") {
        window.scrollTo(window.pageXOffset - 100, window.pageYOffset);
        return 1;
    }
    else if (key === "l") {
        window.scrollTo(window.pageXOffset + 100, window.pageYOffset);
        return 1;
    }
    else if (key === "d") {
        window.scrollTo(window.pageXOffset, window.pageYOffset + window.innerHeight / 2);
        return 1;
    }
    else if (key === "u") {
        window.scrollTo(window.pageXOffset, window.pageYOffset - window.innerHeight / 2);
        return 1;
    }
    else if (key === "r") {
        location.reload();
        return 1;
    }
    else if (key === "f") {
        return 2;
    }
    else if (key === "i") {
        return 0;
    } else {
        return -1;
    }
}

function getMultiKeyFunctions(string: string) {
    // if (visualState !== VisualState.hidden) return;

    if (string === "gg") {
        window.scrollTo(window.pageXOffset, 0);
    }
    else if (string === "G") {
        window.scrollTo(window.pageXOffset, document.body.scrollHeight);
    }
    else if (string === "yy") {
        console.log("Manav")
        chrome.runtime.sendMessage(
            {
                type: 'ASYNC_ACTION_HANDLER',
                subType: 'GET_CURRENT_TAB'
            },
            (response) => {
                const Url = response.message[0].url;
                navigator.clipboard.writeText(Url);
            }
        )
    }
    else if (string === "gs") {
        chrome.runtime.sendMessage(
            {
                type: 'ASYNC_ACTION_HANDLER',
                subType: 'GET_CURRENT_TAB'
            },
            (response) => {
                const newUrl = "view-source:" + response.message[0].url;
                chrome.runtime.sendMessage(
                    {
                        type: 'ASYNC_ACTION_HANDLER',
                        subType: 'OPEN_WITH_NEW_TABS',
                        data: {
                            urls: newUrl
                        }
                    },
                    (response) => {
                        const { message, error } = response
                        if (error) console.error('Some error occured. Please Try Again')
                    }
                )
            }
        )
    }
}

function checkHintsPress(string: string, data: {
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
}[]) {
    data.forEach((data) => {
        if(string === data.lable || toUpper(string) === data.lable){
            // window.open(data.element.)
            console.log(data.element);
        }
    })
}

// function useVimium() {
//     const { visualState } = useSputlitContext()
//     const [toggleVimium, setToggleVimium] = React.useState<boolean>(true);
//     let keyString = {};
//     function doFunction(string: String, visualState: VisualState) {
//         console.log(visualState);
//         if (visualState === VisualState.showing) {
//             console.log("Visual State is showinG");
//             return;
//         }
//         if (string === "k") {
//             window.scrollTo(window.pageXOffset, window.pageYOffset - 100);
//         }
//         else if (string === "j") {
//             window.scrollTo(window.pageXOffset, window.pageYOffset + 100);
//         }
//         else if (string === "h") {
//             window.scrollTo(window.pageXOffset - 100, window.pageYOffset);
//         }
//         else if (string === "l") {
//             window.scrollTo(window.pageXOffset + 100, window.pageYOffset);
//         }
//         else if (string === "d") {
//             window.scrollTo(window.pageXOffset, window.pageYOffset + window.innerHeight / 2);
//         }
//         else if (string === "u") {
//             window.scrollTo(window.pageXOffset, window.pageYOffset - window.innerHeight / 2);
//         }
//         else if (string === "r") {
//             location.reload();
//         }
//         else if (string === "i") {
//             setToggleVimium(false);
//         }
//     }
//     function doFunction1(string: String) {
//         if (visualState !== VisualState.hidden) return;
//         if (string === "gg") {
//             window.scrollTo(window.pageXOffset, 0);
//         }
//         else if (string === "G") {
//             window.scrollTo(window.pageXOffset, document.body.scrollHeight);
//         }
//         else if (string === "yy") {
//             console.log("Manav")
//             chrome.runtime.sendMessage(
//                 {
//                     type: 'ASYNC_ACTION_HANDLER',
//                     subType: 'GET_CURRENT_TAB'
//                 },
//                 (response) => {
//                     const Url = response.message[0].url;
//                     navigator.clipboard.writeText(Url);
//                 }
//             )
//         }
//         else if (string === "gs") {
//             chrome.runtime.sendMessage(
//                 {
//                     type: 'ASYNC_ACTION_HANDLER',
//                     subType: 'GET_CURRENT_TAB'
//                 },
//                 (response) => {
//                     const newUrl = "view-source:" + response.message[0].url;
//                     chrome.runtime.sendMessage(
//                         {
//                             type: 'ASYNC_ACTION_HANDLER',
//                             subType: 'OPEN_WITH_NEW_TABS',
//                             data: {
//                                 urls: newUrl
//                             }
//                         },
//                         (response) => {
//                             const { message, error } = response
//                             if (error) console.error('Some error occured. Please Try Again')
//                         }
//                     )
//                 }
//             )
//         }
//     }
//     function checkTyping(event) {
//         if (event.target.nodeName === "INPUT") {
//             setToggleVimium(false);
//         } else {
//             setToggleVimium(true);
//         }
//     }
//     useEffect(() => {
//         window.addEventListener("click", checkTyping)
//     }, [toggleVimium])
//     function checkVal() {
//         // console.log(keyString);
//         let stringPress = '';
//         for (const key in keyString) {
//             if (key !== 'Alt') {
//                 if (key !== 'Shift') {
//                     if (key !== 'CapsLock') {
//                         if (key !== 'Ctrl') {
//                             // stringPress += key;
//                             for (let i = 0; i < keyString[key]; i++) {
//                                 stringPress += key;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//         doFunction1(stringPress);
//     }
//     const keydown = (e) => {
//         if (e.key === "escape") {
//             setToggleVimium(true);
//         }
//         if (toggleVimium) {
//             if (keyString[e.key]) {
//                 keyString[e.key]++;
//             } else {
//                 keyString[e.key] = 1;
//             };
//             setTimeout(() => checkVal(), 1000);
//         }
//     }
//     const keyup = (e) => {
//         if (e.key === "escape") {
//             setToggleVimium(true);
//         }
//         if (toggleVimium) {
//             setTimeout(() => delete keyString[e.key], 1000);
//         }
//     }
//     useEffect(() => {
//         console.log(visualState);
//     }, [visualState]);
//     useEffect(() => {
//         console.log(visualState);
//         if (visualState === VisualState.hidden) {
//             window.addEventListener("keydown", (e) => keydown(e))
//             window.addEventListener("keydown", (e) => doFunction(e.key, visualState))
//             window.addEventListener("keyup", (e) => keyup(e))
//         }
//         return () => {
//             window.removeEventListener("keydown", keydown);
//             window.removeEventListener("keyup", keyup);
//         }
//     }, [visualState, toggleVimium])
// }

export { getSingleKeyFunction, getMultiKeyFunctions, checkHintsPress }