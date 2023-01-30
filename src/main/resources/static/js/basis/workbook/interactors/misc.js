export function addFiltersToSheet(sheet) {
    const headRow = sheet.rows[0]

    for (let i = 0; i < headRow.cells.length; i++) {
        const headCell = headRow.cells[i]

        headCell.content.insertAdjacentHTML("beforeend", `
        <label title="Фильтр"
               class="filter">               
            <input type="text"
                   placeholder="∀"/>
        </label>`)

        headCell.querySelector("input[type='text']").oninput = (ev) => filtrateRows(i, ev.target.value)
    }

    function filtrateRows(columnNum, filterText) {
        for (let i = 1; i < sheet.rows.length; i++) {
            const row = sheet.rows[i]
            // Assigning filter value to cell attribute
            row.cells[columnNum].setAttribute('filter', filterText)
            filtrateRow(row)
        }
    }

    // Each cell, which doesn't suit to the filter text, will be collapsed, and expanded if it does
    function filtrateRow(row){
        row.classList.remove("collapsed")
        for (const cell of row.cells) {
            const filterText = cell.getAttribute("filter")
            if (filterText && !cell.textContent.trim().toLowerCase().includes(filterText.trim().toLowerCase())) {
                row.classList.add("collapsed")
            }
        }
    }

    // for (const cell of rows[0].cells) {
    //     // Creating row sorter — div button with image on it
    //     const sorter = document.createElement("div")
    //     sorter.append(document.createElement("img"))
    //     sorter.className = "sorter"
    //     // Allows changing sorter direction and corresponding title and image
    //     sorter.applyDirection = (direction) => {
    //         sorter.direction = direction
    //         sorter.title = "Sort " + direction
    //         sorter.querySelector("img").src = `img/sort ${direction}.png` // must exists
    //     }
    //     sorter.applyDirection("a-z") // setting the default direction
    //     cell.append(sorter)
    //
    //     sorter.onclick=() => {
    //         // Reset other sorters
    //         for (const anySorter of sheet.querySelectorAll(".sorter")) {
    //             if (anySorter !== sorter) {
    //                 anySorter.classList.remove("sorted")
    //                 anySorter.applyDirection("a-z")
    //             }
    //         }
    //         const position = cultivateSortPosition() // Sorting position when comparing 2 rows
    //         Array.from(rows).slice(1) // Getting rows Array excluding the header row
    //             .sort(function (rowA, rowB) {
    //                 // Returning the origin positions
    //                 if (position === 0) return rowA.originIndex - rowB.originIndex
    //
    //                 const cellTextA = rowA.cells[cell.cellIndex].text.trim(),
    //                     cellTextB = rowB.cells[cell.cellIndex].text.trim()
    //
    //                 if (cellTextA === '') return position // Avoiding the void
    //                 if (cellTextB === '') return -position
    //                 if (cellTextA > cellTextB) return position
    //                 if (cellTextA < cellTextB) return -position
    //                 return 0
    //             }).forEach(row => sheet.table.append(row))
    //
    //         // Updates sorter, assigns original indexes to rows and returns sortPosition
    //         function cultivateSortPosition() {
    //             if (!sorter.classList.contains("sorted")) {
    //                 sorter.classList.add("sorted")
    //                 // Assigning original indexes to be able to return original positions.
    //                 // Starts with 1 because 0 is a header
    //                 for (let i = 1; i < rows.length; i++) {
    //                     rows[i].originIndex = i
    //                 }
    //                 return 1
    //             } else {
    //                 if (sorter.direction === "a-z") {
    //                     sorter.applyDirection("z-a")
    //                     return -1
    //                 }
    //                 if (sorter.direction === "z-a") {
    //                     sorter.applyDirection("a-z")
    //                     sorter.classList.remove("sorted")
    //                     return 0
    //                 }
    //             }
    //         }
    //     }
    // }
}