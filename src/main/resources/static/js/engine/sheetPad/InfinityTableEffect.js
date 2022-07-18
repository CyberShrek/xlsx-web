// Adds the Infinity Table effect: when user scrolls to the right or bottom edge of the sheet,
// void columns or rows appear after this edge. And disappear when scrolls back
export class InfinityTableEffect {
    constructor() {
        // Target distances between current scroll edges and ends of those edges
        const DISTANCE_ON_CREATE = 50
        const DISTANCE_ON_REMOVE = 300

        // Adding scroll listeners for that effect
        for (const sheet of document.querySelectorAll("#sheets-pad .sheet")) {
            sheet.addEventListener("scroll", (event) => {
                // Creating or removing void columns on horizontal scrolling
                if (event.deltaX !== 0) {
                    const edgeDistance = sheet.scrollWidth - sheet.scrollLeft - sheet.clientWidth
                    if (edgeDistance < DISTANCE_ON_CREATE) this.appendColumnToSheet(sheet, "void")
                    else if (edgeDistance > DISTANCE_ON_REMOVE) removeLastVoidColumn()
                }
                // Creating or removing void rows on vertical scrolling
                if (event.deltaY !== 0) {
                    const edgeDistance = sheet.scrollHeight - sheet.scrollTop - sheet.clientHeight
                    if (edgeDistance < DISTANCE_ON_CREATE) this.appendRowToSheet(sheet, "void")
                    else if (edgeDistance > DISTANCE_ON_REMOVE) removeLastVoidRow()
                }
            })

            function removeLastVoidRow() {
                const voidRows = sheet.querySelectorAll("tr.void")
                voidRows[voidRows?.length - 1]?.remove()
            }

            function removeLastVoidColumn() {
                let lastVoidColumn = []
                for (const row of sheet.querySelectorAll("tr")) {
                    const cells = row.querySelectorAll("td"),
                        lastCell = cells[cells.length - 1]
                    if (lastCell.classList.contains("void")) {
                        lastVoidColumn.push(lastCell)
                    } else return
                }
                lastVoidColumn.forEach(voidCell => voidCell.remove())
            }
        }
    }
    appendRowToSheet(sheet, rowClassName) {
        const row = document.createElement("tr")
        row.className = rowClassName
        // Adding void cells in the amount of the first row cells
        sheet.querySelector("tr").querySelectorAll("td").forEach(
            () => this.appendCellToRow(row, rowClassName))
        sheet.querySelector("table").append(row)
    }

    appendColumnToSheet(sheet, columnClassName) {
        sheet.querySelectorAll("tr").forEach(row => this.appendCellToRow(row, columnClassName))
    }

    appendCellToRow(row, cellClassName) {
        const cell = document.createElement("td")
        cell.className = cellClassName
        row.append(cell)
    }
}