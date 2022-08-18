import {editorPad} from "./editorPad.js"
import {httpClient} from "../../basis/web/httpClient.js"
import {workbook} from "../../basis/workbook/workbook.js"

// Adding the styles updater
workbook.sheets.forEach(sheet => {
    sheet.addEventListener(workbook.updateEvent.type, ()=>{
        const cell = sheet.selectionMatrix.cellA
        if (cell)
            editorPad.setStyle(cell.style)
    })
})

editorPad.addSheet.onclick=() => {
    const sheetName = prompt("Введите название нового листа", generateUniqueSheetName("Лист "))
    if (sheetName !== null && sheetName !== ""){
        if (workbook.getSheetByName(sheetName))
            alert("Лист с таким именем уже существует!")
        else
            httpClient.createSheet(sheetName).catch(e => alert(e))
    }
    function generateUniqueSheetName(word, iteration) {
        let sheetName = word + iteration
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

// editorPad.renameSheet.onclick=() => {
//     const oldName = workbook.activeSheet.name
//     const newName = prompt("Введите новое название листа", oldName)
//     if (newName !== null && newName !== ""){
//         if (workbook.getSheetByName(newName))
//             alert("Лист с таким именем уже существует!")
//         else
//             httpClient.renameSheet(oldName, newName)
//     }
// }

editorPad.addRow.onclick=() => {

}