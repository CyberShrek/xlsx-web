// Adds the cell selection mechanism like in Excel to sheet
export function addMatrixSelectorToSheet(sheet){
    const table = sheet.closest("table")
    // The matrix of selected cells
    const matrix = {
        selects: [],
        // Cells between whose matrix of cells will be selected
        cellStart: undefined,
        cellEnd  : undefined,
        // Matrix coordinates
        matrixTopId   : undefined,
        matrixBottomId: undefined,
        matrixLeftId  : undefined,
        matrixRightId : undefined
    }
    // Defining common methods for this matrix
    matrix.selectCell=(cell)=>{
        cell.classList.add("selected")
        matrix.selects.push(cell)
    }

    table.addEventListener("mousedown", startSelection)  // Selection will start by mouse button down
    window.addEventListener("mouseup", endSelection)     // And will end by button up in any zones of the window
    document.addEventListener("keydown", selectOnArrows) // Allows selecting via pressing the arrows
    table.addEventListener("copy", copySelectedCells)    // This allows to copy selected cells

    function startSelection(event) {
        const targetCell = event.target.closest("td")
        if (!targetCell) return
        chooseNewCell(targetCell, event)
        // When the mouse cursor moves over the cells, these cells are included in the matrix
        table.addEventListener("mousemove", selectCellsMatrix)
    }
    function endSelection() { table.removeEventListener("mousemove", selectCellsMatrix) }

    function selectOnArrows(event) {
        if (!sheet.classList.contains("active") ||
            // Arrows key codes
            event.keyCode < 37 || event.keyCode > 40) { return }

        event.preventDefault() // Removing standard arrows scrolling

        let targetCell
        try { switch (event.keyCode) {
            case 37 : selectLeftCell();   break // LEFT
            case 38 : selectTopCell();    break // TOP
            case 39 : selectRightCell();  break // RIGHT
            case 40 : selectBottomCell(); break // BOTTOM
        } } catch (exception) { return }

        if(targetCell) chooseNewCell(targetCell, event)

        function selectLeftCell() {
            targetCell = sheet.getCell(cellEnd.rowIndex,cellEnd.cellIndex-1)
            if (sheet.scrollLeft > targetCell.offsetLeft)
                targetCell.scrollIntoView({block: "nearest", inline: "start", behavior: "smooth"})
        }
        function selectTopCell() {
            targetCell = sheet.getCell(cellEnd.rowIndex-1,cellEnd.cellIndex)
            if (sheet.scrollTop > targetCell.offsetTop)
                targetCell.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"})
        }
        function selectRightCell() {
            targetCell = sheet.getCell(cellEnd.rowIndex,cellEnd.cellIndex+1)
            if (sheet.scrollLeft + sheet.clientWidth < targetCell.offsetLeft + targetCell.offsetWidth)
                targetCell.scrollIntoView({block: "nearest", inline: "end", behavior: "smooth"})
        }
        function selectBottomCell() {
            targetCell = sheet.getCell(cellEnd.rowIndex+1,cellEnd.cellIndex)
            if (sheet.scrollTop + sheet.clientHeight < targetCell.offsetTop + targetCell.offsetHeight)
                targetCell.scrollIntoView({block: "end", inline: "nearest", behavior: "smooth"})
        }
    }

    function chooseNewCell(cell, event) {
        // If the shift button is not pressed, will start selecting a new matrix
        if (!event.shiftKey) {
            cellStart = cell
        }
        cellEnd = cell
        selectCellsMatrix()
    }

    // Most important function here
    function selectCellsMatrix(event) {
        if (event != null) {
            const targetCell = event.target.closest("td")
            if (targetCell === null || targetCell === cellEnd) return
            cellEnd = targetCell
        }
        const matrixTopId    = (cellStart.rowIndex <= cellEnd.rowIndex) ? cellStart.rowIndex : cellEnd.rowIndex,
              matrixBottomId = (cellStart.rowIndex <= cellEnd.rowIndex) ? cellEnd.rowIndex   : cellStart.rowIndex,
              matrixLeftId   = (cellStart.cellIndex <= cellEnd.cellIndex) ? cellStart.cellIndex : cellEnd.cellIndex,
              matrixRightId  = (cellStart.cellIndex <= cellEnd.cellIndex) ? cellEnd.cellIndex   : cellStart.cellIndex

        // Removing selects that remained after the previous matrix filling
        table.querySelectorAll("td.selected").forEach(cell => cell.classList.remove("selected"))
        // Filling the matrix from left top cell to right bottom cell
        for (let i = matrixTopId; i <= matrixBottomId; i++) {
            for (let j = matrixLeftId; j <= matrixRightId; j++) {
                table.rows[i].cells[j].classList.add("selected")
            }
        }
    }

    // A simple solution should be to just add all selected cells to Ranges, then push these Ranges into Selection.
    // But multi-selection, that allows to add more than one range into Selection, only works in Firefox.
    // So I decided next: each time before copying, a new table will be created, filled with selected cells,
    // and pushed into Selection as a single Range. This table will be placed in the <clipboard> element
    function copySelectedCells() {
        const selectedCells = sheet.getSelectedCells(),
              copyingTable  = document.createElement("table")
        let   copyingRow    = document.createElement("tr")

        selectedCells.forEach(cell => {

            // if (copyingRow.index !== cell.rowId)/
            const copyingCell = cell.cloneNode(true)
            copyingCell.classList.remove("selected")
            //

            copyingTable.append(copyingCell)
            console.log(cell)
        })
        // copyingTable.append(copyingRow)

        document.querySelector("clipboard").replaceChildren(copyingTable)

        const range = new Range()
        range.selectNode(copyingTable)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
    }
}