export class TabsPadEngine {
    static _instance
    constructor() {
        if (TabsPadEngine._instance !== undefined) return TabsPadEngine._instance
        TabsPadEngine._instance = this

        // Adding sheet selectors
        document.querySelectorAll("#tabs-pad .tab").forEach(
            tab => tab.addEventListener("click", () => this.selectTab(tab)))
    }

    selectTab(tab) {
        document.querySelector("#tabs-pad .tab.selected")?.classList.remove("selected")
        tab.classList.add("selected")
        document.querySelector("#sheets-pad .sheet.selected")?.classList.remove("selected")
        document.querySelector(`#sheets-pad .sheet[name="${tab.textContent}"]`).classList.add("selected")
    }
}