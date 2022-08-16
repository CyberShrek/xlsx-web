import {httpClient} from "../web/httpClient.js"

httpClient.createSheet=(sheetName) =>
    fetch("editor/sheets/"+sheetName, { method : "POST" })
        .then(response => response.ok)