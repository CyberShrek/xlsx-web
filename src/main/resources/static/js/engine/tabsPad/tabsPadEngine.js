export const tabsPadEngine = {}

// Adding sheet selectors
document.querySelectorAll("#tabs-pad .tab").forEach(
    tab => tab.addEventListener("click", () => tabsPadEngine.selectTab(tab)))

tabsPadEngine.selectTab = (tab) => {
    document.querySelector("#tabs-pad .tab.selected")?.classList.remove("selected")
    tab.classList.add("selected")
    document.querySelector("#sheets-pad .sheet.selected")?.classList.remove("selected")
    document.querySelector(`#sheets-pad .sheet[name="${tab.textContent}"]`).classList.add("selected")
}