// Main object:
let engine

// Encapsulated initialization:
window.onload = () => {
    // Usages:
    const sheetsPad = document.getElementById("sheets-pad"),
          tabsPad   = document.getElementById("tabs-pad")

    class SheetsPadEngine {
        constructor() {
            // Adding row sorters into heading cells
            sheetsPad.querySelectorAll(".heading td .content").forEach(cellContent => {
                // Creating row sorter — simple div with image inside
                const sorter = document.createElement("div")
                sorter.append(document.createElement("img"))
                sorter.className = "sorter"
                sorter.title = "Sort"
                // Allows changing sorter direction and corresponding title and image
                sorter.setDirection = (direction) => {
                    sorter.direction = direction
                    sorter.querySelector("img").src = `img/sort ${direction}.png` // must exists
                }
                // An example of using of this method — and setting the default direction
                sorter.setDirection("a-z")
                sorter.addEventListener("click", () => this.sortRowsViaSorter(sorter))
                cellContent.append(sorter)
            })
        }

        sortRowsViaSorter(sorter) {
            // Rows will be compared based on the text content of cells with this index
            const columnIndex = Number(sorter.closest("td").getAttribute("index"))
            const rows        = sorter.closest("table").querySelectorAll('tr:not(.heading)')
            // Sorting position when comparing 2 rows and updating sorter's view
            const sortPosition = getSortPositionAndUpdateSorter()
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

            function getSortPositionAndUpdateSorter() {
                // Reset other sorters
                for (const anySorter of sorter.closest("table").querySelectorAll(".heading .sorter")) {
                    if (anySorter !== sorter) {
                        anySorter.classList.remove("sorted")
                        anySorter.setDirection("a-z")
                    }
                }
                if (!sorter.classList.contains("sorted")) {
                    if (sorter.direction === "a-z") {
                        sorter.classList.add("sorted")
                        return 1
                    }
                } else {
                    if (sorter.direction === "a-z") {
                        sorter.setDirection("z-a")
                        return -1
                    }
                    if (sorter.direction === "z-a") {
                        sorter.setDirection("a-z")
                        sorter.classList.remove("sorted")
                        return 0
                    }
                }
            }
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