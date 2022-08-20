import {addSortersToSheet} from "./interactors/sorting.js"
import {addMatrixSelectorToSheet} from "./interactors/matrixSelector.js"
import {tabsPad} from "../tabsPad/tabsPad.js"

export const sheetsEl = document.querySelector("sheets")
export const workbook = {
    updateEvent : new Event("update"),

    get sheets()     { return sheetsEl.querySelectorAll(".sheet") },
    get activeSheet(){ return sheetsEl.querySelector(".sheet.active")},

    set activeSheet(sheet){
        const oldActiveSheet = this.activeSheet
        if (oldActiveSheet){
            oldActiveSheet.classList.remove("active")
            oldActiveSheet.matrixSelector.enabled = false
        }
        sheet.classList.add("active")
        sheet.matrixSelector.enabled = true
        // Selecting the corresponding tab
        tabsPad.activeTab?.classList.remove("active")
        tabsPad.getTabByName(sheet.name).classList.add("active")

        document.dispatchEvent(this.updateEvent)
    },
    getSheetByName(sheetName){
        return sheetsEl.querySelector(`.sheet[name="${sheetName}"]`)
    },

    createSheet(sheetName){
        const sheet = document.createElement("div")
        sheet.classList.add("sheet")
        sheet.setAttribute("name", sheetName)
        sheet.insertAdjacentHTML(
            "afterbegin", `
            <table>
                <tr class="header">
                    <td> <div class="content"></div> </td>
                </tr>
            </table>`
        )
        sheetsEl.append(sheet)
        // Corresponding tab creation
        const tab = document.createElement("div")
        tab.classList.add("tab")
        tab.textContent = sheetName
        tabsPad.tadsSection.append(tab)
        this.defineSheet(sheet)
        return sheet
    },
    removeSheet(sheetName){
        this.getSheetByName(sheetName).remove()
    },
    // The sheet-row-cell methods take elements and define new methods and fields
    defineSheet(sheet) {
        Object.defineProperties(sheet, {
            name : {get(){ return sheet.getAttribute("name") }},
            table: {get(){ return sheet.querySelector("table") }},
            rows : {get(){ return sheet.table.rows }}
        })

        sheet.createRow=(rowIndex) => {
            const row = document.createElement("tr")
            for (let i = 0; i < sheet.rows[0].cells.length-1; i++) {
                row.insertAdjacentHTML("beforeend",
                    `<td> <div class="content"></div> </td>`)
            }
            sheet.table.insertBefore(row, sheet.rows[rowIndex])
            sheet.defineRow(row)
            return row
        }
        sheet.createColumn=(columnIndex) => {
            const column = []
            for (const row of sheet.rows) {
                const cell = document.createElement("td")
                cell.insertAdjacentHTML("afterbegin", `<div class="content"></div>`)
                row.insertBefore(cell, row[columnIndex])
                row.defineCell(cell)
                column.push(cell)
            }
            return column
        }
        sheet.removeRow=(rowIndex) => sheet.rows[rowIndex].remove()
        sheet.removeColumn=(columnIndex) => {
            for (const row of sheet.rows) {
                row.cells[columnIndex].remove()
            }
        }

        addSortersToSheet(sheet)
        addMatrixSelectorToSheet(sheet)

        sheet.defineRow=(row) => {

            row.defineCell=(cell) => {
                Object.defineProperties(cell, {
                    rowIndex : {get(){ return row.rowIndex }},
                    content  : {get(){ return cell.querySelector(".content")}}
                })
            }
            for (const cell of row.cells) row.defineCell(cell)
        }
        for (const row of sheet.rows) sheet.defineRow(row)
    }
}