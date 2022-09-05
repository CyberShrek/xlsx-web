import {httpClient} from "../../basis/web/httpClient.js"

// SHEETS LEVEL
httpClient.createSheet=(sheetName) =>
    fetch(`workbook/sheets/${sheetName}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteSheet=(sheetName) =>
    fetch(`workbook/sheets/${sheetName}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

httpClient.renameSheet=(sheetName, newName) =>
    fetch(`workbook/sheets/${sheetName}`, {
        method: "PATCH",
        body: newName
    }).then(response => handleResponse(response))

// ROWS AND COLUMNS LEVEL
httpClient.createRow=(rowLocation) =>
    fetch(`workbook/sheets/${rowLocation.sheetName}/rows/${rowLocation.rowIndex}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteRow=(rowLocation) =>
    fetch(`workbook/sheets/${rowLocation.sheetName}/rows/${rowLocation.rowIndex}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

httpClient.createColumn=(cellLocation) =>
    fetch(`workbook/sheets/${cellLocation.sheetName}/columns/${cellLocation.cellIndex}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteColumn=(cellLocation) =>
    fetch(`workbook/sheets/${cellLocation.sheetName}/columns/${cellLocation.cellIndex}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

// CELLS LEVEL
httpClient.patchCellText=(cellLocation, text) =>
    fetch(
        `workbook/sheets/${cellLocation.sheetName}/rows/${cellLocation.rowIndex}/cells/${cellLocation.cellIndex}`, {
        method: "PATCH",
        body: `"${text}"`
    }).then(response => handleResponse(response))

httpClient.patchStyle=(style, value, locations) => {
    fetch(`workbook/styles/${style}?value=${value}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(locations)
    }).then(response => handleResponse(response))
}

function handleResponse(response) {
    if (!response.ok) throw new Error(response.status)
}