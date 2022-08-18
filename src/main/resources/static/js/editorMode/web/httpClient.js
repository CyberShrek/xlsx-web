import {httpClient} from "../../basis/web/httpClient.js"

// SHEETS LEVEL
httpClient.createSheet=(sheetName) =>
    fetch(`editor/sheets/${sheetName}`, { method : "POST" })
        .then(response => handleResponse(response))

httpClient.removeSheet=(sheetName) =>
    fetch(`editor/sheets/${sheetName}`, { method : "DELETE" })
        .then(response => handleResponse(response))

httpClient.renameSheet=(sheetName, newName) =>
    fetch(`editor/sheets/${sheetName}?newName=${newName}`, { method : "PATCH" })
        .then(response => handleResponse(response))

// ROWS AND COLUMNS LEVEL
httpClient.createRow=(sheetName, rowIndex) =>
    fetch(`editor/sheets/${sheetName}/rows/${rowIndex}`, {method : "POST"})
        .then(response => handleResponse(response))

httpClient.deleteRow=(sheetName, rowIndex) =>
    fetch(`editor/sheets/${sheetName}/rows/${rowIndex}`, {method : "DELETE"})
        .then(response => handleResponse(response))

httpClient.createColumn=(sheetName, cellIndex) =>
    fetch(`editor/sheets/${sheetName}/columns/${cellIndex}`, {method : "POST"})
        .then(response => handleResponse(response))

httpClient.deleteColumn=(sheetName, cellIndex) =>
    fetch(`editor/sheets/${sheetName}/columns/${cellIndex}`, {method : "DELETE"})
        .then(response => handleResponse(response))

// CELLS LEVEL
httpClient.patchCell=(sheetName, rowIndex, cellIndex, patch) =>
    fetch(`editor/sheets/${sheetName}/${rowIndex}/${cellIndex}?${patch}`, { method : "PATCH" })
        .then(response => handleResponse(response))

function handleResponse(response) {
    if (!response.ok) throw new Error(response.status)
}