import { elementToHtml } from "@udecode/plate";
import { toUpper } from "lodash";

function getSingleKeyFunction(e: KeyboardEvent) {
    if(e.ctrlKey){
        return -1;
    }
    else if (e.key === "k") {
        window.scrollTo(window.pageXOffset, window.pageYOffset - 100);
        return 1;
    }
    else if (e.key === "j") {
        window.scrollTo(window.pageXOffset, window.pageYOffset + 100);
        return 1;
    }
    else if (e.key === "h") {
        window.scrollTo(window.pageXOffset - 100, window.pageYOffset);
        return 1;
    }
    else if (e.key === "l") {
        window.scrollTo(window.pageXOffset + 100, window.pageYOffset);
        return 1;
    }
    else if (e.key === "d") {
        window.scrollTo(window.pageXOffset, window.pageYOffset + window.innerHeight / 2);
        return 1;
    }
    else if (e.key === "u") {
        window.scrollTo(window.pageXOffset, window.pageYOffset - window.innerHeight / 2);
        return 1;
    }
    else if (e.key === "r") {
        location.reload();
        return 1;
    }
    else if (e.key === "f") {
        return 2;
    }
    else if (e.key === "i") {
        return 3;
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
}[]) {
    let val = 0;
    data.map((d) => {
        if (string === d.lable || toUpper(string) === d.lable) {
            d.element.style.border = "thick solid #53BDEB";
            setTimeout(()=>{
                console.log(d);
                window.open(d.element.href, "_blank");
                d.element.style.border = "";
            }, 400)
            val++;
        }
    })
    return val;
}

export { getSingleKeyFunction, getMultiKeyFunctions, checkHintsPress }