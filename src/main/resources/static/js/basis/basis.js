import {workbook} from "./workbook/workbook.js"
import "./web/webSocket.js"
import "./tabsPad/interaction.js"

workbook.sheets.forEach(sheet => workbook.defineSheet(sheet))

// The sheet selected by default
workbook.activeSheet = workbook.sheets[0]