const // Usages
    sheetsPad = document.querySelector("#sheets-pad"),
    tabsPad   = document.querySelector("#tabs-pad")

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
    },
    getCellFromEvent(event){
        return event.target.closest("td")
    },
    // The sheet-row-cell methods take elements and define new methods and fields
    defineSheet(sheet) {                                           // SHEET LEVEL
        Object.defineProperties(sheet, {
            name : {get(){ return sheet.getAttribute("name") }},
            table: {get(){ return sheet.querySelector("table") }},
            rows : {get(){ return sheet.table.rows }}
        })
        sheet.defineRow=(row) => {                                  // ROW LEVEL
            Object.defineProperties(row, {
                sheetParent: {get(){ return sheet }}
            })
            row.defineCell=(cell) => {                              // CELL LEVEL
                Object.defineProperties(cell, {
                    rowParent: {get(){ return row }},
                    rowIndex : {get(){ return row.rowIndex }},
                    text     : {get(){ return cell.querySelector(".content").textContent}}
                })
            }
            for (const cell of row.cells) row.defineCell(cell)
        }
        for (const row of sheet.rows) sheet.defineRow(row)
    }
}

// Defining
workbook.sheets.forEach(sheet => workbook.defineSheet(sheet))

// Adding EventListeners to tabs pad
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => {
        workbook.activeSheet = workbook.getSheetByName(tab.textContent)
    }))