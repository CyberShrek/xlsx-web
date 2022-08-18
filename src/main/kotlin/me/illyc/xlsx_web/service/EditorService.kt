package me.illyc.xlsx_web.service
import me.illyc.xlsx_web.controller.WebSocket
import org.springframework.stereotype.Service

@Service
class EditorService(private val webSocket: WebSocket) {

    fun createSheet(sheetName: String) : Boolean {

        webSocket.spreadObject(object {
            val type = "createSheet"
            val sheetName = sheetName
        })
        return true
    }

    fun deleteSheet(sheetName: String): Boolean {

        webSocket.spreadObject(object {
            val type = "deleteSheet"
            val sheetName = sheetName
        })
        return true
    }

    fun renameSheet(sheetName: String, newName: String): Boolean {

        webSocket.spreadObject(object {
            val type = "renameSheet"
            val sheetName = sheetName
            val newName = newName
        })
        return true
    }

    fun createRow(sheetName: String, rowIndex: String): Boolean {

        webSocket.spreadObject(object {
            val type = "createRow"
            val sheetName = sheetName
            val rowIndex = rowIndex
        })
        return true
    }

    fun deleteRow(sheetName: String, rowIndex: String): Boolean {
        webSocket.spreadObject(object {
            val type = "deleteRow"
            val sheetName = sheetName
            val rowIndex = rowIndex
        })
        return true
    }

    fun createColumn(sheetName: String, cellIndex: String): Boolean {
        webSocket.spreadObject(object {
            val type = "createColumn"
            val sheetName = sheetName
            val cellIndex = cellIndex
        })
        return true
    }

    fun deleteColumn(sheetName: String, cellIndex: String): Boolean {
        webSocket.spreadObject(object {
            val type = "deleteColumn"
            val sheetName = sheetName
            val cellIndex = cellIndex
        })
        return true
    }

    fun patchCell(sheetName: String, rowIndex: String, cellIndex: String, patch: Map<String, String>): Boolean {

        webSocket.spreadObject(object {
            val type = "patchCell"
            val sheetName = sheetName
            val rowIndex = rowIndex
            val cellIndex = cellIndex
            val patch = patch
        })
        return true
    }
}