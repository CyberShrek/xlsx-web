// import {Sheet} from "./Sheet.js"
// import {Row} from "./Row.js"
// import {Cell} from "./Cell.js"
// import {ElementHolder} from "./ElementHolder";

const sheetsPad = document.getElementById("sheets-pad")

export class Workbook {
    static sheets = new Map() // key=name value=sheet
    static {
        sheetsPad.querySelectorAll(".sheet").forEach(
            sheet => this.sheets.set(sheet.getAttribute("name"), new Sheet(sheet)))
    }
    static getActiveSheet=() => this.sheets.forEach(sheet => { if (sheet.isActive) return sheet })

    static getClosestSheetTo=(element) => this.sheets.get(element.closest(".sheet").getAttribute("name"))
}

class Sheet extends ElementHolder{
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

class Row extends ElementHolder{
    cells = []
    index

    constructor(rowElement) { super(rowElement)
        rowElement.querySelector("td").forEach(cell => this.cells.push(new Cell(cell)))
        this.index = rowElement.rowIndex
    }
}

class Cell extends ElementHolder {
    rowIndex
    colIndex

    constructor(cellElement) { super(cellElement)
        this.rowIndex = cellElement.closest("tr").rowIndex
        this.colIndex = cellElement.cellIndex
    }
}

class ElementHolder {
    element
    constructor(element) {
        if (element === null) return null
        this.element = element
    }
}