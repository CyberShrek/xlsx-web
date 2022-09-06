import {editorPad} from "./editorPad.js"
import {httpClient} from "../../basis/web/httpClient.js"
import {workbook} from "../../basis/workbook/workbook.js"

// Adding the styles updater
document.addEventListener(workbook.updateEvent.type,
    () => editorPad.setStyle(workbook.activeSheet.matrixSelector.cellA.style))

editorPad.createSheetButton.onclick=() => {
    let sheetName = prompt("Создать новый лист:", generateUniqueSheetName("Лист"))
    if (sheetName && sheetName !== ""){
        sheetName = sheetName.slice(0, 31) // 31 is the maximum length of a sheet name according to Excel specs
        if (workbook.getSheetByName(sheetName))
            alert("Лист с таким именем уже существует!")
        else
            httpClient.createSheet(sheetName)
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
        httpClient.deleteSheet(sheetName)
}

editorPad.createRowButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, topRow = sheet.rows[sheet.matrixSelector.cellB.rowIndex]

    handleMouseEnterOfCellsCreatorButton(editorPad.createRowButton,
        () => true,
        (add) => toggleElements(topRow.cells, "showing-create-row", add),
        () => httpClient.createRow(topRow.location))
}
editorPad.deleteRowButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, topRow = sheet.rows[sheet.matrixSelector.cellB.rowIndex],
        getTargetRow=() => sheet.rows[topRow.rowIndex + 1]

    handleMouseEnterOfCellsCreatorButton(editorPad.deleteRowButton,
        () => topRow.rowIndex < sheet.rows.length - 1,
        (add) => toggleElements(getTargetRow().cells, "showing-delete-row", add),
        () => httpClient.deleteRow(getTargetRow().location))
}

editorPad.createColumnButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, leftCell = sheet.matrixSelector.cellB

    handleMouseEnterOfCellsCreatorButton(editorPad.createColumnButton,
        () => true,
        (add) => toggleElements(getColumnByCell(leftCell), "showing-create-column", add),
        () => httpClient.createColumn(leftCell.location))
}
editorPad.deleteColumnButton.onmouseenter=() => {
    const sheet = workbook.activeSheet, leftCell = sheet.matrixSelector.cellB,
        getTargetCell=() => leftCell.row.cells[leftCell.cellIndex + 1]

    handleMouseEnterOfCellsCreatorButton(editorPad.deleteColumnButton,
        () => leftCell.cellIndex < leftCell.row.cells.length - 1,
        (add) => toggleElements(getColumnByCell(getTargetCell()),"showing-delete-column", add),
        () => httpClient.deleteColumn(getTargetCell().location)
    )
}
function getColumnByCell(cell) {
    const columnCells = []
    for (const row of cell.row.sheet.rows)
        columnCells.push(row.cells[cell.cellIndex])
    return columnCells
}

function toggleElements(elements, className, add){
    for(const element of elements) {
        if(add) element.classList.add(className)
        else element.classList.remove(className)
    }
}

// High ordering function which allows creating or deleting cells by corresponding button
function handleMouseEnterOfCellsCreatorButton(targetButton, checkCellsExisting, toggleShowing, createOrDelete){
    if(!checkCellsExisting()) return

    let mouseEntered = true

    toggleShowing(true) // Showing where cells will be created or deleted
    targetButton.addEventListener("click", execute)
    targetButton.addEventListener(
        "mouseleave", () => {
            mouseEntered = false
            targetButton.removeEventListener("click", execute)
            if (checkCellsExisting()) toggleShowing(false)
        },
        {once: true}
    )
    // Executes operation which the target button is representing
    function execute() {
        if(checkCellsExisting()) createOrDelete()
            .then(() => {
                if (mouseEntered && checkCellsExisting())
                    toggleShowing(true) })
            .catch(e => alert(e))
    }
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
}