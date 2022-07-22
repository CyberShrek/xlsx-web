import {sheetsPad, tabsPad} from "../usages.js"

// Adding sheet selectors
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => tabsPad.selectTab(tab)))

tabsPad.selectTab = (tab) => {
    tabsPad.querySelector(".tab.selected")?.classList.remove("selected")
    tab.classList.add("selected")
    sheetsPad.querySelector(".sheet.selected")?.classList.remove("selected")
    sheetsPad.querySelector(`.sheet[name="${tab.textContent}"]`).classList.add("selected")
}