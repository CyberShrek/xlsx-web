import {sheetsPad} from "../usages.js"

// adding the cell selection mechanism like in Excel
sheetsPad.querySelectorAll("table").forEach(table => {
    let
        // Cells between whose matrix of cells will be selected
        cellStart, cellEnd,
        // Coordinates of these cells
        columnIdStart, columnIdEnd,
        rowIdStart,    rowIdEnd,
        // Matrix edges
        topMatrixId,  bottomMatrixId,
        leftMatrixId, rightMatrixId

    // On mouse button down selection will start
    table.addEventListener("mousedown", startSelection)
    // On mouse button up in any zones of the window selection will end
    window.addEventListener("mouseup", endSelection)

    function startSelection (event) {
        const targetCell = event.target.closest('td')
        if (targetCell === null)
            return
        // If the shift button is not pressed, new matrix is selecting
        if (!event.shiftKey) {
            cellStart?.classList.remove("start")
            cellStart = targetCell
            cellStart.classList.add("start")
            columnIdStart = getCellColumnId(cellStart)
            rowIdStart = getCellRowId(cellStart)
        }
        selectCellsMatrix(event)
        // When the mouse cursor moves over the cells, these cells are included in the matrix
        table.addEventListener("mousemove", selectCellsMatrix)
        // When the mouse cursor reaches an edge, the sheet scrolls toward that edge
    }

    function endSelection () { table.removeEventListener("mousemove", selectCellsMatrix) }

    function getCellRowId(cell) { return Number(cell.closest("tr").getAttribute("index")) }
    function getCellColumnId(cell) { return Number(cell.getAttribute("index")) }

    // Directly matrix selection function
    function selectCellsMatrix(event) {
        const targetCell = event.target.closest('td')
        if (targetCell === null ||
            // Ignore if the cell already selected
            targetCell === cellEnd ||
            // Ignore selection from header to any rows and vice versa
            (cellStart.closest('tr').classList.contains("heading") +
            targetCell.closest('tr').classList.contains("heading") === 1))
            return

        cellEnd        = targetCell
        rowIdEnd       = getCellRowId(cellEnd)
        columnIdEnd    = getCellColumnId(cellEnd)
        topMatrixId    = (rowIdStart <= rowIdEnd) ? rowIdStart : rowIdEnd
        bottomMatrixId = (rowIdStart <= rowIdEnd) ? rowIdEnd   : rowIdStart
        leftMatrixId   = (columnIdStart <= columnIdEnd) ? columnIdStart : columnIdEnd
        rightMatrixId  = (columnIdStart <= columnIdEnd) ? columnIdEnd   : columnIdStart

        // Filling the matrix successively from left top cell to right bottom cell
        for (let i = topMatrixId; i <= bottomMatrixId; i++) {
            for (let j = leftMatrixId; j <= rightMatrixId; j++) {
                table
                    .getElementsByTagName("tr")[i]
                    .getElementsByTagName("td")[j]
                    .classList.add("selected")
            }
        }
        resetOutOfMatrixSelects()
    }

    function resetOutOfMatrixSelects() {
        const selectedCells = table.querySelectorAll("td.selected")
        for (const selectedCell of selectedCells) {
            const columnId = getCellColumnId(selectedCell),
                  rowId    = getCellRowId(selectedCell)
            if (rowId < topMatrixId ||
                rowId > bottomMatrixId ||
                columnId < leftMatrixId ||
                columnId > rightMatrixId)
                selectedCell.classList.remove("selected")
        }
    }
})

