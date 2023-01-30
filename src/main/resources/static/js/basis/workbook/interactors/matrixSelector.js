import {workbook} from "../workbook.js"

// Adds the cell selection mechanism like in Excel to sheet
export function addMatrixSelectorToSheet(sheet) {
    // The matrix of selected cells
    sheet.matrixSelector = {
        cells: [],
        // Cells between whose matrix of cells will be selected
        cellA: sheet.rows[0].cells[0],
        cellB: sheet.rows[0].cells[0],
        // Gives access to the matrix selection control
        enabled: false,

        addCell(cell) {
            cell.classList.add("selected")
            this.cells.push(cell)
        },
        removeCell(cell) {
            cell.classList.remove("selected")
        },
        clear() {
            this.cells.forEach(cell => this.removeCell(cell))
            this.cells = []
        },
        // Matrix coordinates
        get topId() {
            return (this.cellA.rowIndex <= this.cellB.rowIndex) ? this.cellA.rowIndex : this.cellB.rowIndex
        },
        get bottomId() {
            return (this.cellA.rowIndex <= this.cellB.rowIndex) ? this.cellB.rowIndex : this.cellA.rowIndex
        },
        get leftId() {
            return (this.cellA.cellIndex <= this.cellB.cellIndex) ? this.cellA.cellIndex : this.cellB.cellIndex
        },
        get rightId() {
            return (this.cellA.cellIndex <= this.cellB.cellIndex) ? this.cellB.cellIndex : this.cellA.cellIndex
        },
    }
    const matrix = sheet.matrixSelector

    sheet.addEventListener("mousedown", startSelection)       // Selection will start by mouse button down
    window.addEventListener("mouseup", endSelection)     // And will end by button up in any zones of the window
    document.addEventListener("keydown", selectOnArrows) // Allows selecting via pressing the arrows

    function startSelection(event) {
        const targetCell = event.target.closest("td")
        if (targetCell === null) return
        updateSelection(targetCell, event)
        // When the mouse cursor moves over the cells, these cells are included in the matrix
        sheet.addEventListener("mousemove", selectCellsMatrix)
    }

    function endSelection() {
        sheet.removeEventListener("mousemove", selectCellsMatrix)
    }

    // Moves the selector after the last selected cell according to the pressed arrow
    function selectOnArrows(event) {
        if (!matrix.enabled || event.keyCode < 37 || event.keyCode > 40) return
        // Prevent arrow scrolling
        event.preventDefault()

        let targetCell
        try {
            switch (event.keyCode) {
                case 37: // LEFT
                    targetCell = sheet.rows[matrix.cellB.rowIndex].cells[matrix.cellB.cellIndex - 1]
                    if (sheet.scrollLeft > targetCell.offsetLeft)
                        targetCell.scrollIntoView({block: "nearest", inline: "start", behavior: "smooth"});
                    break
                case 38: // TOP
                    targetCell = sheet.rows[matrix.cellB.rowIndex - 1].cells[matrix.cellB.cellIndex]
                    if (sheet.scrollTop > targetCell.offsetTop)
                        targetCell.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
                    break
                case 39: // RIGHT
                    targetCell = sheet.rows[matrix.cellB.rowIndex].cells[matrix.cellB.cellIndex + 1]
                    if (sheet.scrollLeft + sheet.clientWidth < targetCell.offsetLeft + targetCell.offsetWidth)
                        targetCell.scrollIntoView({block: "nearest", inline: "end", behavior: "smooth"});
                    break
                case 40: // BOTTOM
                    targetCell = sheet.rows[matrix.cellB.rowIndex + 1].cells[matrix.cellB.cellIndex]
                    if (sheet.scrollTop + sheet.clientHeight < targetCell.offsetTop + targetCell.offsetHeight)
                        targetCell.scrollIntoView({block: "end", inline: "nearest", behavior: "smooth"});
                    break
            }
        } catch (exception) {
            return
        }

        updateSelection(targetCell, event)
    }

    function updateSelection(cell, event) {
        // If the shift button is not pressed, will start selecting a new matrix
        if (!event.shiftKey) {
            matrix.cellA = cell
            // Sending the report that a new matrix has been selected
            document.dispatchEvent(workbook.updateEvent)
        }
        matrix.cellB = cell
        selectCellsMatrix()
    }

    // Crucial function here
    function selectCellsMatrix(event) {
        if (event) {
            const targetCell = event.target.closest("td")
            if (targetCell === null || targetCell === matrix.cellB)
                return
            matrix.cellB = targetCell
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

    selectCellsMatrix()
}

// This allows to copy selected cells
document.addEventListener("copy", () => {
    // Each time before copying will be created new table, filled with selected cells,
    // and pushed into Selection as a single Range. This table will be placed in the <clipboard> element
    const matrix = workbook.activeSheet.matrixSelector
    if (!matrix.enabled) return

    const copyingTable = document.createElement("table")
    let copyingRow = document.createElement("tr"),
        lastRowIndex = matrix.cells[0].rowIndex

    matrix.cells.forEach(cell => {
        if (lastRowIndex !== cell.rowIndex) {
            copyingTable.append(copyingRow)
            copyingRow = document.createElement("tr")
            lastRowIndex = cell.rowIndex
        }
        const copyingCell = cell.cloneNode(true)
        copyingCell.textContent = cell.content.textContent
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
