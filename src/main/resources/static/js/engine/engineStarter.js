import "./tabsPad/tabsPadEngine.js"
import "./sheetPad/sheetsPadEngine.js"
import {tabsPad} from "./usages.js"

// The first sheet will be selected
tabsPad.selectTab(document.querySelector("#tabs-pad .tab"))
