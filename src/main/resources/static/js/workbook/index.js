import {addSortersToSheet} from "./sortingGear.js"
import {addMatrixSelectorToSheet} from "./matrixSelector.js"
import "./webSocket.js"

const // Usages
    sheetsPad = document.querySelector("sheets-pad"),
    tabsPad   = document.querySelector("tabs-pad")

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
        // Selecting the corresponding tab
        tabsPad.querySelector(".tab.active")?.classList.remove("active")
        tabsPad.querySelector(`.tab[name="${sheet.name}"]`).classList.add("active")

        sheet.dispatchEvent(this.updateEvent)
    },
    getSheetByName(sheetName){
        return sheetsPad.querySelector(`.sheet[name="${sheetName}"]`)
    },
    getCellFromEvent(event){
        return event.target.closest("td")
    },

    createSheet(sheetName){
        const sheet = document.createElement("div")
        sheet.classList.add("sheet")
        sheet.setAttribute("name", sheetName)
        sheet.insertAdjacentHTML("afterbegin", `
        <table>
            <tr class="header">
                <td> <div class="content"></div> </td>
            </tr>
        </table>
        `)
        sheetsPad.append(sheet)
        tabsPad.querySelector(".buttons")
            .insertAdjacentHTML("beforebegin", `<div class="tab">${sheetName}</div>`)
        this.defineSheet()
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
            Object.defineProperties(row, {
                sheetParent: {get(){ return sheet }}
            })

            row.defineCell=(cell) => {
                Object.defineProperties(cell, {
                    rowParent: {get(){ return row }},
                    rowIndex : {get(){ return row.rowIndex }},
                    value    : {
                        get(){ return cell.querySelector(".content").textContent },
                        set(text){ cell.value = text }}
                })
            }
            for (const cell of row.cells) row.defineCell(cell)
        }
        for (const row of sheet.rows) sheet.defineRow(row)
    },

    updateEvent : new Event("update")
}

// Starting the sheets pad
workbook.sheets.forEach(sheet => workbook.defineSheet(sheet))

// Starting the tabs pad
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => {
        workbook.activeSheet = workbook.getSheetByName(tab.textContent)
    }))

// Adding the editor mode switcher
const editorActivator = tabsPad.querySelector(".button.edit")
editorActivator.addEventListener("click", () => {
    if (document.body.classList.contains("editor-mode"))
        deactivate()
    else {
        // Checking if the editor panel already exists
        if (document.querySelector("editor-pad") !== null)
            activate()
        else { // getting the editor panel
            const ajax = new XMLHttpRequest()
            ajax.open("GET", "editor", true)
            ajax.send()
            ajax.onerror=() => alert(ajax.responseText)
            ajax.onload=() => {
                // Authentication
                if (ajax.status === 401) return
                if (ajax.status === 204) import("../editorMode/index.js").then(() => activate())
                else alert(ajax.responseText)
            }
        }
    }
    function activate() {
        document.body.classList.add("editor-mode")
        editorActivator.classList.add("active")
        workbook.activeSheet.dispatchEvent(workbook.updateEvent)
    }
    function deactivate() {
        document.body.classList.remove("editor-mode")
        editorActivator.classList.remove("active")
    }
})

// The sheet selected by default
workbook.activeSheet = workbook.sheets[0]