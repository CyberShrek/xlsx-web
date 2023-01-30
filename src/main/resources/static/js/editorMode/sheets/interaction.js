import {httpClient} from "../../basis/web/httpClient.js"
import {sheetsEl} from "../../basis/workbook/workbook.js"

sheetsEl.ondblclick = (event) => {
    if (!document.body.classList.contains("editor-mode")) return

    const cell = event.target.closest("td")
    if (cell === null) return

    const sheet   = cell.row.sheet
    const content = cell.content
    const oldText = content.textContent

    cell.classList.add("editor-mode")
    content.contentEditable = true
    sheet.matrixSelector.enabled = false
    content.focus()

    content.addEventListener("blur", appendChanges, {once: true})

    function appendChanges() {
        cell.classList.remove("editor-mode")
        content.contentEditable = false
        sheet.matrixSelector.enabled = true

        if (content.textContent !== oldText)
            httpClient.patchCellText(cell.location, content.textContent)
                .catch(e => {
                    content.textContent = oldText
                    alert(e)
                })
    }
}

