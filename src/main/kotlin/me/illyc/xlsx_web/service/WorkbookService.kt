package me.illyc.xlsx_web.service
import me.illyc.xlsx_web.controller.WebSocket
import me.illyc.xlsx_web.entity.*
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service
import java.io.FileOutputStream

@Service
class WorkbookService(private val spreader: WebSocket)
{
    private val catalogName = "catalog.xlsx"
    private val bufferName = "buffer-$catalogName"

    // Apache poi workbook object
    val workbook: XSSFWorkbook
    init {
        // Creating a catalog file buffer which allows to safely rewrite the origin catalog file
        XSSFWorkbook(catalogName).write(FileOutputStream(bufferName))
        workbook = XSSFWorkbook(bufferName)
    }

    fun executeOrder(order: Order){
        when(order){
            is CreateSheetOrder  -> createSheet(order.location)
            is DeleteSheetOrder  -> deleteSheet(order.location)
            is RenameSheetOrder  -> renameSheet(order.location, order.newName)
            is CreateRowOrder    -> createRow(order.location)
            is DeleteRowOrder    -> deleteRow(order.location)
            is CreateColumnOrder -> createColumn(order.location)
            is DeleteColumnOrder -> deleteColumn(order.location)
            is PatchTextOrder    -> patchText(order.location, order.text)
            is PatchStyleOrder   -> patchStyle(order.locations, order.style, order.value)
        }
        // Writing changes to the workbook
        workbook.write(FileOutputStream(catalogName))
        spreader.spreadOrder(order)
    }

    private fun createSheet(loc: SheetLocation){
        val sheet = workbook.createSheet(loc.sheetName)
        converter.patchStyleToXSSFCell("textAlign", "center",
            sheet.createRow(0).createCell(0))
    }
    private fun deleteSheet(loc: SheetLocation) = workbook.removeSheetAt(workbook.getSheetIndex(loc.sheetName))
    private fun renameSheet(loc: SheetLocation, newName: String) = workbook
        .setSheetName(workbook.getSheetIndex(loc.sheetName), newName)

    private fun createRow(loc: RowLocation) {
        val sheet = workbook.getSheet(loc.sheetName)

        // Shift lines to make room for a new line
        sheet.shiftRows(loc.rowIndex, sheet.lastRowNum, 1)

        val newRow = sheet.createRow(loc.rowIndex)

        // Filling the new row with new cells
        for (i in 0 until sheet.getRow(loc.rowIndex).lastCellNum) {
            val newCell = newRow.createCell(i)
            converter.patchStyleToXSSFCell("textAlign", "center", newCell)
        }
    }
    private fun deleteRow(loc: RowLocation){
        val sheet = workbook.getSheet(loc.sheetName)
        sheet.removeRow(sheet.getRow(loc.rowIndex))
    }
    private fun createColumn(loc: ColumnLocation) = workbook.getSheet(loc.sheetName).rowIterator()
        .forEach{ row -> row.createCell(loc.cellIndex) }
    private fun deleteColumn(loc: ColumnLocation) = workbook.getSheet(loc.sheetName).rowIterator()
        .forEach{ row -> row.removeCell(row.getCell(loc.cellIndex)) }

    private fun patchText(loc: CellLocation, text: String) = workbook
        .getSheet(loc.sheetName).getRow(loc.rowIndex).getCell(loc.cellIndex).setCellValue(text)

    private fun patchStyle(locs: Set<CellLocation>, style: String, value: String) = locs
        .forEach{ loc -> converter.patchStyleToXSSFCell(style, value,
            workbook.getSheet(loc.sheetName).getRow(loc.rowIndex).getCell(loc.cellIndex)) }
}