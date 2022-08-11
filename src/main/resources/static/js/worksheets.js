import {tabsPad, workbook} from "./workbook"
import "./workbook/webSocket.js"

// Starting the tabs pad
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => {
        workbook.activeSheet = workbook.getSheetByName(tab.textContent)
    }))

// The sheet selected by default
workbook.activeSheet = workbook.sheets[0]

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
                if (ajax.status === 200) {
                    import("./editor")
                    activate()
                }
                else if (ajax.status !== 401) alert(ajax.responseText)
            }
        }
    }
    function activate() {
        document.body.classList.add("editor-mode")
        editorActivator.classList.add("active")
    }
    function deactivate() {
        document.body.classList.remove("editor-mode")
        editorActivator.classList.remove("active")
    }
})