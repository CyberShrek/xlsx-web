// Activating the tabs pad
import {workbook} from "../workbook/workbook.js"
import {httpClient} from "../web/httpClient.js"
import {tabsPad} from "./tabsPad.js"

tabsPad.tadsSection.onclick = (event) => {
    const tab = event.target.closest(".tab")
    if (tab === null || tab.classList.contains("active")) return
    workbook.activeSheet = workbook.getSheetByName(tab.textContent)
}

// Document download form
// tabsPad.downloader.onclick = () => httpClient.downloadFile()

// Editor mode switcher
tabsPad.editorActivator.onclick = () => {
    if (document.body.classList.contains("editor-mode"))
        deactivate()
    else {
        // Checking if the editor panel already has been loaded
        if (document.querySelector("editor-pad") !== null)
            activate()
        else {
            httpClient.requestPermissionToEdit()
                .then(permitted => {
                    if (permitted)
                        return import("../../editorMode/editorMode.js")
                            .then(() => activate())
                })
                .catch(error => alert(error))
        }
    }

    function activate() {
        document.body.classList.add("editor-mode")
        tabsPad.editorActivator.classList.add("active")
        document.dispatchEvent(workbook.updateEvent)
    }

    function deactivate() {
        document.body.classList.remove("editor-mode")
        tabsPad.editorActivator.classList.remove("active")
    }
}