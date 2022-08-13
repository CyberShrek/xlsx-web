import {workbook} from "./index.js"

// Adds the cell selection mechanism like in Excel to sheet
export function addMatrixSelectorToSheet(sheet){
    // The matrix of selected cells
    sheet.selectionMatrix = {
        cells: [],
        addCell(cell){
            cell.classList.add("selected")
            this.cells.push(cell)
        },
        removeCell(cell){
            cell.classList.remove("selected")
        },
        clear(){
            this.cells.forEach(cell => this.removeCell(cell))
            this.cells = []
        },
        // Cells between whose matrix of cells will be selected
        cellA: undefined,
        cellB: undefined,
        // Matrix coordinates
        get topId(){
            return (this.cellA.rowIndex <= this.cellB.rowIndex) ? this.cellA.rowIndex : this.cellB.rowIndex
        },
        get bottomId(){
            return (this.cellA.rowIndex <= this.cellB.rowIndex) ? this.cellB.rowIndex : this.cellA.rowIndex
        },
        get leftId(){
            return (this.cellA.cellIndex <= this.cellB.cellIndex) ? this.cellA.cellIndex : this.cellB.cellIndex
        },
        get rightId(){
            return (this.cellA.cellIndex <= this.cellB.cellIndex) ? this.cellB.cellIndex : this.cellA.cellIndex
        },
    }
    const matrix = sheet.selectionMatrix

    sheet.addEventListener("mousedown", startSelection) // Selection will start by mouse button down
    window.addEventListener("mouseup", endSelection)     // And will end by button up in any zones of the window
    document.addEventListener("keydown", selectOnArrows) // Allows selecting via pressing the arrows

    function startSelection(event) {
        const targetCell = workbook.getCellFromEvent(event)
        if (!targetCell) return
        updateSelection(targetCell, event)
        // When the mouse cursor moves over the cells, these cells are included in the matrix
        sheet.addEventListener("mousemove", selectCellsMatrix)
    }
    function endSelection() {
        sheet.removeEventListener("mousemove", selectCellsMatrix)
    }

    // Moves the selector after the last selected cell according to the pressed arrow
    function selectOnArrows(event) {
        if (!sheet.classList.contains("active") ||
            // Arrows key codes
            event.keyCode < 37 || event.keyCode > 40) { return }

        event.preventDefault() // Prevent standard arrows scrolling

        let targetCell
        try { switch (event.keyCode) {
            case 37: // LEFT
                targetCell = sheet.rows[matrix.cellB.rowIndex].cells[matrix.cellB.cellIndex-1]
                if (sheet.scrollLeft > targetCell.offsetLeft)
                    targetCell.scrollIntoView({block: "nearest", inline: "start", behavior: "smooth"}); break
            case 38: // TOP
                targetCell = sheet.rows[matrix.cellB.rowIndex-1].cells[matrix.cellB.cellIndex]
                if (sheet.scrollTop > targetCell.offsetTop)
                    targetCell.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"}); break
            case 39: // RIGHT
                targetCell = sheet.rows[matrix.cellB.rowIndex].cells[matrix.cellB.cellIndex+1]
                if (sheet.scrollLeft + sheet.clientWidth < targetCell.offsetLeft + targetCell.offsetWidth)
                    targetCell.scrollIntoView({block: "nearest", inline: "end", behavior: "smooth"}); break
            case 40: // BOTTOM
                targetCell = sheet.rows[matrix.cellB.rowIndex+1].cells[matrix.cellB.cellIndex]
                if (sheet.scrollTop + sheet.clientHeight < targetCell.offsetTop + targetCell.offsetHeight)
                    targetCell.scrollIntoView({block: "end", inline: "nearest", behavior: "smooth"}); break
        } } catch (exception) { return }

        updateSelection(targetCell, event)
    }

    function updateSelection(cell, event) {
        // If the shift button is not pressed, will start selecting a new matrix
        if (!event.shiftKey) {
            matrix.cellA = cell
            // Sending the report that a new matrix has been selected
            sheet.dispatchEvent(workbook.updateEvent)
        }
        matrix.cellB = cell
        selectCellsMatrix()
    }

    // Crucial function here
    function selectCellsMatrix(event) {
        if (event != null) {
            if (!(event.target instanceof HTMLTableCellElement) || event.target === matrix.cellB)
                return
            matrix.cellB = event.target
        }
        // Removing selects that remained after the previous matrix filling
        matrix.clear()
        // Filling the matrix from left top cell to right bottom cell
        for (let i = matrix.topId; i <= matrix.bottomId; i++) {
            for (let j = matrix.leftId; j <= matrix.rightId; j++) {
                matrix.addCell(sheet.rows[i].cells[j])
            }
        }
    }
}

// This allows to copy selected cells
document.addEventListener("copy", () => {
    // Each time before copying will be created new table, filled with selected cells,
    // and pushed into Selection as a single Range. This table will be placed in the <clipboard> element
    const matrix = workbook.activeSheet.selectionMatrix
    const copyingTable = document.createElement("table")
    let copyingRow = document.createElement("tr"),
        lastRowIndex = matrix.cells[0].rowIndex

    matrix.cells.forEach(cell => {
        if (lastRowIndex !== cell.rowIndex){
            copyingTable.append(copyingRow)
            copyingRow = document.createElement("tr")
            lastRowIndex = cell.rowIndex
        }
        const copyingCell = cell.cloneNode(true)
        copyingCell.textContent = cell.textContent
        copyingCell.classList.remove("selected")
        copyingRow.append(copyingCell)
    })
    copyingTable.append(copyingRow)
    document.querySelector("clipboard").replaceChildren(copyingTable)
    // Copying
    const range = new Range()
    range.selectNode(copyingTable)
    console.log(range)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
})
