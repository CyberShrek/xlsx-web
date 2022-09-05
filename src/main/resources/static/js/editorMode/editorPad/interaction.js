import {editorPad} from "./editorPad.js"
import {httpClient} from "../../basis/web/httpClient.js"
import {workbook} from "../../basis/workbook/workbook.js"

// Adding the styles updater
document.addEventListener(workbook.updateEvent.type,
    () => editorPad.setStyle(workbook.activeSheet.matrixSelector.cellA.style))

editorPad.createSheetButton.onclick=() => {
    const sheetName = prompt("Создать новый лист:", generateUniqueSheetName("Лист"))
    if (sheetName && sheetName !== ""){
        if (workbook.getSheetByName(sheetName))
            alert("Лист с таким именем уже существует!")
        else
            httpClient.createSheet(sheetName).catch(e => alert(e))
    }
    function generateUniqueSheetName(word, iteration) {
        let sheetName = word + (iteration ? " " + iteration : "")
        if (workbook.getSheetByName(sheetName)){
            return generateUniqueSheetName(word, iteration ? iteration + 1 : 1)
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
    const sheet = workbook.activeSheet, topRow = sheet.rows[sheet.matrixSelector.cellB.rowIndex]

    handleCellsCreatorButton(editorPad.createRowButton, false,
        () => toggleElements(topRow.cells, "showing-create-row"),
        () => httpClient.createRow(topRow.location))
}
editorPad.deleteRowButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, topRow = sheet.rows[sheet.matrixSelector.cellB.rowIndex]

    // Preventing the out of array exception
    if (topRow.rowIndex === sheet.rows.length - 1) return
    const rowToRemove = sheet.rows[topRow.rowIndex + 1]

    handleCellsCreatorButton(editorPad.deleteRowButton, true,
        () => toggleElements(rowToRemove.cells, "showing-delete-row"),
        () => httpClient.deleteRow(rowToRemove.location))
}

editorPad.createColumnButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, leftCell = sheet.matrixSelector.cellB

    handleCellsCreatorButton(editorPad.createColumnButton, false,
        () => toggleElements(getColumnCellsNearCell(leftCell), "showing-create-column"),
        () => httpClient.createColumn(leftCell.location))
}
editorPad.deleteColumnButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, leftCell = sheet.matrixSelector.cellB

    // Preventing the out of array exception
    if (leftCell.cellIndex === leftCell.row.cells.length - 1) return
    const columnCellToRemove = leftCell.row.cells[leftCell.cellIndex + 1]

    handleCellsCreatorButton(editorPad.deleteColumnButton, true,
        () => toggleElements(getColumnCellsNearCell(columnCellToRemove),"showing-delete-column"),
        () => httpClient.deleteColumn(columnCellToRemove.location)
    )
}
function getColumnCellsNearCell(cell) {
    const columnCells = []
    for (const row of cell.row.sheet.rows)
        columnCells.push(row.cells[cell.cellIndex])
    return columnCells
}

// High ordering function which allows creating or deleting cells by corresponding button
function handleCellsCreatorButton(targetButton, allowShowingUpdate, toggleShowingArgFun, createOrDeleteArgFun){
    // Showing where cells will be created or deleted
    toggleShowingArgFun(true)

    targetButton.addEventListener("click", createOrDelete)
    targetButton.addEventListener(
        "mouseleave", () => {
            targetButton.removeEventListener("click", createOrDelete)
            toggleShowingArgFun(true)
        },
        {once: true}
    )
    function createOrDelete() {
        createOrDeleteArgFun()
            .then(() => { if(allowShowingUpdate) toggleShowingArgFun(false)})
            .catch(e => alert(e))
    }
}
function toggleElements(elements, className){
    for (const element of elements) element.classList.toggle(className)
}

editorPad.alignTextLeftButton.onclick=()   => setAlign("left")
editorPad.alignTextRightButton.onclick=()  => setAlign("right")
editorPad.alignTextCenterButton.onclick=() => setAlign("center")
function setAlign(align){ setStyle("textAlign", align) }

editorPad.fontBoldButton.onclick=(event)      => setFontStyle(event, "fontBold")
editorPad.fontItalicButton.onclick=(event)    => setFontStyle(event, "fontItalic")
editorPad.fontUnderlineButton.onclick=(event) => setFontStyle(event, "fontUnderline")
function setFontStyle(event, styleName) { setStyle(styleName, !event.target.classList.contains("active")) }

editorPad.fontSizePalette.querySelectorAll("value").forEach(paletteValue =>
    paletteValue.onclick=() => setStyle("fontSize", paletteValue.textContent))

editorPad.backgroundColorPalette.querySelectorAll("value").forEach(paletteValue =>
    paletteValue.onclick=() => setStyle("backgroundColor", paletteValue.style.backgroundColor))

function setStyle(styleName, value) {
    const cellLocations = []
    workbook.activeSheet.matrixSelector.cells.forEach(cell => cellLocations.push(cell.location))

    httpClient.patchStyle(styleName, value, cellLocations)
        .catch(e => alert(e))
}