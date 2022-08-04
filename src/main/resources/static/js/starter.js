import {workbook} from "./workbook/workbook.js"
import {addSortersToSheet} from "./engine/sorting.js"
import {addMatrixSelectorToSheet} from "./engine/matrixSelector.js"

workbook.sheets.forEach(sheet => {
    // Adding row's sorters to header cells
    addSortersToSheet(sheet)
    // Adding the cell selection mechanism
    addMatrixSelectorToSheet(sheet)
})

// Default
workbook.activeSheet = workbook.sheets[0]