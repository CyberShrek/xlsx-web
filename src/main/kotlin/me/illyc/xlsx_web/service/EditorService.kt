package me.illyc.xlsx_web.service
import me.illyc.xlsx_web.controller.WebSocket
import me.illyc.xlsx_web.entity.CellLocation
import me.illyc.xlsx_web.entity.ColumnLocation
import me.illyc.xlsx_web.entity.RowLocation
import me.illyc.xlsx_web.entity.SheetLocation
import org.springframework.stereotype.Service

@Service
class EditorService(private val webSocket: WebSocket) {

    fun createSheet(loc: SheetLocation) {

        webSocket.spreadObject(object {
            val order = "createSheet"
            val location = loc
        })
    }

    fun deleteSheet(loc: SheetLocation) {
        webSocket.spreadObject(object {
            val order = "deleteSheet"
            val location = loc
        })
    }

    fun renameSheet(newName: String, loc: SheetLocation) {

        webSocket.spreadObject(object {
            val order = "renameSheet"
            val newName = newName
            val location = loc
        })
    }

    fun createRow(loc: RowLocation) {

        webSocket.spreadObject(object {
            val order = "createRow"
            val location = loc
        })
    }

    fun deleteRow(loc: RowLocation) {

        webSocket.spreadObject(object {
            val order = "deleteRow"
            val location = loc
        })
    }

    fun createColumn(loc: ColumnLocation) {
        webSocket.spreadObject(object {
            val order = "createColumn"
            val location = loc
        })
    }

    fun deleteColumn(loc: ColumnLocation) {
        webSocket.spreadObject(object {
            val order = "deleteColumn"
            val location = loc
        })
    }

    fun patchText(text: String, loc: CellLocation) {
        webSocket.spreadObject(object {
            val order = "patchText"
            val text = text
            val location = loc
        })
    }

    fun patchStyle(style: String, value: String, locs: Set<CellLocation>) {
        webSocket.spreadObject(object {
            val order = "patchStyle"
            val style = style
            val value = value
            val locations = locs
        })
    }
}