import {workbook} from "../workbook.js"

// Inserting a link to editor's css
document.querySelector("head").insertAdjacentHTML("beforeend",
    `<link rel="stylesheet" href="css/worksheets-editor.css"/>`)

// Inserting the editor panel
document.body.insertAdjacentHTML("afterbegin", `<editor-pad>
    <section>
        <cells-editor>
            <font-size class="palette" title="Размер шрифта">
                <value> 8</value>
                <value> 9</value>
                <value>10</value>
                <value>11</value>
                <value>12</value>
                <value>14</value>
                <value>16</value>
                <value>18</value>
                <value>20</value>
                <value>22</value>
                <value>24</value>
                <value>26</value>
                <value>28</value>
                <value>36</value>
                <value>48</value>
                <value>72</value>
            </font-size>
            <background-color class="palette" title="Цвет заливки">
                <value style="background: rgb(255, 163, 163)"></value>
                <value style="background: rgb(255, 255, 153)"></value>
                <value style="background: rgb(189, 220, 168)"></value>
                <value style="background: rgb(182, 210, 236)"></value>
                <value style="background: rgb(255, 255, 255)"></value>
                <value style="background: rgb(192, 192, 192)"></value>
            </background-color>
        </cells-editor>
        <divider></divider>
        <cells-editor>
            <font-bold class="button"
                 title="Жирный"
                 style="font-weight: bold">Ж
            </font-bold>
            <font-italic class="button"
                 title="Курсив"
                 style="font-style: italic">К
            </font-italic>
            <font-underline class="button"
                 title="Подчёркнутый"
                 style="text-decoration: underline">Ч
            </font-underline>
        </cells-editor>
        <divider></divider>
        <cells-editor>
            <align-text-left class="button"
                 title="Выровнять по левому краю">
                <img src="img/align text left.png">
            </align-text-left>
            <align-text-right class="button"
                 title="Выровнять по правому краю">
                <img src="img/align text right.png">
            </align-text-right>
            <align-text-center class="button"
                 title="Выровнять по центру">
                <img src="img/align text center.png">
            </align-text-center>
        </cells-editor>
    </section>
    <section>
        <rows-editor>
            <add-row class="button"
                 title="Добавление строк">
                <img src="img/add row.png">
            </add-row>
            <add-column class="button"
                 title="Добавление колонок">
                <img src="img/add column.png">
            </add-column>
        </rows-editor>
        <divider></divider>
        <rows-editor>
            <remove-row class="button"
                 title="Удаление строк">
                <img src="img/remove row.png">
            </remove-row>
            <remove-column class="button"
                 title="Удаление колонок">
                <img src="img/remove column.png">
            </remove-column>
        </rows-editor>
    </section>
</editor-pad> `)

// Defining the just created editor-pad and it's values
export const editorPad = document.querySelector("editor-pad")
editorPad.fontSizePalette        = editorPad.querySelector("font-size")
editorPad.backgroundColorPalette = editorPad.querySelector("background-color")
editorPad.fontBoldButton         = editorPad.querySelector("font-bold")
editorPad.fontItalicButton       = editorPad.querySelector("font-italic")
editorPad.fontUnderlineButton    = editorPad.querySelector("font-underline")
editorPad.alignTextLeftButton    = editorPad.querySelector("align-text-left")
editorPad.alignTextCenterButton  = editorPad.querySelector("align-text-center")
editorPad.alignTextRightButton   = editorPad.querySelector("align-text-right")

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