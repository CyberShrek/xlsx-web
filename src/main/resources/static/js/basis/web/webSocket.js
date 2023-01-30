import {workbook} from "../workbook/workbook.js"

const webSocket = new WebSocket(`ws://${document.location.host + document.location.pathname}spreader`)

webSocket.onmessage = (event) => {
    const order = JSON.parse(event.data)

    switch (order.order) {
        case "create sheet": workbook.createSheet(order.location.sheetName); break
        case "delete sheet": workbook.deleteSheet(order.location.sheetName); break
        case "rename sheet": getTargetSheet().name = order.newName; break

        case "create row"   : getTargetSheet().createRow(order.location.rowIndex); break
        case "delete row"   : getTargetSheet().deleteRow(order.location.rowIndex); break
        case "create column": getTargetSheet().createColumn(order.location.cellIndex); break
        case "delete column": getTargetSheet().deleteColumn(order.location.cellIndex); break

        case "patch cell": {
            if(order.patch.text)  getTargetCell().text = order.patch.text
            if(order.patch.style) patchCellStyle(getTargetCell(), order.patch.style)
        } break

        default: alert("Unknown order: " + event.data)
    }

    function patchCellStyle(cell, patch){
        if(patch.align)                    cell.style.textAlign      = patch.align
        if(patch.fontSize)                 cell.style.fontSize       = patch.fontSize + "pt"
        if(patch.background)               cell.style.background     = patch.background
        if(patch.bold !== undefined)       cell.style.fontWeight     = patch.bold ? "bold" : "normal"
        if(patch.italic !== undefined)     cell.style.fontStyle      = patch.italic ? "italic" : "normal"
        if(patch.underlined !== undefined) cell.style.textDecoration = patch.underlined ? "underline" : "none"

        document.dispatchEvent(workbook.updateEvent)
    }

    function getTargetSheet() {
        return workbook
            .getSheetByName(order.location.sheetName)
    }
    function getTargetCell() {
        return getTargetSheet()
            .rows[order.location.rowIndex]
            .cells[order.location.cellIndex]
    }
}