import "./sortingGear.js"
import "./matrixSelector.js"
import {sheetsPad} from "../usages.js";


sheetsPad.getActiveSheet = () => {
    return sheetsPad.querySelector(".sheet.active")
}