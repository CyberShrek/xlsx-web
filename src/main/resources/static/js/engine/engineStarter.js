import "./tabsPad/tabsPadEngine.js"
import "./sheetPad/sheetsPadEngine.js"
import {sheetsPad, tabsPad} from "./usages.js"

sheetsPad.updateCellsIndexes()
// The first sheet will be selected
tabsPad.selectTab(document.querySelector("#tabs-pad .tab"))
