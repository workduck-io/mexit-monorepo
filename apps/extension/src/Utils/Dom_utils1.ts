import Rect from "./Rect";

var DomUtils = {
    getClientRectsForAreas(imgClientRect: { width: any; height: any; left: any; top: any; }, areas: HTMLCollectionOf<HTMLAreaElement>) {
        const rects = [];
        for (let i = 0; i < areas.length; i++) {
            var x1: number, x2: any, y1: number, y2: any;
            const coords = areas[i].coords.split(",").map((coord: string) => parseInt(coord, 10));
            const shape = areas[i].shape.toLowerCase();
            if (["rect", "rectangle"].includes(shape)) { // "rectangle" is an IE non-standard.
                [x1, y1, x2, y2] = coords;
            } else if (["circle", "circ"].includes(shape)) { // "circ" is an IE non-standard.
                const [x, y, r] = coords;
                const diff = r / Math.sqrt(2); // Gives us an inner square
                x1 = x - diff;
                x2 = x + diff;
                y1 = y - diff;
                y2 = y + diff;
            } else if (shape === "default") {
                [x1, y1, x2, y2] = [0, 0, imgClientRect.width, imgClientRect.height];
            } else {
                // Just consider the rectangle surrounding the first two points in a polygon. It's possible to do
                // something more sophisticated, but likely not worth the effort.
                [x1, y1, x2, y2] = coords;
            }

            let rect = Rect.translate((Rect.create(x1, y1, x2, y2)), imgClientRect.left, imgClientRect.top);
            rect = this.cropRectToVisible(rect);

            if (rect && !isNaN(rect.top)) { rects.push({ element: areas[i], rect }); }
        }
        return rects;
    },
    cropRectToVisible(rect: { left: number; top: number; right: any; bottom: any; }) {
        const boundedRect = Rect.create(
            Math.max(rect.left, 0),
            Math.max(rect.top, 0),
            rect.right,
            rect.bottom
        );
        if ((boundedRect.top >= (window.innerHeight - 4)) || (boundedRect.left >= (window.innerWidth - 4))) {
            return null;
        } else {
            return boundedRect;
        }
    },
    isSelectable(element: { nodeName: string; type: string; isContentEditable: any; }) {
        if (!(element instanceof Element)) { return false; }
        const unselectableTypes = ["button", "checkbox", "color", "file", "hidden", "image", "radio", "reset", "submit"];
        return ((element.nodeName.toLowerCase() === "input") && (unselectableTypes.indexOf(element.type) === -1)) ||
            (element.nodeName.toLowerCase() === "textarea") || element.isContentEditable;
    },
    getVisibleClientRect(element: Element, testChildren: boolean) {
        // Note: this call will be expensive if we modify the DOM in between calls.
        let clientRect: { width: number; height: number; };
        if (testChildren == null) { testChildren = false; }
        const clientRects = ((() => {
            const result = [];
            const elements = element.getClientRects();
            for (let i = 0; i < elements.length; i++)result.push(Rect.copy(elements[i]));
            return result;
        })());

        // console.log("clientRects :" ,clientRects);

        // Inline elements with font-size: 0px; will declare a height of zero, even if a child with non-zero
        // font-size contains text.
        var isInlineZeroHeight = function () {
            const elementComputedStyle = window.getComputedStyle(element, null);
            const isInlineZeroFontSize = (0 === elementComputedStyle.getPropertyValue("display").indexOf("inline")) &&
                (elementComputedStyle.getPropertyValue("font-size") === "0px");
            // Override the function to return this value for the rest of this context.
            isInlineZeroHeight = () => isInlineZeroFontSize;
            return isInlineZeroFontSize;
        };

        for (clientRect of clientRects) {
            // If the link has zero dimensions, it may be wrapping visible but floated elements. Check for this.
            var computedStyle: CSSStyleDeclaration;
            if (((clientRect.width === 0) || (clientRect.height === 0)) && testChildren) {

                for (let child of Array.from(element.children)) {
                    var needle: any;
                    computedStyle = window.getComputedStyle(child, null);
                    // Ignore child elements which are not floated and not absolutely positioned for parent elements
                    // with zero width/height, as long as the case described at isInlineZeroHeight does not apply.
                    // NOTE(mrmr1993): This ignores floated/absolutely positioned descendants nested within inline
                    // children.
                    const position = computedStyle.getPropertyValue("position");
                    if ((computedStyle.getPropertyValue("float") === "none") &&
                        !((["absolute", "fixed"].includes(position))) &&
                        !((clientRect.height === 0) && isInlineZeroHeight() &&
                            (0 === computedStyle.getPropertyValue("display").indexOf("inline")))) {
                        continue;
                    }
                    const childClientRect = this.getVisibleClientRect(child, true);
                    // console.log("childClientRect :", childClientRect);
                    if ((childClientRect === undefined) || (childClientRect[0].width < 3) || (childClientRect[0].height < 3)) { continue; }
                    return childClientRect;
                };

            } else {
                clientRect = this.cropRectToVisible(clientRect);

                if ((clientRect === null) || (clientRect.width < 3) || (clientRect.height < 3)) { continue; }

                // eliminate invisible elements (see test_harnesses/visibility_test.html)
                computedStyle = window.getComputedStyle(element, null);
                if (computedStyle.getPropertyValue('visibility') !== 'visible') { continue; }
                // console.log("clientRect final :" ,clientRect);
                return clientRect;
            }
        }
    },
    getViewportTopLeft() {
        const box = document.documentElement;
        const style = getComputedStyle(box);
        const rect = box.getBoundingClientRect();
        if ((style.position === "static") && !/content|paint|strict/.test(style.contain || "")) {
            // The margin is included in the client rect, so we need to subtract it back out.
            const marginTop = parseInt(style.marginTop);
            const marginLeft = parseInt(style.marginLeft);
            return { top: -rect.top + marginTop, left: -rect.left + marginLeft };
        } else {
            let clientLeft, clientTop;
            // # TODO rectify this if else 
            // if (Utils.isFirefox()) {
            //     // These are always 0 for documentElement on Firefox, so we derive them from CSS border.
            //     clientTop = parseInt(style.borderTopWidth);
            //     clientLeft = parseInt(style.borderLeftWidth);
            // } else {
            // }
            ({ clientTop, clientLeft } = box);
            return { top: -rect.top - clientTop, left: -rect.left - clientLeft };
        }
    },
}

// var Utils = {
//     isFirefox: (function() {
//         // We want this browser check to also cover Firefox variants, like LibreWolf. See #3773.
//         const isFirefox = typeof InstallTrigger !== 'undefined';
//         return () => isFirefox;
//       })(),
// }

export default DomUtils;
