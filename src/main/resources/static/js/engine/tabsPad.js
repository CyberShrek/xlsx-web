import {Workbook} from "../entities/Workbook.js"

export const tabsPad = document.getElementById("tabs-pad")

tabsPad.getActiveTab=() => tabsPad.querySelector(".tab.active")

tabsPad.selectSheet=(tab) => {
    tabsPad.getActiveTab()?.classList.remove("active")
    tab.classList.add("active")
    Workbook.getActiveSheet()?.classList.remove("active")
    Workbook.sheets.get(tab.textContent).element.classList.add("active")
}

// Adding sheet selectors
tabsPad.querySelectorAll(".tab").forEach(
    tab => tab.addEventListener("click", () => tabsPad.selectSheet(tab)))

