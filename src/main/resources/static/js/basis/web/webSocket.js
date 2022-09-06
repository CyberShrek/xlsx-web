import {workbook} from "../workbook/workbook.js"

const webSocket = new WebSocket(`ws://${document.location.host+document.location.pathname}spreader`)

webSocket.onmessage=(event) => {
    const jsonOrder = JSON.parse(event.data)

    switch (jsonOrder.order){
        case "createSheet": workbook.createSheet(jsonOrder.location.sheetName); break
        case "deleteSheet": workbook.deleteSheet(jsonOrder.location.sheetName); break
        case "renameSheet": getTargetSheet().name = jsonOrder.newName; break

        case "createRow"   : getTargetSheet().createRow(jsonOrder.location.rowIndex); break
        case "deleteRow"   : getTargetSheet().deleteRow(jsonOrder.location.rowIndex); break
        case "createColumn": getTargetSheet().createColumn(jsonOrder.location.cellIndex); break
        case "deleteColumn": getTargetSheet().deleteColumn(jsonOrder.location.cellIndex); break

        case "patchStyle": switch (jsonOrder.style){
            case "textAlign": switch (jsonOrder.value){
                case "left"  : setStyle((cell) => cell.style.textAlign = "start"); break
                case "right" : setStyle((cell) => cell.style.textAlign = "end"); break
                case "center": setStyle((cell) => cell.style.textAlign = "center"); break
            } break
            case "fontBold": {
                const fontWeight = jsonOrder.value ? "bold" : "normal"
                setStyle((cell) => cell.style.fontWeight = fontWeight)
            } break
            case "fontItalic": {
                const fontStyle = jsonOrder.value ? "italic" : "normal"
                setStyle((cell) => cell.style.fontStyle = fontStyle)
            } break
            case "fontUnderline": {
                const textDecoration = jsonOrder.value ? "underline" : "none"
                setStyle((cell) => cell.style.textDecoration = textDecoration)
            } break
            case "fontSize": setStyle((cell) => cell.style.fontSize = jsonOrder.value); break
            case "backgroundColor": setStyle((cell) => cell.style.backgroundColor = jsonOrder.value)
        } break

        default: alert("Unknown data: "+ event.data)
    }

    // High-ordering
    function setStyle(setStyleToCell) {
        for (const location of jsonOrder.locations) {
            setStyleToCell(getTargetSheet()
                .rows[location.rowIndex]
                .cells[location.cellIndex])
        }
        document.dispatchEvent(workbook.updateEvent)
    }

    function getTargetSheet(){
        return workbook.getSheetByName(jsonOrder.location.sheetName)
    }
}