import {editorPad} from "./editorPad.js"
import {httpClient} from "../../basis/web/httpClient.js"
import {workbook} from "../../basis/workbook/workbook.js"

// Adding the styles updater
document.addEventListener(workbook.updateEvent.type, () => {
    const cell = workbook.activeSheet.matrixSelector.cellA
    if (cell) editorPad.setStyle(cell.style)
})

editorPad.addSheet.onclick=() => {
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

editorPad.removeSheet.onclick=() => {
    const sheetName = workbook.activeSheet.name
    if (confirm("Вы действительно хотите удалить лист " + sheetName + "?"))
        httpClient.removeSheet(sheetName).catch(e => alert(e))
}

editorPad.addRow.onclick=() => {

}