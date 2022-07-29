import {ElementHolder} from "./ElementHolder.js"
import {Cell} from "./Cell";

export class Row extends ElementHolder{
    cells = []
    index

    constructor(rowElement) { super(rowElement)
        rowElement.querySelector("td").forEach(cell => this.cells.push(new Cell(cell)))
        this.index = rowElement.rowIndex
    }
}