// A rows' sorter means a button that sorts rows when clicked
export function addSortersToSheet(sheet){
    const rows = sheet.rows
    for (const cell of rows[0].cells) {
        // Creating row sorter — div button with image on it
        const sorter = document.createElement("div")
        sorter.append(document.createElement("img"))
        sorter.className = "sorter"
        // Allows changing sorter direction and corresponding title and image
        sorter.applyDirection = (direction) => {
            sorter.direction = direction
            sorter.title = "Sort " + direction
            sorter.querySelector("img").src = `img/sort ${direction}.png` // must exists
        }
        sorter.applyDirection("a-z") // setting the default direction
        sorter.addEventListener("click", () => sortRows())
        cell.append(sorter)

        function sortRows() {
            const
                columnIndex  = cell.cellIndex,
                // Sorting position when comparing 2 rows and updating sorter's view
                sortPosition = cultivateSortPosition(),
                sortedRows   = Array.from(rows).sort(function (rowA, rowB) {
                    if (rowA.rowIndex === 0) // Pass the header
                        return 0
                    else if (sortPosition === 0) { // Returning the origin positions
                        return Number(rowA.getAttribute("originIndex"))
                             - Number(rowB.getAttribute("originIndex"))
                    } else {
                        const cellTextA = rowA.cells[columnIndex].textContent.trim(),
                            cellTextB = rowB.cells[columnIndex].textContent.trim()
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

            // Updates sorters, assigns original indexes to rows (if the sorter was clicked for the first time) and returns sortPosition
            function cultivateSortPosition() {
                // Reset other sorters
                for (const anySorter of sheet.querySelectorAll(".sorter")) {
                    if (anySorter !== sorter) {
                        anySorter.classList.remove("sorted")
                        anySorter.applyDirection("a-z")
                    }
                }
                if (!sorter.classList.contains("sorted")) {
                    sorter.classList.add("sorted")
                    // Assigning original indexes to be able to return original positions. Starts with 1 because 0 is a header
                    for (let i = 1; i < rows.length; i++) {
                        // Using a plain attribute as an origin index to avoid its lost after copying
                        rows[i].setAttribute("originIndex", i)
                    }
                    return 1
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
    }
}


