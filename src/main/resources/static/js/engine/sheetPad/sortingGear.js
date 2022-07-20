export const sortingGear = {}

// Adding row sorters into heading cells. Sorter means a button that sorts rows when clicked
document.querySelectorAll("#sheets-pad .sheet .heading td .content").forEach(cellContent => {
    // Creating row sorter — simple div button with image on it
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
    sorter.addEventListener("click", () => sortingGear.sortRowsViaSorter(sorter))
    cellContent.append(sorter)
})

// Adding numbering cells
for (const sheet of document.querySelectorAll("#sheets-pad .sheet")) {
    const rows = sheet.querySelectorAll("tr")
    for (let i = 0; i < rows.length; i++) {
        const numberingCell = document.createElement("td")
        numberingCell.textContent = i
        numberingCell.className = "number"
        rows[i].insertBefore(numberingCell, rows[i].querySelector("td"))
    }
}

sortingGear.updateNumberingCellsOnSheet = (sheet) => {
    const numberingCells = sheet.querySelectorAll("td.number")
    for (let i = 0; i < numberingCells.length; i++) {
        numberingCells[i].textContent = i
    }
}

sortingGear.sortRowsViaSorter = (sorter) => {
    // Rows will be compared based on the text content of cells with this index
    const columnIndex = Number(sorter.closest("td").getAttribute("index"))
    const rows        = sorter.closest("table").querySelectorAll('tr:not(.heading)')
    // Sorting position when comparing 2 rows and updating sorter's view
    const sortPosition = getSortPositionAndUpdateSorters()
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

    function getSortPositionAndUpdateSorters() {
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