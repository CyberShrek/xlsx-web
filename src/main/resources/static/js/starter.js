import {sheetsPad} from "./entities/Workbook.js"
import {tabsPad} from "./engine/tabsPad.js"
import "./engine/sortingGear.js"
import "./engine/matrixSelector.js"

sheetsPad.getSheets().forEach(sheet => sheetsPad.updateCellsCoordinatesInSheet(sheet))
tabsPad.selectSheet(document.querySelector("#tabs-pad .tab"))
