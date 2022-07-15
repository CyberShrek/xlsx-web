// Main object:
let engine

// Late encapsulated initialization:
window.onload = () => {
    // Usages:
    const sheetsPad = document.getElementById("sheets-pad"),
          tabsPad   = document.getElementById("tabs-pad")

    // Responsible for sorting operations
    class Sorting {
        static {
            // Adding row sorters into heading cells
            sheetsPad.querySelectorAll(".heading td .content").forEach(cellContent => {
                // Creating row sorter — simple div with image inside
                const sorter = document.createElement("div")
                sorter.append(document.createElement("img"))
                sorter.className = "sorter"
                // Allows changing sorter direction and corresponding title and image
                sorter.applyDirection = (direction) => {
                    sorter.direction = direction
                    sorter.title = "Sort " + direction
                    sorter.querySelector("img").src = `img/sort ${direction}.png` // must exists
                }
                // An example of using of this method — and setting the default direction
                sorter.applyDirection("a-z")
                sorter.addEventListener("click", () => this.sortRowsViaSorter(sorter))
                cellContent.append(sorter)
            })
        }

        // Sorter means a button in a heading cell, which must activate sorting after clicking it
        static sortRowsViaSorter(sorter) {
            // Rows will be compared based on the text content of cells with this index
            const columnIndex = Number(sorter.closest("td").getAttribute("index"))
            const rows        = sorter.closest("table").querySelectorAll('tr:not(.heading)')
            // Sorting position when comparing 2 rows and updating sorter's view
            const sortPosition = this.getSortPositionAndUpdateSorter(sorter)
            const sortedRows   = Array.from(rows).sort(function (rowA, rowB) {
                if (sortPosition === 0) {
                    // Returning the origin positions
                    return Number(rowA.getAttribute('index')) - Number(rowB.getAttribute('index'))
                } else {
                    const cellTextA = rowA.querySelectorAll("td")[columnIndex].textContent.trim(),
                        cellTextB = rowB.querySelectorAll("td")[columnIndex].textContent.trim()
                    if (cellTextA === '') return sortPosition // Avoiding the void
                    if (cellTextB === '') return -sortPosition
                    if (cellTextA > cellTextB) return sortPosition
                    if (cellTextA < cellTextB) return -sortPosition
                    return 0
                }
            })
            // Changing origin rows to sorted rows
            for (let i = 0; i < sortedRows.length; i++) {
                rows[i].replaceWith(sortedRows[i].cloneNode(true))
            }
        }

        static getSortPositionAndUpdateSorter(sorter) {
            // Reset other sorters
            for (const anySorter of sorter.closest("table").querySelectorAll(".heading .sorter")) {
                if (anySorter !== sorter) {
                    anySorter.classList.remove("sorted")
                    anySorter.applyDirection("a-z")
                }
            }
            if (!sorter.classList.contains("sorted")) {
                if (sorter.direction === "a-z") {
                    sorter.classList.add("sorted")
                    return 1
                }
            } else {
                if (sorter.direction === "a-z") {
                    sorter.applyDirection("z-a")
                    return -1
                }
                if (sorter.direction === "z-a") {
                    sorter.applyDirection("a-z")
                    sorter.classList.remove("sorted")
                    return 0
                }
            }
        }
    }
    // Responsible for the Infinity-Cells effect: when user scrolls to the border of the sheet,
    // void cells appear after this border. And disappear when scrolls back
    class InfinityCells {
        static {
            // Target distances between current scroll edges and ends of those edges
            const DISTANCE_ON_CREATE = 50
            const DISTANCE_ON_REMOVE = 300

            // Adding scroll listeners for that effect
            for (const sheet of sheetsPad.querySelectorAll(".sheet")) {
                sheet.addEventListener("scroll", (event) => {
                    // Creating or removing void columns on horizontal scroll
                    if (event.deltaX !== 0) {
                        const distance = getRightEdgeDistance()
                        if      (distance < DISTANCE_ON_CREATE) addVoidColumn()
                        else if (distance > DISTANCE_ON_REMOVE) removeLastVoidColumn()
                    }
                    // Creating or removing void rows on vertical scroll
                    if (event.deltaY !== 0) {
                        const distance = getBottomEdgeDistance()
                        if      (distance < DISTANCE_ON_CREATE) addVoidRow()
                        else if (distance > DISTANCE_ON_REMOVE) removeLastVoidRow()
                    }
                })

                function getRightEdgeDistance() { return sheet.scrollWidth - sheet.scrollLeft - sheet.clientWidth }
                function getBottomEdgeDistance() { return sheet.scrollHeight - sheet.scrollTop - sheet.clientHeight }

                function addVoidRow() {
                    const voidRow = document.createElement("tr")
                    voidRow.className = "void"
                    // Adding void cells in the amount of the first row cells
                    sheet.querySelector("tr").querySelectorAll("td").forEach(() => addVoidCellToRow(voidRow))
                    sheet.querySelector("table").append(voidRow)
                }

                function addVoidColumn() {
                    sheet.querySelectorAll("tr").forEach(row => addVoidCellToRow(row))
                }

                function addVoidCellToRow(row) {
                    const voidCell = document.createElement("td")
                    voidCell.className = "void"
                    row.append(voidCell)
                }

                function removeLastVoidRow() {
                    const voidRows = sheet.querySelectorAll("tr.void")
                    voidRows[voidRows?.length-1]?.remove()
                }

                function removeLastVoidColumn() {
                    let lastVoidColumn = []
                    for (const row of sheet.querySelectorAll("tr")) {
                        const cells  = row.querySelectorAll("td"),
                            lastCell = cells[cells.length-1]
                        if (lastCell.classList.contains("void")){
                            lastVoidColumn.push(lastCell)
                        } else return
                    }
                    lastVoidColumn.forEach(voidCell => voidCell.remove())
                }
            }
        }
    }

    class SheetsPadEngine {
        sortRowsViaSorter(sorter) {
            Sorting.sortRowsViaSorter(sorter)
        }
    }

    class TabsPadEngine {
        constructor() {
            // Adding sheet selectors
            tabsPad.querySelectorAll(".tab").forEach(
                tab => tab.addEventListener("click", () => this.selectTab(tab)))
        }

        selectTab(tab) {
            tabsPad.querySelector(".tab.selected")?.classList.remove("selected")
            tab.classList.add("selected")
            sheetsPad.querySelector(".sheet.selected")?.classList.remove("selected")
            sheetsPad.querySelector(`.sheet[name="${tab.textContent}"]`).classList.add("selected")
        }
    }

    engine = {}
    engine.sheetsPad = new SheetsPadEngine()
    engine.tabsPad = new TabsPadEngine()
    // By default, the first sheet will be selected
    engine.tabsPad.selectTab(tabsPad.querySelector(".tab"))
}