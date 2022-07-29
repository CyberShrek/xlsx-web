import {ElementHolder} from "./ElementHolder.js"
import {Row} from "./Row.js"
import {Cell} from "./Cell.js"

export class Sheet extends ElementHolder{
    rows = []
    name
    selectedCells = new Set()

    constructor(sheetElement) { super(sheetElement)
        sheetElement.querySelectorAll("tr").forEach(
            row => this.rows.set(row.rowIndex, new Row(row)))

        this.name = sheetElement.getAttribute("name")
    }

    getCell=(rowIndex, colIndex) => new Cell(this.element.querySelectorAll("tr")[rowIndex]
                                                         .querySelectorAll("td")[colIndex])
}