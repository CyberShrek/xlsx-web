// Inserting a link to editor's css
document.querySelector("head").insertAdjacentHTML("beforeend",
    `<link rel="stylesheet" href="css/worksheets-editor.css"/>`)

// Inserting the editor panel
document.body.insertAdjacentHTML("afterbegin", `<editor-pad>
    <section>
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
        <dash></dash>
        <font-bold class="font-style button"
             title="Жирный"
             style="font-weight: bold">Ж
        </font-bold>
        <font-italic class="font-style button"
             title="Курсив"
             style="font-style: italic">К
        </font-italic>
        <font-underline class="font-style button"
             title="Подчёркнутый"
             style="text-decoration: underline">Ч
        </font-underline>
        <dash></dash>
        <background-color class="palette" title="Цвет заливки">
            <value style="background: rgb(255, 163, 163)"></value>
            <value style="background: rgb(255, 255, 153)"></value>
            <value style="background: rgb(189, 220, 168)"></value>
            <value style="background: rgb(182, 210, 236)"></value>
            <value style="background: rgb(255, 255, 255)"></value>
            <value style="background: rgb(192, 192, 192)"></value>
        </background-color>
        <dash></dash>
        <align-text-left class="align-text button"
             title="Выровнять по левому краю">
            <img src="img/align text left.png">
        </align-text-left>
        <align-text-right class="align-text button"
             title="Выровнять по правому краю">
            <img src="img/align text right.png">
        </align-text-right>
        <align-text-center class="align-text button"
             title="Выровнять по центру">
            <img src="img/align text center.png">
        </align-text-center>
    </section>
    <section>
        <add-row class="row-column button"
             title="Добавление строк">
            <img src="img/add row.png">
        </add-row>
        <add-column class="row-column button"
             title="Добавление колонок">
            <img src="img/add column.png">
        </add-column>
        <dash></dash>
        <remove-row class="row-column button"
             title="Удаление строк">
            <img src="img/remove row.png">
        </remove-row>
        <remove-column class="row-column button"
             title="Удаление колонок">
            <img src="img/remove column.png">
        </remove-column>
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