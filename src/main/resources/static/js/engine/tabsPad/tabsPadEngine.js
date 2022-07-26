import {sheetsPad, tabsPad} from "../usages.js"


tabsPad.getActiveTab = () => tabsPad.querySelector(".tab.active")

tabsPad.selectTab = (tab) => {
    tabsPad.getActiveTab()?.classList.remove("active")
    tab.classList.add("active")
    sheetsPad.getActiveSheet()?.classList.remove("active")
    sheetsPad.querySelector(`.sheet[name="${tab.textContent}"]`).classList.add("active")
}

// Adding sheet selectors
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => tabsPad.selectTab(tab)))

