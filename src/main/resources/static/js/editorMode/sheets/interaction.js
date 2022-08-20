import {httpClient} from "../../basis/web/httpClient.js"
import {sheetsEl} from "../../basis/workbook/workbook.js"

sheetsEl.ondblclick=(event) => {
    if(!document.body.classList.contains("editor-mode")) return

    const cell = event.target.closest("td")
    if (cell === null) return

    const sheet   = cell.closest(".sheet")
    const content = cell.content
    const oldText = content.textContent

    content.style.cursor     = "text"
    content.style.userSelect = "text"
    content.contentEditable      = true
    sheet.matrixSelector.enabled = false
    content.focus()

    content.addEventListener("blur", appendChanges, {once: true})

    function appendChanges() {
        content.height           = ""
        content.style.cursor     = ""
        content.style.userSelect = ""
        content.contentEditable      = false
        sheet.matrixSelector.enabled = true

        if (content.textContent !== oldText)
            httpClient.setCellText(sheet.name, cell.rowIndex, cell.cellIndex, content.textContent)
                .catch(e => {
                    content.textContent = oldText
                    alert(e)
                })
    }
}
