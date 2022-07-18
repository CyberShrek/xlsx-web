import {TabsPadEngine} from "./tabsPad/TabsPadEngine.js"
import {SheetsPadEngine} from "./sheetPad/SheetsPadEngine.js"

// Late initialization:
window.onload = () => {
    const tabsPadEngine   = new TabsPadEngine()
    const sheetsPadEngine = new SheetsPadEngine()
    // By default, the first sheet will be selected
    tabsPadEngine.selectTab(document.querySelector("#tabs-pad .tab"))
}