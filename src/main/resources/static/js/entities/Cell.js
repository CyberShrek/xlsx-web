import {ElementHolder} from "./ElementHolder.js"

export class Cell extends ElementHolder {
    rowIndex
    colIndex

    constructor(cellElement) { super(cellElement)
        this.rowIndex = cellElement.closest("tr").rowIndex
        this.colIndex = cellElement.cellIndex
    }
}