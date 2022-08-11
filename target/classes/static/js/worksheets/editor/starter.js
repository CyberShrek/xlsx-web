import {editorPad} from "./editorPad.js"
import {workbook} from "../workbook.js"


// Adding the styles updaters
workbook.sheets.forEach(sheet => {
    sheet.addEventListener("selectionUpdate", ()=>{
        editorPad.setStyle(sheet.selectionMatrix.cellA.style)
    })
})

// Updates the displayed values in the pad (fonts, styles, align, etc.) according to an argument style
editorPad.setStyle=(style)=>{
    editorPad.selectFontSize(style.fontSize)
    editorPad.selectBackground(style.background)
    if (style.fontWeight === 'bold') editorPad.selectBold()
    else editorPad.resetBold()

    if (style.fontStyle === 'italic') editorPad.selectItalic()
    else editorPad.resetItalic()

    if (style.textDecoration === 'underline') editorPad.selectUnderline()
    else editorPad.resetUnderline()

    if      (style.textAlign === 'start')  editorPad.selectAlignLeft()
    else if (style.textAlign === 'center') editorPad.selectAlignCenter()
    else if (style.textAlign === 'end')    editorPad.selectAlignRight()
}

editorPad.selectFontSize=(fontSize) => {
    for (const paletteCell of editorPad.fontSizePalette.querySelectorAll("value")) {
        if (paletteCell.textContent === fontSize.replace("pt", "")) paletteCell.classList.add("active")
        else paletteCell.classList.remove("active")
    }
}
editorPad.selectBackground=(background) => {
    for (const paletteCell of editorPad.backgroundColorPalette.querySelectorAll("value")) {
        if (paletteCell.style.background === background) paletteCell.classList.add("active")
        else paletteCell.classList.remove("active")
    }
}
editorPad.selectBold=()      => editorPad.fontBoldButton.classList.add("active")
editorPad.resetBold=()       => editorPad.fontBoldButton.classList.remove("active")
editorPad.selectItalic=()    => editorPad.fontItalicButton.classList.add("active")
editorPad.resetItalic=()     => editorPad.fontItalicButton.classList.remove("active")
editorPad.selectUnderline=() => editorPad.fontUnderlineButton.classList.add("active")
editorPad.resetUnderline=()  => editorPad.fontUnderlineButton.classList.remove("active")

editorPad.selectAlignLeft=() => {
    editorPad.alignTextLeftButton.classList.add("active")
    editorPad.alignTextCenterButton.classList.remove("active")
    editorPad.alignTextRightButton.classList.remove("active")
}
editorPad.selectAlignCenter=() => {
    editorPad.alignTextLeftButton.classList.remove("active")
    editorPad.alignTextCenterButton.classList.add("active")
    editorPad.alignTextRightButton.classList.remove("active")
}
editorPad.selectAlignRight=() => {
    editorPad.alignTextLeftButton.classList.remove("active")
    editorPad.alignTextCenterButton.classList.remove("active")
    editorPad.alignTextRightButton.classList.add("active")
}