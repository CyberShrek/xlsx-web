const // Usages
    sheetsPad = document.querySelectorAll("#sheets-pad"),
    tabsPad   = document.querySelectorAll("#tabs-pad")

export const workbook = {
    get sheets(){
        return sheetsPad.querySelectorAll(".sheet")
    },
    get activeSheet(){
        return sheetsPad.querySelector(".sheet.active")
    },
    set activeSheet(sheet){
        this.activeSheet?.classList.remove("active")
        sheet.classList.add("active")
        // Select the corresponding tab
        tabsPad.querySelector(".tab.active")?.classList.remove("active")
        tabsPad.querySelector(`.tab[name="${sheet.name}"]`).classList.add("active")
    },
    getSheetByName(sheetName){
        return sheetsPad.querySelector(`.sheet[name="${sheetName}"]`)
    }
}

// Defining
sheetsPad.querySelectorAll(".sheet").forEach(sheet => workbook.defineSheet(sheet))

// Adding EventListeners to tabs pad
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => {
        workbook.activeSheet = workbook.getSheetByName(tab.textContent)
    }))

// The sheet-row-cell methods below take elements and define new methods and fields
workbook.defineSheet=(sheet) => {                               // SHEET LEVEL
     Object.defineProperties(sheet, {
         get name() { return sheet.getAttribute("name")},
         get table() { return sheet.closest("table") },
         get rows() { return sheet.table.rows }
    })

    sheet.rows.forEach(row => sheet.defineRow(row))

    sheet.defineRow=(row) => {                                  // ROW LEVEL
        Object.defineProperties(row, {
            get sheetParent() { return sheet }
        })
        row.cells.forEach(cell => row.defineCell())

        row.defineCell=(cell) => {                              // CELL LEVEL
            Object.defineProperties(cell, {
                get rowParent() { return row },
                get rowIndex() { return row.rowIndex }
            })
        }
    }
}

