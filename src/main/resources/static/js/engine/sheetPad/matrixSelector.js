import {sheetsPad} from "../usages.js"

// adding the cell selection mechanism like in Excel
sheetsPad.querySelectorAll(".sheet").forEach(sheet => {
    const table = sheet.querySelector("table")

    table.addEventListener("mousedown", startSelection)  // Selection will start by mouse button down
    window.addEventListener("mouseup", endSelection)     // And will end by button up in any zones of the window
    document.addEventListener("keydown", selectOnArrows) // Allows selecting via pressing the arrows
    sheet.addEventListener("copy", copySelectedCells)    // This allows to copy selected cells

    let cellStart, cellEnd // Cells between whose matrix of cells will be selected
    const matrix = {}      // A matrix object

    function startSelection(event) {
        const targetCell = event.target.closest("td")
        if (targetCell === null) return
        chooseNewCell(targetCell, event)
        // When the mouse cursor moves over the cells, these cells are included in the matrix
        table.addEventListener("mousemove", selectCellsMatrix)
    }
    function endSelection() { table.removeEventListener("mousemove", selectCellsMatrix) }

    function selectOnArrows(event) {
        if (!table.closest(".sheet").classList.contains("selected") ||
            // Arrows key codes
            event.keyCode < 37 || event.keyCode > 40) { return }

        event.preventDefault() // Removing standard arrows scrolling

        let targetCell
        try { switch (event.keyCode) {
            case 37 : selectLeftCellAndScroll();   break // LEFT
            case 38 : selectTopCellAndScroll();    break // TOP
            case 39 : selectRightCellAndScroll();  break // RIGHT
            case 40 : selectBottomCellAndScroll(); break // BOTTOM
        } } catch (e) { return }
        if(!targetCell) return
        chooseNewCell(targetCell, event)

        function selectLeftCellAndScroll() {
            targetCell = table.querySelectorAll("tr")[cellEnd.rowId]
                              .querySelectorAll("td")[cellEnd.columnId - 1]
            smoothScrollBy(() => sheet.scrollLeft > targetCell.offsetLeft,
                -20, 0)
        }
        function selectTopCellAndScroll() {
            targetCell = table.querySelectorAll("tr")[cellEnd.rowId - 1]
                              .querySelectorAll("td")[cellEnd.columnId]
            smoothScrollBy(() => sheet.scrollTop > targetCell.offsetTop,
                0, -20)
        }
        function selectRightCellAndScroll() {
            targetCell = table.querySelectorAll("tr")[cellEnd.rowId]
                              .querySelectorAll("td")[cellEnd.columnId + 1]
            smoothScrollBy(() => sheet.scrollLeft + sheet.clientWidth < targetCell.offsetLeft + targetCell.offsetWidth,
                20, 0)
        }
        function selectBottomCellAndScroll() {
            targetCell = table.querySelectorAll("tr")[cellEnd.rowId + 1]
                              .querySelectorAll("td")[cellEnd.columnId]
            smoothScrollBy(() => sheet.scrollTop + sheet.clientHeight < targetCell.offsetTop + targetCell.offsetHeight,
                0, 20)
        }
        // Allows smooth scrolling. Standard .scrollBy(x, y) doing it so sharply
        function smoothScrollBy(condition, x, y) {
            if (condition()) {
                sheet.scrollBy(x, y)
                setTimeout(() => smoothScrollBy(condition, x, y), 1)
            }
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

    // Matrix selection function — most important function here
    function selectCellsMatrix(event) {
        if (event != null) {
            const targetCell = event.target.closest('td')
            if (targetCell === null || targetCell === cellEnd) return
            cellEnd = targetCell
        }
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

    function copySelectedCells() {

    }
})