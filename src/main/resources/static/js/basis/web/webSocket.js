import {workbook} from "../workbook/workbook.js"

const webSocket = new WebSocket(`ws://${document.location.host+document.location.pathname}spreader`)

webSocket.onmessage=(event) => {
    const jsonMessage = JSON.parse(event.data)

    switch (jsonMessage.order){
        case "createSheet": workbook.createSheet(jsonMessage.location.sheetName); break
        case "deleteSheet": workbook.deleteSheet(jsonMessage.location.sheetName); break
        case "renameSheet": workbook.getSheetByName(jsonMessage.location.sheetName).name = jsonMessage.newName; break

        case "createRow": workbook.activeSheet.createRow(jsonMessage.location.rowIndex); break
        case "deleteRow": workbook.activeSheet.deleteRow(jsonMessage.location.rowIndex); break
        case "createColumn": workbook.activeSheet.createColumn(jsonMessage.location.cellIndex); break
        case "deleteColumn": workbook.activeSheet.deleteColumn(jsonMessage.location.cellIndex); break

        case "patchStyle": switch (jsonMessage.style){
            case "textAlign": switch (jsonMessage.value){
                case "left": setStyle((cell) => cell.style.textAlign = "start"); break
                case "right": setStyle((cell) => cell.style.textAlign = "end"); break
                case "center": setStyle((cell) => cell.style.textAlign = "center"); break
            } break
            case "fontBold": {
                const fontWeight = jsonMessage.value ? "bold" : "normal"
                setStyle((cell) => cell.style.fontWeight = fontWeight)
            } break
            case "fontItalic": {
                const fontStyle = jsonMessage.value ? "italic" : "normal"
                setStyle((cell) => cell.style.fontStyle = fontStyle)
            } break
            case "fontUnderline": {
                const textDecoration = jsonMessage.value ? "underline" : "none"
                setStyle((cell) => cell.style.textDecoration = textDecoration)
            } break
            case "fontSize": setStyle((cell) => cell.style.fontSize = jsonMessage.value); break
            case "backgroundColor": setStyle((cell) => cell.style.backgroundColor = jsonMessage.value)
        } break

        default: alert("Unknown data: "+ event.data)
    }
    // High-ordering fun
    function setStyle(setStyleToCell) {
        for (const location of jsonMessage.locations) {
            setStyleToCell(workbook
                .getSheetByName(location.sheetName)
                .rows[location.rowIndex]
                .cells[location.cellIndex])
        }
    }
}