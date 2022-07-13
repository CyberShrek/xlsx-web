// Usages:
var tabsPadEl,
    sheetsEl

window.onload = () => {
    tabsPadEl = document.getElementById("tabs-pad")
    sheetsEl = document.getElementById("sheets")

    // The first sheet is selected by default
    selectSheetViaTab(tabsPadEl.querySelector(".tab"))

    // Adding sheets selector via the tabs pad
    tabsPadEl.querySelectorAll(".tab").forEach(
        tab => tab.addEventListener("click", () => selectSheetViaTab(tab)))

    // Adding row sorters into heading cells
    sheetsEl.querySelectorAll(".heading td .content").forEach(cell => {
        const sorter = document.createElement("div"),
            sorterImg = document.createElement("img")
        sorter.className = "sorter"
        sorterImg.src = "img/sorting a-z.png"
        sorter.append(sorterImg)
        cell.append(sorter)
    })
}

function selectSheetViaTab(tab) {
    tabsPadEl.querySelector(".tab.selected")?.classList.remove("selected")
    tab.classList.add("selected")
    sheetsEl.querySelector(".sheet.selected")?.classList.remove("selected")
    sheetsEl.querySelector(`.sheet[name="${tab.textContent}"]`).classList.add("selected")
}

// function sortRowsViaCellHea