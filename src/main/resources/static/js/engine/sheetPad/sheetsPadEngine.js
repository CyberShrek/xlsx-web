import "./sortingGear.js"
import "./matrixSelector.js"
import {sheetsPad} from "../usages.js";

sheetsPad.updateCellsIndexes = () => {
    sheetsPad.querySelectorAll(".sheet").forEach(sheet => {
        const rows = sheet.querySelectorAll("tr")
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll("td")
            for (let j = 0; j < cells.length; j++) {
                cells[j].columnId = j
                cells[j].rowId = i
            }
        }
    })
}
