import {sheetsPad} from "../usages.js"

// adding the cell selection mechanism like in Excel
sheetsPad.querySelectorAll("table").forEach(table =>
{
    table.addEventListener("mousedown", startSelection) // Selection will start by mouse button down
    window.addEventListener("mouseup", endSelection)    // And will end by button up in any zones of the window
    table.addEventListener("copy", copySelectedCells)   // This allows to copy selected cells

    let cellStart, cellEnd // Cells between whose matrix of cells will be selected
    const matrix = {}      // A matrix object

    function startSelection (event) {
        const targetCell = event.target.closest('td')
        if (targetCell === null) return
        // If the shift button is not pressed, selecting a new matrix
        if (!event.shiftKey) {
            defineCell(cellStart = targetCell)
        }
        selectCellsMatrix(event)
        // When the mouse cursor moves over the cells, these cells are included in the matrix
        table.addEventListener("mousemove", selectCellsMatrix)
    }

    function endSelection () { table.removeEventListener("mousemove", selectCellsMatrix) }

    // Matrix selection function — most important function here
    function selectCellsMatrix(event) {
        const targetCell = event.target.closest('td')
        if (targetCell === null || targetCell === cellEnd) return

        defineCell(cellEnd = targetCell)
        matrix.topId    = (cellStart.rowId <= cellEnd.rowId) ? cellStart.rowId : cellEnd.rowId
        matrix.bottomId = (cellStart.rowId <= cellEnd.rowId) ? cellEnd.rowId   : cellStart.rowId
        matrix.leftId   = (cellStart.columnId <= cellEnd.columnId) ? cellStart.columnId : cellEnd.columnId
        matrix.rightId  = (cellStart.columnId <= cellEnd.columnId) ? cellEnd.columnId   : cellStart.columnId

        // Removing selects that remained after the previous matrix filling
        table.querySelectorAll("td.selected").forEach(cell => cell.classList.remove("selected"))
        // Filling the matrix from left top cell to right bottom cell
        for (let i = matrix.topId; i <= matrix.bottomId; i++) {
            const cells = table.querySelectorAll("tr")[i].querySelectorAll("td")
            for (let j = matrix.leftId; j <= matrix.rightId; j++) {
                cells[j].classList.add("selected")
            }
        }
    }

    function defineCell(cell) {
        cell.rowId    = Number(cell.closest("tr").getAttribute("index"))
        cell.columnId = Number(cell.getAttribute("index"))
    }

    function copySelectedCells() {

    }
})