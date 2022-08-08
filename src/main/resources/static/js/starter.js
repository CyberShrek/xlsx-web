import {tabsPad, workbook} from "./workbook/workbook.js"
import {addSortersToSheet} from "./engine/sortingGear.js"
import {addMatrixSelectorToSheet} from "./engine/matrixSelector.js"

// Starting the sheets pad
workbook.sheets.forEach(sheet => {
    workbook.defineSheet(sheet)
    addSortersToSheet(sheet)
    addMatrixSelectorToSheet(sheet)
})

// Starting the tabs pad
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => {
        workbook.activeSheet = workbook.getSheetByName(tab.textContent)
    }))

// The sheet selected by default
workbook.activeSheet = workbook.sheets[0]