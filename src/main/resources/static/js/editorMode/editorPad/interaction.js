import {editorPad} from "./editorPad.js"
import {httpClient} from "../../basis/web/httpClient.js"
import {workbook} from "../../basis/workbook/workbook.js"

// Adding the styles updater
document.addEventListener(workbook.updateEvent.type,
    () => editorPad.setStyle(workbook.activeSheet.matrixSelector.cellA.style))

editorPad.createSheetButton.onclick=() => {
    const sheetName = prompt("Создать новый лист:", generateUniqueSheetName("Лист "))
    if (sheetName !== null && sheetName !== ""){
        if (workbook.getSheetByName(sheetName))
            alert("Лист с таким именем уже существует!")
        else
            httpClient.createSheet(sheetName).catch(e => alert(e))
    }
    function generateUniqueSheetName(word, iteration) {
        let sheetName = word + (iteration ? iteration : "")
        if (workbook.getSheetByName(sheetName)){
            return generateUniqueSheetName(word, iteration + 1)
        }
        return sheetName
    }
}
editorPad.deleteSheetButton.onclick=() => {
    const sheetName = workbook.activeSheet.name
    if (confirm("Вы действительно хотите удалить лист " + sheetName + "?"))
        httpClient.deleteSheet(sheetName).catch(e => alert(e))
}

editorPad.createRowButton.onmouseenter=() => {
    const sheet = workbook.activeSheet,
          rowIndex = sheet.matrixSelector.cellB.rowIndex,
          row = sheet.rows[rowIndex]

    // Showing where a new row will be created
    toggleElements("showing-create-row", row.cells)

    const createRow=() => httpClient.createRow(sheet.name, rowIndex).catch(e => alert(e))
    editorPad.createRowButton.addEventListener("click", createRow)
    editorPad.createRowButton.addEventListener(
        "mouseleave", () => {
            editorPad.createRowButton.removeEventListener("click", createRow)
            toggleElements("showing-create-row", row.cells)
        },
        {once: true})
}
editorPad.deleteRowButton.onmouseenter=() => {
    const sheet = workbook.activeSheet,
          rowIndex = sheet.matrixSelector.cellB.rowIndex

    // Row to remove is a row after the actual selected cell
    if (rowIndex === sheet.rows.length-1) return
    const row = sheet.rows[rowIndex + 1]

    // Showing where a new row will be deleted
    toggleElements("showing-delete-row", row.cells)

    const deleteRow=() => httpClient.deleteRow(sheet.name, rowIndex).catch(e => alert(e))
    editorPad.deleteRowButton.addEventListener("click", deleteRow)
    editorPad.deleteRowButton.addEventListener(
        "mouseleave", () => {
            editorPad.deleteRowButton.removeEventListener("click", deleteRow)
            toggleElements("showing-delete-row", row.cells)
        },
        {once: true})
}

editorPad.createColumnButton.onmouseenter=() => {
    const sheet = workbook.activeSheet,
          cellIndex = sheet.matrixSelector.cellB.cellIndex,
          columnCells = []
    for (const row of sheet.rows)
        columnCells.push(row.cells[cellIndex])

    // Showing where a new column will be created
    toggleElements("showing-create-column", columnCells)

    const createColumn=() => httpClient.createColumn(sheet.name, cellIndex).catch(e => alert(e))
    editorPad.createColumnButton.addEventListener("click", createColumn)
    editorPad.createColumnButton.addEventListener(
        "mouseleave", () => {
            editorPad.createColumnButton.removeEventListener("click", createColumn)
            toggleElements("showing-create-column", columnCells)
        },
        {once: true})
}
editorPad.deleteColumnButton.onmouseenter=() => {
    const sheet = workbook.activeSheet,
        cellIndex = sheet.matrixSelector.cellB.cellIndex

    // Column to remove is a column after the actual selected cell
    if (cellIndex === sheet.rows[0].cells.length - 1) return
    const columnCells = []
    for (const row of sheet.rows)
        columnCells.push(row.cells[cellIndex + 1])

    // Showing where a new column will be created
    toggleElements("showing-delete-column", columnCells)

    const deleteColumn = () => httpClient.deleteColumn(sheet.name, cellIndex).catch(e => alert(e))
    editorPad.deleteColumnButton.addEventListener("click", deleteColumn)
    editorPad.deleteColumnButton.addEventListener(
        "mouseleave", () => {
            editorPad.deleteColumnButton.removeEventListener("click", deleteColumn)
            toggleElements("showing-delete-column", columnCells)
        },
        {once: true})
}

editorPad.alignTextLeftButton.onclick=()   => setAlign("left")
editorPad.alignTextRightButton.onclick=()  => setAlign("right")
editorPad.alignTextCenterButton.onclick=() => setAlign("center")
function setAlign(align){ setStyle("textAlign", align) }

editorPad.fontBoldButton.onclick=(event)      => setFontStyle(event, "fontBold")
editorPad.fontItalicButton.onclick=(event)    => setFontStyle(event, "fontItalic")
editorPad.fontUnderlineButton.onclick=(event) => setFontStyle(event, "fontUnderline")
function setFontStyle(event, styleName) { setStyle(styleName, !event.classList.contains("active")) }

editorPad.fontSizePalette.onmouseenter=() => {}

editorPad.backgroundColorPalette.onmouseenter=() => {}

function toggleElements(className, elements) {
    for (const element of elements)
        element.classList.toggle(className)
}
function setStyle(styleName, action) {
    httpClient.patchStyle(workbook.activeSheet.matrixSelector.cells, styleName, action)
}