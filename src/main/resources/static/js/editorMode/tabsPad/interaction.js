import {tabsPad} from "../../basis/tabsPad/tabsPad.js"
import {workbook} from "../../basis/workbook/workbook.js"
import {httpClient} from "../../basis/web/httpClient.js"

tabsPad.tadsSection.ondblclick=(event) => {
    if(!document.body.classList.contains("editor-mode")) return

    const oldName = event.target.closest(".tab").textContent
    let newName = prompt("Изменить название листа: ", oldName)
    if (newName !== null && newName !== "" && newName !== oldName) {
        newName = newName.slice(0, 31) // 31 is the maximum length of a sheet name according to Excel specs
        if (workbook.getSheetByName(newName))
            alert("Лист с таким именем уже существует!")
        else
            httpClient.renameSheet(oldName, newName)
                .catch(e => alert(e))
    }
}