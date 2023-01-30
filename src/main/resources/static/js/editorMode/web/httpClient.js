import {httpClient} from "../../basis/web/httpClient.js"

// SHEETS LEVEL
httpClient.createSheet = (sheetName) =>
    fetch(`workbook/sheets/${sheetName}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteSheet = (sheetName) =>
    fetch(`workbook/sheets/${sheetName}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

httpClient.renameSheet = (sheetName, newName) =>
    fetch(`workbook/sheets/${sheetName}`, {
        method: "PATCH",
        body: newName
    }).then(response => handleResponse(response))

// ROWS AND COLUMNS LEVEL
httpClient.handleRow=(location, methodName) =>
    fetch(`workbook/sheets/${location.sheetName}/rows/${location.rowIndex}`, {
        method: methodName
    }).then(response => handleResponse(response))

httpClient.handleColumn=(location, methodName) =>
    fetch(`workbook/sheets/${location.sheetName}/columns/${location.cellIndex}`, {
        method: methodName
    }).then(response => handleResponse(response))

httpClient.createRow=(location)    => httpClient.handleRow(location,    "POST")
httpClient.deleteRow=(location)    => httpClient.handleRow(location,    "DELETE")
httpClient.createColumn=(location) => httpClient.handleColumn(location, "POST")
httpClient.deleteColumn=(location) => httpClient.handleColumn(location, "DELETE")

// CELLS LEVEL
httpClient.patchCell=(location, body) =>     fetch(
    `workbook/sheets/${location.sheetName}/rows/${location.rowIndex}/cells/${location.cellIndex}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }).then(response => handleResponse(response))

httpClient.patchCellText= (location, text)  => httpClient.patchCell(location, { text: text })
httpClient.patchCellStyle=(location, style) => httpClient.patchCell(location, { style: style })

///////////////////////////////////
function handleResponse(response) {
    if (!response.ok) {
        response.text()
            .then(text => { throw new Error(text) })

    }
}