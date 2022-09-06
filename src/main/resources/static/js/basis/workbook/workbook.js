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
        sheetsEl.insertAdjacentHTML(
            "beforeend",`
            <div class="sheet" name="${sheetName}">
                <table><tr class="header"></tr></table>
            </div>`)

        const sheet = workbook.getSheetByName(sheetName)
        sheet.querySelector("tr").append(createEmptyCell())

        // Corresponding tab
        tabsPad.tadsSection.insertAdjacentHTML(
            "beforeend",
            `<div class="tab" name="${sheetName}">${sheetName}</div>`)

        this.defineSheet(sheet)
        workbook.activeSheet = sheet
    },
    deleteSheet(sheetName){
        this.getSheetByName(sheetName).remove()
        tabsPad.getTabByName(sheetName).remove()
    },
    // The sheet-row-cell methods take elements and define new methods and fields
    defineSheet(sheet) {
        Object.defineProperties(sheet, {
            name : {
                get(){ return sheet.getAttribute("name") },
                set(v){
                    const correspondingTab = tabsPad.getTabByName(sheet.name)
                    correspondingTab.setAttribute("name", v)
                    correspondingTab.textContent = correspondingTab.getAttribute("name")
                    sheet.setAttribute("name", v)
                }},
            table: {get(){ return sheet.querySelector("table") }},
            rows : {get(){ return sheet.table.rows }}
        })

        sheet.createRow=(rowIndex) => {
            const row = document.createElement("tr")
            for (let i = 0; i < sheet.rows[0].cells.length; i++) {
                row.append(createEmptyCell())
            }
            sheet.rows[0].parentNode.insertBefore(row, sheet.rows[rowIndex + 1])
            sheet.defineRow(row)
        }
        sheet.deleteRow=(rowIndex) => sheet.rows[rowIndex].remove()
        sheet.createColumn=(columnIndex) => {
            for (const row of sheet.rows) {
                const cell = createEmptyCell()
                row.insertBefore(cell, row.cells[columnIndex + 1])
                row.defineCell(cell)
            }
        }
        sheet.deleteColumn=(columnIndex) => {
            for (const row of sheet.rows) {
                row.cells[columnIndex].remove()
            }
        }
        sheet.defineRow=(row) => {
            Object.defineProperties(row, {
                sheet: {get(){ return sheet }},
                location: {get() {
                    return {
                        sheetName: sheet.name,
                        rowIndex: row.rowIndex
                    }
                }}
            })

            row.defineCell=(cell) => {
                Object.defineProperties(cell, {
                    row      : {get(){ return row }},
                    rowIndex : {get(){ return row.rowIndex }},
                    content  : {get(){ return cell.querySelector(".content")}},
                    location : {get(){
                        return {
                            sheetName: sheet.name,
                            rowIndex: row.rowIndex,
                            cellIndex: cell.cellIndex
                        }
                    }}
                })
                cell.setFontSize=(fontSize)     => cell.style.fontSize = fontSize
                cell.setTextAlign=(textAlign)   => cell.style.textAlign = textAlign
                cell.setBackground=(background) => cell.style.background = background

                cell.setBold=(set)      => cell.style.fontWeight = (set) ? "bold" : "normal"
                cell.setItalic=(set)    => cell.style.fontStyle = (set) ? "italic" : "normal"
                cell.setUnderline=(set) => cell.style.textDecoration = (set) ? "underline" : "none"
            }
            for (const cell of row.cells) row.defineCell(cell)
        }
        for (const row of sheet.rows) sheet.defineRow(row)

        addSortersToSheet(sheet)
        addMatrixSelectorToSheet(sheet)
    }
}

function createEmptyCell(){
    const cell = document.createElement("td")
    cell.insertAdjacentHTML("afterbegin", `<div class="content"></div>`)

    // Applying the default styles
    cell.style.fontSize = "11pt"
    cell.style.background = "#FFFFFF"

    return cell
}