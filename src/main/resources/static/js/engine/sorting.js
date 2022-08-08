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
            // Reset other sorters
            for (const anySorter of sheet.querySelectorAll(".sorter")) {
                if (anySorter !== sorter) {
                    anySorter.classList.remove("sorted")
                    anySorter.applyDirection("a-z")
                }
            }
            const position = cultivateSortPosition() // Sorting position when comparing 2 rows
            Array.from(rows).slice(1) // Getting rows Array excluding the header row
                .sort(function(rowA, rowB) {
                // Returning the origin positions
                if (position === 0) return rowA.originIndex - rowB.originIndex

                const cellTextA = rowA.cells[cell.cellIndex].text.trim(),
                      cellTextB = rowB.cells[cell.cellIndex].text.trim()

                if (cellTextA === '') return  position // Avoiding the void
                if (cellTextB === '') return -position
                if (cellTextA > cellTextB) return  position
                if (cellTextA < cellTextB) return -position
                return 0
            }).forEach(row => sheet.table.append(row))

            // Updates sorter, assigns original indexes to rows and returns sortPosition
            function cultivateSortPosition() {
                if (!sorter.classList.contains("sorted")) {
                    sorter.classList.add("sorted")
                    // Assigning original indexes to be able to return original positions. Starts with 1 because 0 is a header
                    for (let i = 1; i < rows.length; i++) {
                        rows[i].originIndex = i
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