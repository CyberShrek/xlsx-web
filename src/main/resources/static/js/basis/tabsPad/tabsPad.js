export const tabsPad = document.querySelector("tabs-pad")

Object.defineProperties(tabsPad, {
    tadsSection: { get(){ return tabsPad.querySelector(".tabs") }},
    tabs:        { get(){ return this.tadsSection.querySelectorAll(".tab") }},
    activeTab:   { get(){ return this.tadsSection.querySelector(".tab.active") }},
    // Buttons
    buttonsSection:  { get(){ return tabsPad.querySelector(".buttons") }},
    downloader:      { get(){ return this.buttonsSection.querySelector(".button.download") }},
    editorActivator: { get(){ return this.buttonsSection.querySelector(".button.edit") }},
})

tabsPad.getTabByName=(name) => {
    return tabsPad.querySelector(`.tab[name="${name}"]`)
}