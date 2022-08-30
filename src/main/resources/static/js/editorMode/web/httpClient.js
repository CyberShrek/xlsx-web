import {httpClient} from "../../basis/web/httpClient.js"

// SHEETS LEVEL
httpClient.createSheet=(sheetName) =>
    fetch(`editor/sheets/${sheetName}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteSheet=(sheetName) =>
    fetch(`editor/sheets/${sheetName}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

httpClient.renameSheet=(sheetName, newName) =>
    fetch(`editor/sheets/${sheetName}`, {
        method: "PATCH",
        body: newName
    }).then(response => handleResponse(response))

// ROWS AND COLUMNS LEVEL
httpClient.createRow=(sheetName, rowIndex) =>
    fetch(`editor/sheets/${sheetName}/rows/${rowIndex}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteRow=(sheetName, rowIndex) =>
    fetch(`editor/sheets/${sheetName}/rows/${rowIndex}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

httpClient.createColumn=(sheetName, cellIndex) =>
    fetch(`editor/sheets/${sheetName}/columns/${cellIndex}`, {
        method: "POST"
    }).then(response => handleResponse(response))

httpClient.deleteColumn=(sheetName, cellIndex) =>
    fetch(`editor/sheets/${sheetName}/columns/${cellIndex}`, {
        method: "DELETE"
    }).then(response => handleResponse(response))

// CELLS LEVEL
httpClient.patchCellText=(sheetName, rowIndex, cellIndex, text) =>
    fetch(`editor/sheets/${sheetName}/rows/${rowIndex}/cells/${cellIndex}`, {
        method: "PATCH",
        body: `"${text}"`
    }).then(response => handleResponse(response))

httpClient.patchStyle=(cells, styleName, action) => {
    const cellModels = []
}

function handleResponse(response) {
    if (!response.ok) throw new Error(response.status)
}