package me.illyc.xlsx_web.service
import me.illyc.xlsx_web.controller.WebSocket
import me.illyc.xlsx_web.entities.*
import org.apache.poi.openxml4j.util.ZipSecureFile
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.xssf.usermodel.XSSFCell
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.stereotype.Service
import java.io.File
import java.io.FileOutputStream

@Service
class WorkbookService(private val spreader: WebSocket)
{
    private val catalogName = "catalog.xlsx"
    private val bufferName = "buffer-$catalogName"

    // Apache poi workbook object
    companion object var workbook: XSSFWorkbook

    init {
        // Zero InflateRatio to avoid the Zip bomb detected! exception
        ZipSecureFile.setMinInflateRatio(0.0)
        // The buffer file is the actual file
        if (File(bufferName).exists())
            XSSFWorkbook(bufferName).write(FileOutputStream(catalogName))

        workbook = XSSFWorkbook(catalogName)
    }

    @Synchronized // Must be synchronized for properly catalog file writing sequence
    fun executeOrder(order: Order) {
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
        // Writing changes to the buffer to safely rewrite the origin catalog file
        workbook.write(FileOutputStream(bufferName))
        spreader.spreadOrder(order)
    }

    private fun createSheet(loc: SheetLocation){
        if (loc.sheetName.length > 0)
            throw WorkbookException("Пошёл нахуй")
        val sheet = workbook.createSheet(loc.sheetName)
        converter.patchStyleToXSSFCell("textAlign", "center",
            sheet.createRow(0).createCell(0))
    }
    private fun deleteSheet(loc: SheetLocation) = workbook.removeSheetAt(workbook.getSheetIndex(loc.sheetName))
    private fun renameSheet(loc: SheetLocation, newName: String) = workbook
        .setSheetName(workbook.getSheetIndex(loc.sheetName), newName)

    private fun createRow(loc: RowLocation) {
        val sheet = workbook.getSheet(loc.sheetName)
        val newRowIndex = loc.rowIndex + 1

        // Shifting rows to make room for a new row
        if (newRowIndex <= sheet.lastRowNum)
            sheet.shiftRows(newRowIndex, sheet.lastRowNum, 1)

        val newRow = sheet.createRow(newRowIndex)
        // Filling the new row with new cells
        for (i in 0 until sheet.getRow(0).lastCellNum) {
            converter.patchStyleToXSSFCell("textAlign", "center", newRow.createCell(i))
        }
    }
    private fun deleteRow(loc: RowLocation) {
        val sheet = workbook.getSheet(loc.sheetName)
        sheet.removeRow(sheet.getRow(loc.rowIndex))

        // Shifting other rows up to fill the room
        if (loc.rowIndex < sheet.lastRowNum) {
            sheet.shiftRows(loc.rowIndex + 1, sheet.lastRowNum, -1)
        }
    }

    private fun createColumn(loc: ColumnLocation) {
        val newColumnId = loc.cellIndex + 1
        for (row in workbook.getSheet(loc.sheetName)) {

            // Shifting cells to make room for a new cell
            if (loc.cellIndex <= row.lastCellNum)
                shiftCellsInRow(row, newColumnId, 1)

            converter.patchStyleToXSSFCell("textAlign", "center",
                row.createCell(newColumnId) as XSSFCell)
        }
    }
    private fun deleteColumn(loc: ColumnLocation) {
        for (row in workbook.getSheet(loc.sheetName)) {
            row.removeCell(row.getCell(loc.cellIndex))

            // Shifting other cells left to fill the room
            if (loc.cellIndex < row.lastCellNum) {
                shiftCellsInRow(row, loc.cellIndex + 1, -1)
                row.removeCell(row.getCell(row.lastCellNum.toInt() - 1))
            }
        }
    }

    private fun patchText(loc: CellLocation, text: String) = workbook
        .getSheet(loc.sheetName).getRow(loc.rowIndex).getCell(loc.cellIndex).setCellValue(text)
    private fun patchStyle(locs: Set<CellLocation>, style: String, value: String) = locs
        .forEach{ loc -> converter.patchStyleToXSSFCell(style, value,
            workbook.getSheet(loc.sheetName).getRow(loc.rowIndex).getCell(loc.cellIndex)) }

    // Like Sheet.shiftRows() but for cells in a row
    private fun shiftCellsInRow(row: Row, from: Int, step: Int) {
        // Plows a cell in a row by id, creating it in a new location according to the step length
        fun plow(i: Int) {
            val cell = row.getCell(i)
            val newCell = row.createCell(i + step)
            converter.setSimpleCellValue(converter.getSimpleCellValue((cell as XSSFCell)), newCell as XSSFCell)
            newCell.setCellStyle(cell.cellStyle)
        }
        if (step > 0) for (i in row.lastCellNum - 1 downTo from)
            plow(i)
        else for (i in from until row.lastCellNum)
            plow(i)
    }
}

class WorkbookException(override val message: String?) : Exception()